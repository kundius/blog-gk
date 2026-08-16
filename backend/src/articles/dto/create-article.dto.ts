import { ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
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
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categories?: string[];

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
  @IsString()
  calories?: string;

  @IsOptional()
  @IsString()
  protein?: string;

  @IsOptional()
  @IsString()
  fat?: string;

  @IsOptional()
  @IsString()
  carbs?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  files?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(4)
  @IsUUID('4', { each: true })
  relatedIds?: string[];

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
