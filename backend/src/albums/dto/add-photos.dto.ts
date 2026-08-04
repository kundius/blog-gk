import { ArrayUnique, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AddPhotosDto {
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  fileIds!: string[];
}
