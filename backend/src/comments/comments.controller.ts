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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ListCommentsQueryDto } from './dto/list-comments.query';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get()
  findAll(@Query() query: ListCommentsQueryDto) {
    return this.commentsService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.commentsService.findOne(id) };
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCommentDto) {
    return { data: await this.commentsService.create(dto) };
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCommentDto) {
    return { data: await this.commentsService.update(id, dto) };
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.commentsService.remove(id);
  }
}
