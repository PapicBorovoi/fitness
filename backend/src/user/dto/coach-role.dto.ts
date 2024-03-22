import {
  IsBoolean,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CoachRole, Skill, WorkoutType } from 'src/shared/types/app.type';

export class CoachRoleDto implements CoachRole {
  @IsEnum(Skill)
  skill: Skill;

  @IsEnum(WorkoutType)
  workoutType: WorkoutType;

  @IsString()
  sertifikatUri: string;

  @MaxLength(140)
  @IsString()
  @MinLength(10)
  merits: string;

  @IsBoolean()
  isReadyToCoach: boolean;
}
