import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { HttpModule } from '@nestjs/axios';
import { NftService } from './nft.service';
import { ResevoirModule } from '../apis/resevoir/resevoir.module';
import { AlchemyModule } from '../apis/alchemy/alchemy.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoricalNftOfferModule } from '../historical-nft-offer/historical-nft-offer.module';
import { ConfigService } from '../config/config.service';
import { NftServiceV2 } from './nft.service.v2';
import { HistoricalNftOfferService } from '../historical-nft-offer/historical-nft-offer.service';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { ResevoirService } from '../apis/resevoir/resevoir.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ResevoirModule,
    AlchemyModule,
    PrismaModule,
    HistoricalNftOfferModule,
    ConfigModule,
  ],
  exports: [
    NftService,
    NftServiceV2,
    HistoricalNftOfferService,
    AlchemyService,
    ConfigService,
    ResevoirService,
  ],
  controllers: [NftController],
  providers: [
    NftService,
    NftServiceV2,
    ConfigService,
    HistoricalNftOfferService,
    AlchemyService,
    ResevoirService,
  ],
})
export class NftModule {}
