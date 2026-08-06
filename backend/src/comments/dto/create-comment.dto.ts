import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  raw?: string;

  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @IsOptional()
  @IsEmail()
  authorEmail?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsUUID()
  articleId?: string;
}
