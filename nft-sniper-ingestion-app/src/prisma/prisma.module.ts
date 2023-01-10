import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  logger = new Logger(PrismaModule.name);

  constructor(private readonly prisma: PrismaService) {}

  // async onApplicationShutdown() {
  //   return this.prisma.$disconnect();
  // }
}
