import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import {
  Skill,
  TargetGender,
  Workout,
  WorkoutTime,
  WorkoutType,
} from 'src/shared/types/app.type';

export class CreateWorkoutDto
  implements Omit<Workout, 'coach' | 'rating' | 'backgroundUri'>
{
  @ApiProperty({
    description: 'Name of the workout',
    example: 'Workout',
    minLength: 1,
    maxLength: 15,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  name: string;

  @ApiProperty({
    description: 'Skill level',
    example: Skill.Newbie,
    enum: Skill,
  })
  @IsEnum(Skill)
  skill: Skill;

  @ApiProperty({
    description: 'Time of the workout',
    example: WorkoutTime.Fast,
    enum: WorkoutTime,
  })
  @IsEnum(WorkoutTime)
  workoutTime: WorkoutTime;

  @ApiProperty({
    description: 'Type of the workout',
    example: WorkoutType.Strength,
    enum: WorkoutType,
  })
  @IsEnum(WorkoutType)
  workoutType: WorkoutType;

  @ApiProperty({
    description: 'Price of the workout',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Calories burned',
    example: 1000,
    minimum: 1000,
    maximum: 5000,
  })
  @IsNumber()
  @Min(1000)
  @Max(5000)
  calories: number;

  @ApiProperty({
    description: 'Description of the workout',
    example: 'This is a workout',
    minLength: 10,
    maxLength: 140,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(140)
  description: string;

  @ApiProperty({
    description: 'gender of the target audience',
    example: TargetGender.ForBoth,
    enum: TargetGender,
  })
  @IsEnum(TargetGender)
  gender: TargetGender;

  @ApiProperty({
    description: 'Video uri',
    example: 'https://example.com/video.mp4',
  })
  @IsString()
  videoUri: string;

  @ApiProperty({
    description: 'Is special offer',
    example: false,
  })
  @IsBoolean()
  isSpecialOffer: boolean;
}
