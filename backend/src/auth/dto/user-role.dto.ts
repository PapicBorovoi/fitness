import { IsBoolean, IsEnum, IsNumber, Max, Min } from 'class-validator';
import {
  Skill,
  UserRole,
  WorkoutTime,
  WorkoutType,
} from 'src/shared/types/app.type';

export class UserRoleDto implements UserRole {
  @IsEnum(Skill)
  skill: Skill;

  @IsEnum(WorkoutType)
  workoutType: WorkoutType;

  @IsEnum(WorkoutTime)
  workoutTime: WorkoutTime;

  @IsNumber()
  @Min(1000)
  @Max(5000)
  caloriesToBurn: number;

  @IsNumber()
  @Min(1000)
  @Max(5000)
  caloriesToSpend: number;

  @IsBoolean()
  isReadyForWorkout: boolean;
}
