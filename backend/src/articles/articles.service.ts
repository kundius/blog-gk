import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticlesQueryDto } from './dto/list-articles.query';
import { SearchArticlesQueryDto } from './dto/search-articles.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

const ARTICLE_LIST_INCLUDE = {
  category: true,
  thumbnail: true,
} satisfies Prisma.ArticleInclude;

const ARTICLE_DETAIL_INCLUDE = {
  category: true,
  thumbnail: true,
  tags: { include: { tag: true }, orderBy: { sort: 'asc' } },
  files: { include: { file: true }, orderBy: { sort: 'asc' } },
} satisfies Prisma.ArticleInclude;

const EXTRA_INCLUDES: Record<string, Prisma.ArticleInclude> = {
  category: { category: true },
  thumbnail: { thumbnail: true },
  tags: { tags: { include: { tag: true }, orderBy: { sort: 'asc' } } },
  files: { files: { include: { file: true }, orderBy: { sort: 'asc' } } },
  comments: { comments: true },
};

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListArticlesQueryDto) {
    const where: Prisma.ArticleWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.categoryAlias ? { category: { alias: query.categoryAlias } } : {}),
      ...(query.tagId ? { tags: { some: { tagId: query.tagId } } } : {}),
      ...(query.tagAlias ? { tags: { some: { tag: { alias: query.tagAlias } } } } : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        include: { ...ARTICLE_LIST_INCLUDE, ...this.parseInclude(query.include) },
        orderBy: parseSort(query.sort, { dateCreated: 'desc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: ARTICLE_DETAIL_INCLUDE,
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(dto: CreateArticleDto) {
    await this.validateReferences(dto);

    return this.prisma.article.create({
      data: {
        name: dto.name,
        alias: dto.alias,
        status: dto.status ?? 'draft',
        content: dto.content,
        excerpt: dto.excerpt,
        categoryId: dto.categoryId,
        thumbnailId: dto.thumbnailId,
        ingredients: dto.ingredients as Prisma.InputJsonValue | undefined,
        portionCount: dto.portionCount,
        cookingTime: dto.cookingTime,
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
        seoDescription: dto.seoDescription,
        dateCreated: new Date(),
        tags: { create: (dto.tags ?? []).map((tagId, i) => ({ tagId, sort: i })) },
        files: { create: (dto.files ?? []).map((fileId, i) => ({ fileId, sort: i })) },
      },
      include: ARTICLE_DETAIL_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.ensureExists(id);
    await this.validateReferences(dto);

    return this.prisma.$transaction(async (tx) => {
      if (dto.tags) {
        await tx.articleTag.deleteMany({ where: { articleId: id } });
        if (dto.tags.length) {
          await tx.articleTag.createMany({
            data: dto.tags.map((tagId, i) => ({ articleId: id, tagId, sort: i })),
          });
        }
      }

      if (dto.files) {
        await tx.articleFile.deleteMany({ where: { articleId: id } });
        if (dto.files.length) {
          await tx.articleFile.createMany({
            data: dto.files.map((fileId, i) => ({ articleId: id, fileId, sort: i })),
          });
        }
      }

      return tx.article.update({
        where: { id },
        data: {
          name: dto.name,
          alias: dto.alias,
          status: dto.status,
          content: dto.content,
          excerpt: dto.excerpt,
          categoryId: dto.categoryId,
          thumbnailId: dto.thumbnailId,
          ingredients: dto.ingredients as Prisma.InputJsonValue | undefined,
          portionCount: dto.portionCount,
          cookingTime: dto.cookingTime,
          seoTitle: dto.seoTitle,
          seoKeywords: dto.seoKeywords,
          seoDescription: dto.seoDescription,
          dateUpdated: new Date(),
        },
        include: ARTICLE_DETAIL_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.article.delete({ where: { id } });
  }

  async addLike(id: string) {
    const article = await this.ensureExists(id);
    return this.prisma.article.update({
      where: { id },
      data: { likesCount: article.likesCount + 1 },
      select: { likesCount: true },
    });
  }

  async removeLike(id: string) {
    const article = await this.ensureExists(id);
    return this.prisma.article.update({
      where: { id },
      data: { likesCount: Math.max(0, article.likesCount - 1) },
      select: { likesCount: true },
    });
  }

  async addHit(id: string) {
    await this.ensureExists(id);
    return this.prisma.article.update({
      where: { id },
      data: { hitsCount: { increment: 1 } },
      select: { hitsCount: true },
    });
  }

  async related(id: string, limit?: number) {
    const article = await this.ensureExists(id);
    return this.prisma.article.findMany({
      where: {
        categoryId: article.categoryId,
        status: 'published',
        id: { not: id },
      },
      include: ARTICLE_LIST_INCLUDE,
      orderBy: { dateCreated: 'desc' },
      take: limit ?? 5,
    });
  }

  async search(query: SearchArticlesQueryDto) {
    const q = query.q.trim();
    if (!q) {
      return { data: [], meta: buildPaginationMeta(0, query.page, query.limit) };
    }

    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRaw<Array<{ id: string }>>`
        SELECT a.id
        FROM articles a
        WHERE make_tsvector(a.name, a.content) @@ plainto_tsquery('russian', ${q})
        ORDER BY ts_rank(make_tsvector(a.name, a.content), plainto_tsquery('russian', ${q})) DESC
        LIMIT ${query.limit} OFFSET ${(query.page - 1) * query.limit}
      `,
      this.prisma.$queryRaw<Array<{ count: number }>>`
        SELECT COUNT(*)::int AS count
        FROM articles a
        WHERE make_tsvector(a.name, a.content) @@ plainto_tsquery('russian', ${q})
      `,
    ]);

    const total = countRows[0]?.count ?? 0;
    const ids = rows.map((row) => row.id);
    if (ids.length === 0) {
      return { data: [], meta: buildPaginationMeta(total, query.page, query.limit) };
    }

    const articles = await this.prisma.article.findMany({
      where: { id: { in: ids } },
      include: ARTICLE_LIST_INCLUDE,
    });

    const order = new Map(ids.map((id, index) => [id, index]));
    articles.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    return { data: articles, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  private parseInclude(include?: string): Prisma.ArticleInclude {
    if (!include) return {};

    const result: Prisma.ArticleInclude = {};
    for (const name of include.split(',').map((part) => part.trim()).filter(Boolean)) {
      const extra = EXTRA_INCLUDES[name];
      if (extra) {
        Object.assign(result, extra);
      }
    }
    return result;
  }

  private async validateReferences(dto: {
    categoryId?: string;
    thumbnailId?: string;
    tags?: string[];
    files?: string[];
  }) {
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
        select: { id: true },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    if (dto.thumbnailId) {
      const thumbnail = await this.prisma.file.findUnique({
        where: { id: dto.thumbnailId },
        select: { id: true },
      });
      if (!thumbnail) {
        throw new BadRequestException('Thumbnail file not found');
      }
    }

    if (dto.tags?.length) {
      const count = await this.prisma.tag.count({ where: { id: { in: dto.tags } } });
      if (count !== dto.tags.length) {
        throw new BadRequestException('Some tags do not exist');
      }
    }

    if (dto.files?.length) {
      const count = await this.prisma.file.count({ where: { id: { in: dto.files } } });
      if (count !== dto.files.length) {
        throw new BadRequestException('Some files do not exist');
      }
    }
  }

  private async ensureExists(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { id: true, likesCount: true, categoryId: true },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
