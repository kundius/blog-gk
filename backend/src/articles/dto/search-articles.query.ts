import { IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchArticlesQueryDto extends PaginationDto {
  @IsString()
  q!: string;
}
