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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories.query';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll(@Query() query: ListCategoriesQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Public()
  @Get('tree')
  async tree() {
    return { data: await this.categoriesService.tree() };
  }

  @Public()
  @Get('by-alias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    return { data: await this.categoriesService.findByAlias(alias) };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.categoriesService.findOne(id) };
  }

  @Roles('admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryDto) {
    return { data: await this.categoriesService.create(dto) };
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
    return { data: await this.categoriesService.update(id, dto) };
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoriesService.remove(id);
  }
}
