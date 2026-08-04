import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { ListSubscribersQueryDto } from './dto/list-subscribers.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

@Injectable()
export class SubscribersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListSubscribersQueryDto) {
    const where: Prisma.SubscriberWhereInput = query.search
      ? { email: { contains: query.search, mode: 'insensitive' } }
      : {};

    const [total, data] = await Promise.all([
      this.prisma.subscriber.count({ where }),
      this.prisma.subscriber.findMany({
        where,
        orderBy: parseSort(query.sort, { dateCreated: 'desc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async create(dto: CreateSubscriberDto) {
    return this.prisma.subscriber.create({
      data: { email: dto.email, dateCreated: new Date() },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.subscriber.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException('Subscriber not found');
    }
    await this.prisma.subscriber.delete({ where: { id } });
  }
}
