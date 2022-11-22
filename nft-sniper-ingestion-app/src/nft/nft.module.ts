import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { HttpModule } from '@nestjs/axios';
import { NftService } from './nft.service';
import { ResevoirModule } from '../apis/resevoir/resevoir.module';
import { DemoModule } from '../demo/demo.module';
import { AlchemyModule } from '../apis/alchemy/alchemy.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoricalNftOfferModule } from '../historical-nft-offer/historical-nft-offer.module';

@Module({
  imports: [
    HttpModule,
    ResevoirModule,
    DemoModule,
    AlchemyModule,
    PrismaModule,
    HistoricalNftOfferModule,
  ],
  exports: [NftService],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
