import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

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

    const [total, data] = await Promise.all([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
        where,
        include: { _count: { select: { articles: true } } },
        orderBy: parseSort(query.sort, { name: 'asc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
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
          include: { _count: { select: { articles: true } } },
          orderBy: { name: 'asc' },
        },
        _count: { select: { articles: true } },
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async tree() {
    type CategoryRow = Prisma.CategoryGetPayload<{
      include: { _count: { select: { articles: true } } };
    }>;
    type CategoryNode = CategoryRow & { children: CategoryNode[] };

    const rows = await this.prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: 'asc' },
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
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
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
