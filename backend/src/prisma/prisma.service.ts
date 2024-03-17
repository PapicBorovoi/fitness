import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
  constructor() {
    super({
      log: process.env.ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : ['error'],
    })
  }
 
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
