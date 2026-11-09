import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Wraps PrismaClient so other services can inject it
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Nest calls this once when the app starts, so we connect to the database here
  async onModuleInit() {
    await this.$connect();
  }
}