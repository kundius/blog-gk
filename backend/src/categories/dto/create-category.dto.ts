import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsOptional()
  @IsUUID()
  parentId?: string;


  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  @IsNotEmpty()
  alias!: string;

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
