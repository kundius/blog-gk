import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ListCollectionsQueryDto } from './dto/list-collections.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

const COLLECTION_DETAIL_INCLUDE = {
  thumbnail: true,
  articles: {
    include: {
      article: {
        include: {
          category: true,
          thumbnail: true,
        },
      },
    },
    orderBy: { sort: 'asc' },
  },
} satisfies Prisma.CollectionInclude;

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCollectionsQueryDto) {
    const where: Prisma.CollectionWhereInput = {
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { alias: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.featured !== undefined ? { showOnHome: query.featured === 'true' } : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.collection.count({ where }),
      this.prisma.collection.findMany({
        where,
        include: {
          thumbnail: true,
          _count: { select: { articles: true } },
        },
        orderBy: parseSort(query.sort, { name: 'asc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: COLLECTION_DETAIL_INCLUDE,
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async findByAlias(alias: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { alias },
      include: COLLECTION_DETAIL_INCLUDE,
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async create(dto: CreateCollectionDto) {
    if (dto.thumbnailId) {
      await this.validateFile(dto.thumbnailId);
    }
    const articleIds = dto.articleIds ?? [];
    await this.validateArticles(articleIds);

    return this.prisma.collection.create({
      data: {
        name: dto.name,
        alias: dto.alias,
        description: dto.description,
        thumbnailId: dto.thumbnailId,
        showOnHome: dto.showOnHome ?? false,
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
        seoDescription: dto.seoDescription,
        dateCreated: new Date(),
        articles: {
          create: articleIds.map((articleId, i) => ({ articleId, sort: i })),
        },
      },
      include: COLLECTION_DETAIL_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.ensureExists(id);
    if (dto.thumbnailId) {
      await this.validateFile(dto.thumbnailId);
    }
    if (dto.articleIds !== undefined) {
      await this.validateArticles(dto.articleIds);
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.articleIds !== undefined) {
        await tx.collectionArticle.deleteMany({ where: { collectionId: id } });
        if (dto.articleIds.length) {
          await tx.collectionArticle.createMany({
            data: dto.articleIds.map((articleId, i) => ({
              collectionId: id,
              articleId,
              sort: i,
            })),
          });
        }
      }

      return tx.collection.update({
        where: { id },
        data: {
          name: dto.name,
          alias: dto.alias,
          description: dto.description,
          thumbnailId: dto.thumbnailId,
          showOnHome: dto.showOnHome,
          seoTitle: dto.seoTitle,
          seoKeywords: dto.seoKeywords,
          seoDescription: dto.seoDescription,
          dateUpdated: new Date(),
        },
        include: COLLECTION_DETAIL_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.collection.delete({ where: { id } });
  }

  private async validateFile(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId }, select: { id: true } });
    if (!file) {
      throw new BadRequestException('Thumbnail file not found');
    }
  }

  private async validateArticles(articleIds: string[]) {
    if (!articleIds.length) return;
    const count = await this.prisma.article.count({ where: { id: { in: articleIds } } });
    if (count !== articleIds.length) {
      throw new BadRequestException('Some articles do not exist');
    }
  }

  private async ensureExists(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
  }
}
