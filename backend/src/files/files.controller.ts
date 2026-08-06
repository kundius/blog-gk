import {
  BadRequestException,
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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { ListFilesQueryDto } from './dto/list-files.query';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Roles('admin')
  @Get()
  findAll(@Query() query: ListFilesQueryDto) {
    return this.filesService.findAll(query);
  }

  @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() meta: UpdateFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('file field is required');
    }
    return { data: await this.filesService.upload(file, meta) };
  }

  @Public()
  @Get(':id/file')
  async file(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    await this.filesService.stream(id, res, false);
  }

  @Public()
  @Get(':id/download')
  async download(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    await this.filesService.stream(id, res, true);
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFileDto) {
    return { data: await this.filesService.update(id, dto) };
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.filesService.remove(id);
  }
}
