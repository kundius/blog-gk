import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
  @IsOptional()
  @IsUUID()
  parentId?: string;


  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  alias?: string;

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
