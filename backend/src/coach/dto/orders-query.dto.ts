import { IsEnum, IsOptional } from 'class-validator';
import { SortDirection } from 'src/shared/types/common.enum';

export class OrdersQueryDto {
  @IsEnum(SortDirection)
  @IsOptional()
  bougthAmound?: SortDirection;

  @IsEnum(SortDirection)
  @IsOptional()
  earned?: SortDirection;
}
