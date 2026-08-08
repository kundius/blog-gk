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
  files: { include: { file: true }, orderBy: { sort: 'asc' } },
  categories: { include: { category: true }, orderBy: { sort: 'asc' } },
} satisfies Prisma.ArticleInclude;

const EXTRA_INCLUDES: Record<string, Prisma.ArticleInclude> = {
  category: { category: true },
  thumbnail: { thumbnail: true },
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
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    if (query.dateFrom || query.dateTo) {
      where.dateCreated = {
        ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
        ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
      };
    }

    if (query.categories) {
      const ids = await this.categoryIdsByAliases(query.categories);
      where.categories = { some: { categoryId: { in: ids } } };
    }

    if (query.categoriesNotIn) {
      const ids = await this.categoryIdsByAliases(query.categoriesNotIn);
      if (ids.length > 0) {
        where.categories = { none: { categoryId: { in: ids } } };
      }
    }

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

  async findByAlias(alias: string) {
    const article = await this.prisma.article.findUnique({
      where: { alias },
      include: ARTICLE_DETAIL_INCLUDE,
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
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
    const categoryIds = this.normalizeCategoryIds(dto.categories, dto.categoryId);
    await this.validateReferences({
      categories: categoryIds,
      thumbnailId: dto.thumbnailId,
      files: dto.files,
    });

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
        files: { create: (dto.files ?? []).map((fileId, i) => ({ fileId, sort: i })) },
        categories: {
          create: categoryIds.map((categoryId, i) => ({ categoryId, sort: i })),
        },
      },
      include: ARTICLE_DETAIL_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.ensureExists(id);

    let categoryIds: string[] | undefined;
    if (dto.categories !== undefined || dto.categoryId !== undefined) {
      const current = await this.prisma.article.findUnique({
        where: { id },
        select: { categoryId: true },
      });
      const base = dto.categories ?? (current ? [current.categoryId] : []);
      categoryIds = this.normalizeCategoryIds(
        base,
        dto.categoryId ?? current?.categoryId,
      );
    }

    await this.validateReferences({
      categoryId: dto.categoryId,
      categories: categoryIds,
      thumbnailId: dto.thumbnailId,
      files: dto.files,
    });

    return this.prisma.$transaction(async (tx) => {
      if (dto.files) {
        await tx.articleFile.deleteMany({ where: { articleId: id } });
        if (dto.files.length) {
          await tx.articleFile.createMany({
            data: dto.files.map((fileId, i) => ({ articleId: id, fileId, sort: i })),
          });
        }
      }

      if (categoryIds !== undefined) {
        await tx.articleCategory.deleteMany({ where: { articleId: id } });
        if (categoryIds.length) {
          await tx.articleCategory.createMany({
            data: categoryIds.map((categoryId, i) => ({ articleId: id, categoryId, sort: i })),
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

  async prev(id: string) {
    return this.neighbor(id, 'prev');
  }

  async next(id: string) {
    return this.neighbor(id, 'next');
  }

  private async neighbor(id: string, direction: 'prev' | 'next') {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { id: true, categoryId: true, dateCreated: true },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const isNext = direction === 'next';
    return this.prisma.article.findFirst({
      where: {
        categoryId: article.categoryId,
        status: 'published',
        id: { not: id },
        ...(isNext
          ? { dateCreated: { gt: article.dateCreated ?? new Date(0) } }
          : { dateCreated: { lt: article.dateCreated ?? new Date(0) } }),
      },
      orderBy: { dateCreated: isNext ? 'asc' : 'desc' },
      include: {
        category: { select: { name: true, alias: true } },
      },
    });
  }

  private normalizeCategoryIds(categories: string[] | undefined, primary?: string): string[] {
    return Array.from(new Set([...(categories ?? []), ...(primary ? [primary] : [])]));
  }

  private async categoryIdsByAliases(categoriesCsv: string): Promise<string[]> {
    const aliases = categoriesCsv.split(',').map((part) => part.trim()).filter(Boolean);
    if (aliases.length === 0) {
      return [];
    }

    const rows = await this.prisma.category.findMany({
      where: { alias: { in: aliases } },
      select: { id: true },
    });

    return rows.map((row) => row.id);
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
    categories?: string[];
    thumbnailId?: string;
    files?: string[];
  }) {
    const categoryIds = Array.from(
      new Set([...(dto.categories ?? []), ...(dto.categoryId ? [dto.categoryId] : [])]),
    );
    if (categoryIds.length > 0) {
      const count = await this.prisma.category.count({
        where: { id: { in: categoryIds } },
      });
      if (count !== categoryIds.length) {
        throw new BadRequestException('Some categories do not exist');
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
