import { IsEnum, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export enum Method {
  Delete = 'delete',
  Add = 'add',
}

export class UpdateBalanceDto {
  @IsEnum(Method)
  method: Method;

  @IsString()
  @IsUUID()
  workoutId: string;

  @IsNumber()
  @Min(1)
  num: number;
}
