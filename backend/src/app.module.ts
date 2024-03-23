import { Module } from '@nestjs/common';
import { ConfigAppModule } from './shared/config/config-app.module';
import { UserModule } from './user/user.module';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [ConfigAppModule, UserModule, CoachModule],
})
export class AppModule {}
