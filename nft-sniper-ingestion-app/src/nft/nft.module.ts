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

@Module({
  imports: [
    HttpModule,
    ResevoirModule,
    AlchemyModule,
    PrismaModule,
    HistoricalNftOfferModule,
  ],
  exports: [NftService, NftServiceV2],
  controllers: [NftController],
  providers: [NftService, NftServiceV2, ConfigService],
})
export class NftModule {}
