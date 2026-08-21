import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RelatedPickDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsOptional()
  excludeId?: string;
}
