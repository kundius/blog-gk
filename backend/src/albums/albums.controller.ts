import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AddPhotosDto } from './dto/add-photos.dto';
import { ListAlbumsQueryDto } from './dto/list-albums.query';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll(@Query() query: ListAlbumsQueryDto) {
    return this.albumsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.albumsService.findOne(id) };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAlbumDto) {
    return { data: await this.albumsService.create(dto) };
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAlbumDto) {
    return { data: await this.albumsService.update(id, dto) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.albumsService.remove(id);
  }

  @Post(':id/photos')
  @HttpCode(HttpStatus.CREATED)
  async addPhotos(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AddPhotosDto) {
    return { data: await this.albumsService.addPhotos(id, dto) };
  }

  @Delete(':id/photos/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ) {
    await this.albumsService.removePhoto(id, fileId);
  }
}
