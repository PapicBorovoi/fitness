import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenRdo {
  @ApiProperty({
    example: '13fewf.141fwef.e131232',
    description: 'accessToken',
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    example: '243223f.1r432.3231',
    description: 'refresh token',
  })
  @Expose()
  public refreshToken: string;
}
