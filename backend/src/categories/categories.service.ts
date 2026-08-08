import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

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
    return category;
  }

  async tree() {
    type CategoryRow = Prisma.CategoryGetPayload<{
      include: typeof CATEGORY_COUNT_INCLUDE;
    }>;
    type CategoryNode = CategoryRow & { children: CategoryNode[] };

    const rows = await this.prisma.category.findMany({
      include: CATEGORY_COUNT_INCLUDE,
      orderBy: CATEGORY_SORT_ORDER,
    });

    const byId = new Map<string, CategoryNode>();
    for (const row of rows) {
      byId.set(row.id, { ...row, children: [] });
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

    return roots;
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
