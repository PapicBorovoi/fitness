import { ApiProperty } from '@nestjs/swagger';
import { Gender, MetroStation, Role } from '../../shared/types/app.type';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'tractor',
    description: 'name',
    required: true,
  })
  @MinLength(1)
  @MaxLength(15)
  public name: string;

  @ApiProperty({
    example: 'tractor@test.com',
    description: 'email',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email' })
  public email: string;

  @ApiProperty({
    example: 'password',
    description: 'password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  public password: string;

  @ApiProperty({
    example: 'avatar.png',
    description: 'avatar',
    required: false,
  })
  @IsString()
  @IsOptional()
  public avatarUri: string;

  @ApiProperty({
    example: Gender.Male,
    description: 'gender',
    required: true,
  })
  @IsEnum(Gender)
  public gender: Gender;

  @ApiProperty({
    example: new Date(),
    description: 'date of birth',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  public birthday: string;

  @ApiProperty({
    example: 'my name is tractor and i am a communist',
    description: 'description of user',
    required: true,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(140)
  public description: string;

  @ApiProperty({
    example: Role.User,
    description: 'role in system',
    required: true,
  })
  @IsEnum(Role)
  public roleType: Role;

  @ApiProperty({
    example: MetroStation.Udelnaya,
    description: 'nearest metro station',
    required: true,
  })
  @IsEnum(MetroStation)
  public location: MetroStation;

  @ApiProperty({
    example: 'background.png',
    description: 'Uri to background image',
    required: true,
  })
  @IsString()
  public backgroundUri: string;
}
