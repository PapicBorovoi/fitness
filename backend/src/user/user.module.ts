import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { AuthRepository } from 'src/auth/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/shared/db/db.module';
import { ConfigService } from '@nestjs/config';
import { JWTAccessStrategy } from 'src/shared/strategies/jwt-access.strategy';
import { CoachModule } from 'src/coach/coach.module';
import { CoachService } from 'src/coach/coach.service';
import { CoachRepository } from 'src/coach/coach.repository';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    CoachModule,
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
  controllers: [UserController],
  providers: [
    CoachService,
    CoachRepository,
    AuthService,
    UserRepository,
    UserService,
    AuthRepository,
    JWTAccessStrategy,
  ],
})
export class UserModule {}
