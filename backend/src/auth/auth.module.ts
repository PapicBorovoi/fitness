import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from 'src/shared/strategies/jwt-refresh.strategy';
import { JWTAccessStrategy } from 'src/shared/strategies/jwt-access.strategy';
import { DatabaseModule } from 'src/shared/db/db.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: (configservice: ConfigService) => ({
        secret: configservice.get('app.jwt.accessTokenSecret'),
        signOptions: {
          expiresIn: configservice.get('app.jwt.accessTokenExpiresIn'),
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtRefreshStrategy,
    JWTAccessStrategy,
  ],
})
export class AuthModule {}
