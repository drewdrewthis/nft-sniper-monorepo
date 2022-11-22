import { Module } from '@nestjs/common';
import { HistoricalNftOfferController } from './historical-nft-offer.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HistoricalNftOfferService } from './historical-nft-offer.service';

@Module({
  controllers: [HistoricalNftOfferController],
  providers: [HistoricalNftOfferService, PrismaService],
  exports: [HistoricalNftOfferService, PrismaService],
})
export class HistoricalNftOfferModule {}
