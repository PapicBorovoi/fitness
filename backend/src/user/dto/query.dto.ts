import {
  MetroStation,
  Role,
  Skill,
  WorkoutType,
} from 'src/shared/types/app.type';
import { GetUsersQuery } from '../user.type';
import { IsEnum, IsOptional, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto implements GetUsersQuery {
  @IsEnum(Skill)
  @IsOptional()
  skill?: Skill;

  @IsEnum(WorkoutType)
  @IsOptional()
  workoutType?: WorkoutType;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsEnum(MetroStation)
  @IsOptional()
  location?: MetroStation;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  @IsOptional()
  take?: number;
}
