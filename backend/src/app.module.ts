import { Module } from '@nestjs/common';
import { ConfigAppModule } from './shared/config/config-app.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigAppModule, UserModule],
})
export class AppModule {}
