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
  controllers: [UserController],
  providers: [
    AuthService,
    UserRepository,
    UserService,
    AuthRepository,
    JWTAccessStrategy,
  ],
})
export class UserModule {}
