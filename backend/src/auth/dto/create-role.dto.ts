import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CoachRole, Role, UserRole } from 'src/shared/types/app.type';
import { CoachRoleDto } from './coach-role.dto';
import { UserRoleDto } from './user-role.dto';

export class CreateRoleDto {
  @ApiProperty({
    example: Role.User,
  })
  @IsEnum(Role)
  roleType: Role;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @IsNotEmptyObject()
  @Type(() => CoachRoleDto)
  coachRole?: CoachRole;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => UserRoleDto)
  userRole?: UserRole;
}
