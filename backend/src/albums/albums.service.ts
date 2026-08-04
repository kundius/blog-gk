import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AddPhotosDto } from './dto/add-photos.dto';
import { ListAlbumsQueryDto } from './dto/list-albums.query';
import { buildPaginationMeta } from '../common/dto/pagination.dto';
import { parseSort } from '../common/utils/sort';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListAlbumsQueryDto) {
    const where: Prisma.AlbumWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { alias: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      this.prisma.album.count({ where }),
      this.prisma.album.findMany({
        where,
        include: {
          thumbnail: true,
          _count: { select: { photos: true } },
        },
        orderBy: parseSort(query.sort, { name: 'asc' }),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return { data, meta: buildPaginationMeta(total, query.page, query.limit) };
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        thumbnail: true,
        photos: { include: { file: true }, orderBy: { sort: 'asc' } },
      },
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(dto: CreateAlbumDto) {
    if (dto.thumbnailId) {
      await this.validateFile(dto.thumbnailId);
    }
    return this.prisma.album.create({ data: dto });
  }

  async update(id: string, dto: UpdateAlbumDto) {
    await this.ensureExists(id);
    if (dto.thumbnailId) {
      await this.validateFile(dto.thumbnailId);
    }
    return this.prisma.album.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.album.delete({ where: { id } });
  }

  async addPhotos(id: string, dto: AddPhotosDto) {
    await this.ensureExists(id);

    const existing = await this.prisma.albumFile.findMany({
      where: { albumId: id, fileId: { in: dto.fileIds } },
      select: { fileId: true },
    });
    const alreadyLinked = new Set(existing.map((row) => row.fileId));

    const newFileIds = dto.fileIds.filter((fileId) => !alreadyLinked.has(fileId));
    if (newFileIds.length) {
      const count = await this.prisma.file.count({ where: { id: { in: newFileIds } } });
      if (count !== newFileIds.length) {
        throw new BadRequestException('Some files do not exist');
      }

      const maxSort = await this.prisma.albumFile.aggregate({
        where: { albumId: id },
        _max: { sort: true },
      });
      const baseSort = maxSort._max.sort ?? -1;

      await this.prisma.albumFile.createMany({
        data: newFileIds.map((fileId, i) => ({
          albumId: id,
          fileId,
          sort: baseSort + 1 + i,
        })),
      });
    }

    return this.findOne(id);
  }

  async removePhoto(id: string, fileId: string) {
    await this.ensureExists(id);
    const result = await this.prisma.albumFile.deleteMany({
      where: { albumId: id, fileId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Photo not found in album');
    }
  }

  private async validateFile(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId }, select: { id: true } });
    if (!file) {
      throw new BadRequestException('Thumbnail file not found');
    }
  }

  private async ensureExists(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id }, select: { id: true } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
  }
}
