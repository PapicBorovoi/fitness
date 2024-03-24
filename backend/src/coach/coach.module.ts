import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachRepository } from './coach.repository';
import { CoachController } from './coach.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseModule } from 'src/shared/db/db.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { JWTAccessStrategy } from 'src/shared/strategies/jwt-access.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
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
  controllers: [CoachController],
  providers: [
    CoachService,
    CoachRepository,
    AuthService,
    AuthRepository,
    JWTAccessStrategy,
  ],
})
export class CoachModule {}
