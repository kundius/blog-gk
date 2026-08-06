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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticlesQueryDto } from './dto/list-articles.query';
import { SearchArticlesQueryDto } from './dto/search-articles.query';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get()
  findAll(@Query() query: ListArticlesQueryDto) {
    return this.articlesService.findAll(query);
  }

  @Public()
  @Get('search')
  search(@Query() query: SearchArticlesQueryDto) {
    return this.articlesService.search(query);
  }

  @Public()
  @Get('by-alias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    return { data: await this.articlesService.findByAlias(alias) };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.articlesService.findOne(id) };
  }

  @Public()
  @Get(':id/related')
  async related(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: string,
  ) {
    return {
      data: await this.articlesService.related(id, limit ? Number(limit) : undefined),
    };
  }

  @Public()
  @Get(':id/prev')
  async prev(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.articlesService.prev(id) };
  }

  @Public()
  @Get(':id/next')
  async next(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.articlesService.next(id) };
  }

  @Roles('admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateArticleDto) {
    return { data: await this.articlesService.create(dto) };
  }

  @Public()
  @Post(':id/like')
  async addLike(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.articlesService.addLike(id) };
  }

  @Public()
  @Delete(':id/like')
  async removeLike(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.articlesService.removeLike(id) };
  }

  @Public()
  @Post(':id/hit')
  async addHit(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.articlesService.addHit(id) };
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateArticleDto) {
    return { data: await this.articlesService.update(id, dto) };
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.articlesService.remove(id);
  }
}
