import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  Skill,
  TargetGender,
  Workout,
  WorkoutTime,
  WorkoutType,
} from 'src/shared/types/app.type';

export class UpdateWorkoutDto
  implements Partial<Omit<Workout, 'id' | 'coachId'>>
{
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  @IsOptional()
  @ApiProperty({
    example: 'yoga',
    description: 'name',
  })
  name?: string;

  @IsString()
  @ApiProperty({
    example: 'default.png',
    description: 'backgound',
  })
  @IsOptional()
  backgroundUri?: string;

  @IsEnum(Skill)
  @ApiProperty({
    example: Skill.Professional,
    description: 'skill level',
  })
  @IsOptional()
  skill?: Skill;

  @IsEnum(WorkoutTime)
  @ApiProperty({
    example: WorkoutTime.Fast,
    description: 'workout time',
  })
  @IsOptional()
  workoutTime?: WorkoutTime;

  @IsEnum(WorkoutType)
  @ApiProperty({
    example: WorkoutType.Yoga,
    description: 'workout type',
  })
  @IsOptional()
  workoutType?: WorkoutType;

  @IsNumber()
  @ApiProperty({
    example: 10,
    description: 'price',
  })
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @ApiProperty({
    example: 100,
    description: 'calories',
  })
  @Min(1000)
  @Max(5000)
  @IsOptional()
  calories?: number;

  @IsString()
  @ApiProperty({
    example: 'description',
    description: 'description',
  })
  @MinLength(10)
  @MaxLength(140)
  @IsOptional()
  description?: string;

  @IsEnum(TargetGender)
  @ApiProperty({
    example: TargetGender,
    description: 'targeted gender',
  })
  @IsOptional()
  gender?: TargetGender;

  @IsString()
  @ApiProperty({
    example: 'video.mp4',
    description: 'video uri',
  })
  @IsOptional()
  videoUri?: string;

  @IsString()
  @ApiProperty({
    example: 'thumbnail.png',
    description: 'thumbnail uri',
  })
  @IsOptional()
  isSpecialOffer?: boolean;
}
