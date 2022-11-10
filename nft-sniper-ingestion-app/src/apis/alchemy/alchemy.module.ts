import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AlchemyService, PrismaService],
  controllers: [],
})
export class AlchemyModule {}
