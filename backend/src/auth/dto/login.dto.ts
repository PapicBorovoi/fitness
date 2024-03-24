import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'goon@gmail.com',
    description: 'email',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email' })
  public email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  public password: string;
}
