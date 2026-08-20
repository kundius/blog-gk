import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';
import {
  buildAncestors,
  CATEGORY_ANCESTOR_SELECT,
} from '../common/utils/category-ancestors';

const CATEGORY_COUNT_INCLUDE = {
  _count: { select: { articleCategories: true } },
  thumbnail: true,
} as const;

const CATEGORY_SORT_ORDER = [
  { sort: { sort: 'asc', nulls: 'last' } as const },
  { name: 'asc' as const },
];

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCategoriesQueryDto) {
    const where: Prisma.CategoryWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { alias: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy = query.sort ? parseSort(query.sort, { name: 'asc' }) : CATEGORY_SORT_ORDER;

    const [total, data] = await Promise.all([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
        where,
        include: CATEGORY_COUNT_INCLUDE,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: CATEGORY_COUNT_INCLUDE,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findByAlias(alias: string) {
    const category = await this.prisma.category.findUnique({
      where: { alias },
      include: {
        parent: true,
        children: {
          include: CATEGORY_COUNT_INCLUDE,
          orderBy: CATEGORY_SORT_ORDER,
        },
        _count: { select: { articleCategories: true } },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const rows = await this.prisma.category.findMany({
      select: CATEGORY_ANCESTOR_SELECT,
    });
    const enriched = {
      ...category,
      ancestors: buildAncestors(rows, category.parentId),
    };
    const collages = await this.collageThumbnails([enriched, ...enriched.children]);
    return {
      ...enriched,
      collageThumbnails: collages.get(enriched.id) ?? null,
      children: enriched.children.map((child) => ({
        ...child,
        collageThumbnails: collages.get(child.id) ?? null,
      })),
    };
  }

  async tree() {
    type CategoryRow = Prisma.CategoryGetPayload<{
      include: typeof CATEGORY_COUNT_INCLUDE;
    }>;
    type CategoryNode = CategoryRow & {
      children: CategoryNode[];
      collageThumbnails: Array<Prisma.FileGetPayload<{}>> | null;
    };

    const rows = await this.prisma.category.findMany({
      include: CATEGORY_COUNT_INCLUDE,
      orderBy: CATEGORY_SORT_ORDER,
    });

    const byId = new Map<string, CategoryNode>();
    for (const row of rows) {
      byId.set(row.id, { ...row, children: [], collageThumbnails: null });
    }

    const roots: CategoryNode[] = [];
    for (const row of rows) {
      const node = byId.get(row.id)!;
      if (row.parentId && byId.has(row.parentId)) {
        byId.get(row.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    const flat: CategoryNode[] = [];
    const walk = (nodes: CategoryNode[]) => {
      for (const node of nodes) {
        flat.push(node);
        walk(node.children);
      }
    };
    walk(roots);

    const collages = await this.collageThumbnails(flat);
    for (const node of flat) {
      node.collageThumbnails = collages.get(node.id) ?? null;
    }

    return roots;
  }

  private async collageThumbnails(
    targets: Array<{ id: string; thumbnailId?: string | null }>,
  ): Promise<Map<string, Array<Prisma.FileGetPayload<{}>>>> {
    const map = new Map<string, Array<Prisma.FileGetPayload<{}>>>();
    const need = targets.filter((item) => !item.thumbnailId);
    if (need.length === 0) {
      return map;
    }

    const rows = await this.prisma.category.findMany({
      select: { id: true, parentId: true },
    });
    const childrenByParent = new Map<string | null, string[]>();
    for (const row of rows) {
      const list = childrenByParent.get(row.parentId) ?? [];
      list.push(row.id);
      childrenByParent.set(row.parentId, list);
    }
    const subtreeIds = (id: string): string[] => {
      const ids: string[] = [];
      const queue = [id];
      while (queue.length > 0) {
        const current = queue.pop()!;
        ids.push(current);
        for (const child of childrenByParent.get(current) ?? []) {
          queue.push(child);
        }
      }
      return ids;
    };

    await Promise.all(
      need.map(async (category) => {
        const ids = subtreeIds(category.id);
        const articles = await this.prisma.article.findMany({
          where: {
            status: 'published',
            thumbnailId: { not: null },
            OR: [
              { categoryId: { in: ids } },
              { categories: { some: { categoryId: { in: ids } } } },
            ],
          },
          orderBy: { hitsCount: 'desc' },
          select: { thumbnail: true },
          take: 10,
        });
        const seen = new Set<string>();
        const files: Array<Prisma.FileGetPayload<{}>> = [];
        for (const article of articles) {
          if (!article.thumbnail || seen.has(article.thumbnail.id)) {
            continue;
          }
          seen.add(article.thumbnail.id);
          files.push(article.thumbnail);
        }
        map.set(category.id, files);
      }),
    );

    return map;
  }

  async create(dto: CreateCategoryDto) {
    await this.validateThumbnail(dto.thumbnailId);
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);
    await this.validateThumbnail(dto.thumbnailId);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
  }

  private async validateThumbnail(thumbnailId?: string) {
    if (!thumbnailId) return;
    const thumbnail = await this.prisma.file.findUnique({
      where: { id: thumbnailId },
      select: { id: true },
    });
    if (!thumbnail) {
      throw new BadRequestException('Thumbnail file not found');
    }
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Category not found');
    }
  }
}
