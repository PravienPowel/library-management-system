import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global means we don't have to import this in every module
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}