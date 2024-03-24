import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { WorkoutTime } from 'src/shared/types/app.type';

export class WorkoutsQueryDto {
  @IsOptional()
  priceFrom?: number;

  @IsOptional()
  priceTo?: number;

  @IsOptional()
  caloriesFrom?: number;

  @IsOptional()
  caloriesTo?: number;

  @IsOptional()
  rating?: number;

  @IsArray()
  @IsEnum(WorkoutTime, {
    each: true,
  })
  @IsNotEmpty()
  @IsOptional()
  workoutTime?: WorkoutTime[];

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  take?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}
