import { Module } from '@nestjs/common';
import { OpenseaService } from './opensea.service';
import { OpenseaController } from './opensea.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [OpenseaService, PrismaService],
  controllers: [OpenseaController],
})
export class OpenseaModule {}
