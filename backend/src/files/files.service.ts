import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Response } from 'express';
import { pipeline } from 'node:stream/promises';
import sharp from 'sharp';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService, StorageObject } from '../storage/storage.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { ListFilesQueryDto } from './dto/list-files.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findAll(query: ListFilesQueryDto) {
    const where: Prisma.FileWhereInput = query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { filenameDownload: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      this.prisma.file.count({ where }),
      this.prisma.file.findMany({
        where,
        orderBy: parseSort(query.sort, { createdAt: 'desc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async upload(file: Express.Multer.File, meta: UpdateFileDto) {
    const extension = extname(file.originalname).toLowerCase();
    const filenameDisk = `${randomUUID()}${extension}`;

    let width: number | undefined;
    let height: number | undefined;
    if (file.mimetype.startsWith('image/')) {
      try {
        const metadata = await sharp(file.buffer).metadata();
        width = metadata.width;
        height = metadata.height;
      } catch {
        this.logger.warn(`Failed to read image dimensions for ${file.originalname}`);
      }
    }

    await this.storage.put(filenameDisk, file.buffer, file.mimetype || undefined);

    return this.prisma.file.create({
      data: {
        filenameDisk,
        filenameDownload: file.originalname,
        title: meta.title || file.originalname,
        description: meta.description,
        type: file.mimetype || null,
        filesize: file.size,
        width,
        height,
      },
    });
  }

  async update(id: string, dto: UpdateFileDto) {
    await this.ensureExists(id);
    return this.prisma.file.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
      },
    });
  }

  async remove(id: string) {
    const file = await this.ensureExists(id);

    if (file.filenameDisk) {
      try {
        await this.storage.remove(file.filenameDisk);
      } catch {
        this.logger.warn(`Failed to delete S3 object ${file.filenameDisk}`);
      }
    }

    await this.prisma.file.delete({ where: { id } });
  }

  async stream(id: string, res: Response, attachment: boolean) {
    const file = await this.ensureExists(id);

    if (!file.filenameDisk) {
      throw new NotFoundException('File has no storage key');
    }

    let object: StorageObject;
    try {
      object = await this.storage.get(file.filenameDisk);
    } catch {
      throw new NotFoundException('File not found in storage');
    }

    res.setHeader('Content-Type', file.type ?? 'application/octet-stream');
    const contentLength = object.contentLength ?? file.filesize;
    if (contentLength !== undefined && contentLength !== null) {
      res.setHeader('Content-Length', String(contentLength));
    }

    const disposition = attachment ? 'attachment' : 'inline';
    res.setHeader(
      'Content-Disposition',
      `${disposition}; filename*=UTF-8''${encodeURIComponent(file.filenameDownload)}`,
    );

    try {
      await pipeline(object.body, res);
    } catch {
      this.logger.warn(`Stream aborted for file ${id}`);
    }
  }

  private async ensureExists(id: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }
}
