import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsJsonValue } from '../../common/validators/is-json-value';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsUUID()
  thumbnailId?: string;

  @IsOptional()
  @IsJsonValue()
  ingredients?: unknown;

  @IsOptional()
  @IsString()
  portionCount?: string;

  @IsOptional()
  @IsString()
  cookingTime?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  files?: string[];

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoKeywords?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;
}
