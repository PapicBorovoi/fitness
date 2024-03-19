import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from 'src/shared/strategies/jwt-refresh.strategy';
import { JWTAccessStrategy } from 'src/shared/strategies/jwt-access.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: (configservice: ConfigService) => ({
        secret: configservice.get('app.jwt.accessTokenSecret'),
        signOptions: {
          expiresIn: configservice.get('app.jwt.accessTokenExpiresIn'),
          encoding: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    JwtRefreshStrategy,
    JWTAccessStrategy,
  ],
})
export class UserModule {}
