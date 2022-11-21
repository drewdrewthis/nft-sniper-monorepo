import { Module } from '@nestjs/common';
import { HistoricalNftOfferService } from '../historical-nft-offer/historical-nft-offer.service';
import { PrismaService } from '../prisma';
import { NftController } from './nft.controller';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { HttpModule } from '@nestjs/axios';
import { NftService } from './nft.service';
import { DemoService } from '../demo/demo.service';
import { ResevoirService } from '../apis/resevoir/resevoir.service';

@Module({
  imports: [HttpModule],
  controllers: [NftController],
  providers: [
    HistoricalNftOfferService,
    PrismaService,
    AlchemyService,
    NftService,
    ResevoirService,
    DemoService,
  ],
})
export class NftModule {}
