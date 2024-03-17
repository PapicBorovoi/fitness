import { Module } from '@nestjs/common';
import { ConfigAppModule } from './shared/config/config-app.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigAppModule],
  controllers: [UserModule],
  providers: [],
})
export class AppModule {}
