import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  amount?: string;
}

export class NutritionCalcDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];
}
