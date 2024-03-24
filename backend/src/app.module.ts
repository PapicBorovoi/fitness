import { Module } from '@nestjs/common';
import { ConfigAppModule } from './shared/config/config-app.module';
import { AuthModule } from './auth/auth.module';
import { CoachModule } from './coach/coach.module';

@Module({
  imports: [ConfigAppModule, AuthModule, CoachModule],
})
export class AppModule {}
