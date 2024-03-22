import { ApiProperty } from '@nestjs/swagger';
import {
  Gender,
  MetroStation,
  Skill,
  WorkoutTime,
  WorkoutType,
} from '../../shared/types/app.type';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'tractor',
    description: 'name',
    required: false,
  })
  @MinLength(1)
  @MaxLength(15)
  @IsOptional()
  public name?: string;

  @ApiProperty({
    example: 'avatar.png',
    description: 'avatar',
    required: false,
  })
  @IsString()
  @IsOptional()
  public avatarUri?: string;

  @ApiProperty({
    example: Gender.Male,
    description: 'gender',
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  public gender?: Gender;

  @ApiProperty({
    example: new Date(),
    description: 'date of birth',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  public birthday?: string;

  @ApiProperty({
    example: 'my name is tractor and i am a communist',
    description: 'description of user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(140)
  public description?: string;

  @ApiProperty({
    example: MetroStation.Udelnaya,
    description: 'nearest metro station',
    required: false,
  })
  @IsOptional()
  @IsEnum(MetroStation)
  public location?: MetroStation;

  @ApiProperty({
    example: 'background.png',
    description: 'Uri to background image',
    required: false,
  })
  @IsString()
  @IsOptional()
  public backgroundUri?: string;

  @ApiProperty({
    example: Skill.Newbie,
    description: 'skill',
    required: false,
  })
  @IsOptional()
  @IsEnum(Skill)
  public skill?: Skill;

  @ApiProperty({
    example: WorkoutType.Yoga,
    description: 'workout type',
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkoutType)
  public workoutType?: WorkoutType;

  @ApiProperty({
    example: WorkoutTime.Fast,
    description: 'workout time',
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkoutTime)
  public workoutTime?: WorkoutTime;

  @ApiProperty({
    example: 1000,
    description: 'calories to burn',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(5000)
  caloriesToBurn?: number;

  @ApiProperty({
    example: 3000,
    description: 'calories to spend',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(5000)
  caloriesToSpend?: number;

  @ApiProperty({
    example: true,
    description: 'is ready for workout',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isReadyForWorkout?: boolean;

  @ApiProperty({
    example: 'sertifikat.png',
    description: 'sertifikat uri',
    required: false,
  })
  @IsString()
  @IsOptional()
  sertifikatUri?: string;

  @ApiProperty({
    example: 'great coach',
    description: 'merits',
    required: false,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(140)
  @IsOptional()
  merits?: string;

  @ApiProperty({
    example: true,
    description: 'is ready to coach',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isReadyToCoach?: boolean;
}
