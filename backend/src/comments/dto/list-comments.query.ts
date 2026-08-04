import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ListCommentsQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  articleId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
