import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ArticleContentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
