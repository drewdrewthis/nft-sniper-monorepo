import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AlchemyService, PrismaService, ConfigService],
  exports: [AlchemyService],
  controllers: [],
})
export class AlchemyModule {}
