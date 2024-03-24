import { Expose } from 'class-transformer';
import {
  CoachRole,
  Gender,
  MetroStation,
  Role,
  // Skill,
  UserRole,
  // WorkoutTime,
  // WorkoutType,
} from './../../shared/types/app.type';
import { ApiProperty } from '@nestjs/swagger';
export class UserRdo {
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  @Expose()
  public id: number;

  @ApiProperty({
    example: 'tractor',
    description: 'name',
  })
  @Expose()
  public name: string;

  @ApiProperty({
    example: 'tractor@tractor.com',
    description: 'email',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    example: 'avatar.png',
    description: 'avatarUri',
  })
  @Expose()
  public avatarUri: string;

  @ApiProperty({
    example: Gender.Female,
    description: 'gender',
  })
  @Expose()
  public gender: Gender;

  @ApiProperty({
    example: new Date(),
    description: 'birthday',
  })
  @Expose()
  public birthday: Date;

  @ApiProperty({
    example: Role.User,
    description: 'roleType',
  })
  @Expose()
  public roleType: Role;

  @ApiProperty({
    example: 'description',
    description: 'description',
  })
  @Expose()
  public description: string;

  @ApiProperty({
    example: MetroStation.Pionerskaya,
    description: 'location',
  })
  @Expose()
  public location: MetroStation;

  @ApiProperty({
    example: 'background.png',
    description: 'backgroundUri',
  })
  @Expose()
  public backgroundUri: string;

  @ApiProperty({
    example: {
      skill: 'newbie',
      workoutType: 'yoga',
      workoutTime: 'fast',
      caloriesToBurn: 1000,
      caloriesToSpend: 2000,
      isReadyForWorkout: true,
    },
    description: 'role',
  })
  @Expose()
  public role?: UserRole | CoachRole;

  @ApiProperty({
    example: 'fdfsdf.dasd.1ddew',
    description: 'access token',
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    example: 'fsdfsd.d1ddf.12dd',
    description: 'refresh token',
  })
  @Expose()
  public refreshToken: string;

  // @Expose()
  // public skill?: Skill;

  // @Expose()
  // public workoutType?: WorkoutType;

  // @Expose()
  // public workoutTime?: WorkoutTime;

  // @Expose()
  // public caloriesToBurn?: number;

  // @Expose()
  // public caloriesToSpend?: number;

  // @Expose()
  // public isReadyForWorkout?: boolean;

  // @Expose()
  // public sertifikatUri?: string;

  // @Expose()
  // public merits?: string;

  // @Expose()
  // public isReadyToCoach?: boolean;
}
