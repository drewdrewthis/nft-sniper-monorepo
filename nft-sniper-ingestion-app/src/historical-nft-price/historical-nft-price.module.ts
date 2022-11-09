import { Module } from '@nestjs/common';
import { HistoricalNftPriceService } from './historical-nft-price.service';
import { PrismaService } from '../prisma/prisma.service';
import { HistoricalNftPriceController } from './historical-nft-price.controller';

@Module({
  providers: [HistoricalNftPriceService, PrismaService],
  controllers: [HistoricalNftPriceController],
})
export class HistoricalNftPriceModule {}
