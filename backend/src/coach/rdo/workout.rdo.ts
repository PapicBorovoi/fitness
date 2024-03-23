import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Skill,
  TargetGender,
  Workout,
  WorkoutTime,
  WorkoutType,
} from 'src/shared/types/app.type';

export class WorkoutRdo implements Omit<Workout, 'coach'> {
  @ApiProperty({
    type: String,
    description: 'The id of the workout',
  })
  @Expose()
  id?: string;

  @ApiProperty({
    type: String,
    description: 'The name of the workout',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    description: 'The uri of the background image',
  })
  @Expose()
  backgroundUri: string;

  @ApiProperty({
    type: String,
    description: 'The id of the coach',
  })
  @Expose()
  coachId: string;

  @ApiProperty({
    enum: WorkoutType,
    description: 'The type of the workout',
  })
  @Expose()
  workoutType: WorkoutType;

  @ApiProperty({
    enum: WorkoutTime,
    description: 'The time of the workout',
  })
  @Expose()
  workoutTime: WorkoutTime;

  @ApiProperty({
    enum: Skill,
    description: 'The skill of the workout',
  })
  @Expose()
  skill: Skill;

  @ApiProperty({
    enum: TargetGender,
    description: 'target gender',
  })
  @Expose()
  gender: TargetGender;

  @ApiProperty({
    type: Number,
    description: 'The calories of the workout',
  })
  @Expose()
  calories: number;

  @ApiProperty({
    type: Number,
    description: 'The price of the workout',
  })
  @Expose()
  price: number;

  @ApiProperty({
    type: String,
    description: 'The description of the workout',
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: String,
    description: 'The uri of the video',
  })
  @Expose()
  videoUri: string;

  @ApiProperty({
    type: Number,
    description: 'The rating of the workout',
  })
  @Expose()
  rating: number;

  @ApiProperty({
    type: Number,
    description: 'The number of ratings',
  })
  @Expose()
  isSpecialOffer: boolean;
}
