import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ListCommentsQueryDto } from './dto/list-comments.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

const COMMENT_INCLUDE = {
  parent: {
    include: {
      parent: true,
    },
  },
  article: {
    select: { id: true, name: true, alias: true, categoryId: true },
  },
} satisfies Prisma.CommentInclude;

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCommentsQueryDto) {
    const where: Prisma.CommentWhereInput = {
      ...(query.articleId ? { articleId: query.articleId } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.comment.count({ where }),
      this.prisma.comment.findMany({
        where,
        include: COMMENT_INCLUDE,
        orderBy: parseSort(query.sort, { dateCreated: 'desc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: COMMENT_INCLUDE,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async create(dto: CreateCommentDto) {
    return this.prisma.$transaction(async (tx) => {
      let articleId = dto.articleId;

      if (dto.parentId) {
        const parent = await tx.comment.findUnique({
          where: { id: dto.parentId },
          select: { id: true, articleId: true },
        });
        if (!parent) {
          throw new NotFoundException('Parent comment not found');
        }
        articleId = articleId ?? parent.articleId ?? undefined;
      }

      const comment = await tx.comment.create({
        data: {
          content: dto.content,
          raw: dto.raw,
          authorName: dto.authorName,
          authorEmail: dto.authorEmail,
          parentId: dto.parentId,
          articleId,
          status: dto.status ?? 'published',
          dateCreated: new Date(),
        },
      });

      if (articleId) {
        await tx.article.update({
          where: { id: articleId },
          data: { commentsCount: { increment: 1 } },
        });
      }

      return comment;
    });
  }

  async update(id: string, dto: UpdateCommentDto) {
    await this.ensureExists(id);
    return this.prisma.comment.update({
      where: { id },
      data: {
        content: dto.content,
        raw: dto.raw,
        authorName: dto.authorName,
        status: dto.status,
        dateUpdated: new Date(),
      },
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { id: true, status: true, articleId: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.comment.delete({ where: { id } });
      if (comment.articleId && comment.status === 'published') {
        await tx.article.update({
          where: { id: comment.articleId },
          data: { commentsCount: { decrement: 1 } },
        });
      }
    });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.comment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Comment not found');
    }
  }
}
