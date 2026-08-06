import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListArticlesQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  categoryAlias?: string;

  @IsOptional()
  @IsString()
  categories?: string;

  @IsOptional()
  @IsString()
  categoriesNotIn?: string;

  @IsOptional()
  @IsString()
  include?: string;
}
