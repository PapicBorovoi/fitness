import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    host: configService.get('app.db.host'),
    port: configService.get('app.db.port'),
    database: configService.get('app.db.name'),
    user: configService.get('app.db.username'),
    password: configService.get('app.db.password'),
  });
};

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: databasePoolFactory,
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
