import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsString()
  raw?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  authorName?: string;

  @IsOptional()
  @IsIn(['published', 'pending'])
  status?: string;
}
