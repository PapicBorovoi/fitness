import {
  MetroStation,
  Role,
  Skill,
  WorkoutType,
} from 'src/shared/types/app.type';
import { GetUsersQuery } from '../user.type';
import { IsEnum, IsOptional } from 'class-validator';

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
}
