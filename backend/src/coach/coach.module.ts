import { Module } from '@nestjs/common';
import { CoachService } from './coach.service';
import { CoachRepository } from './coach.repository';
import { CoachController } from './coach.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { DatabaseModule } from 'src/shared/db/db.module';
import { UserRepository } from 'src/user/user.repository';
import { JWTAccessStrategy } from 'src/shared/strategies/jwt-access.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
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
    UserService,
    UserRepository,
    JWTAccessStrategy,
  ],
})
export class CoachModule {}
