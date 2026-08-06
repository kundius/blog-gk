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
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Public()
  @Get()
  findAll(@Query() query: ListAlbumsQueryDto) {
    return this.albumsService.findAll(query);
  }

  @Public()
  @Get('by-alias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    return { data: await this.albumsService.findByAlias(alias) };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.albumsService.findOne(id) };
  }

  @Roles('admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAlbumDto) {
    return { data: await this.albumsService.create(dto) };
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAlbumDto) {
    return { data: await this.albumsService.update(id, dto) };
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.albumsService.remove(id);
  }

  @Roles('admin')
  @Post(':id/photos')
  @HttpCode(HttpStatus.CREATED)
  async addPhotos(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AddPhotosDto) {
    return { data: await this.albumsService.addPhotos(id, dto) };
  }

  @Roles('admin')
  @Delete(':id/photos/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ) {
    await this.albumsService.removePhoto(id, fileId);
  }
}
