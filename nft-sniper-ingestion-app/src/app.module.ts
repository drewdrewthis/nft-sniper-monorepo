import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule, PrismaService } from './prisma';
import { OpenseaModule } from './opensea/opensea.module';
import { ConfigModule } from '@nestjs/config';
import { BullmqModule } from './bullmq/bullmq.module';
import { CrawlerServerService } from './apis/crawler-server/crawler-server.service';
import { CrawlerServerModule } from './apis/crawler-server/crawler-server.module';
import { X2y2Module, X2y2Service } from './apis/x2y2';
import { BullmqService } from './bullmq/bullmq.service';
import { schema } from './config/joi.schema';
import { HttpModule } from '@nestjs/axios';
import { HistoricalNftPriceModule } from './historical-nft-price/historical-nft-price.module';
import { HistoricalNftOfferModule } from './historical-nft-offer/historical-nft-offer.module';
import endpoints from './config/endpoints';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: schema,
      load: [endpoints],
    }),
    PrismaModule,
    OpenseaModule,
    BullmqModule,
    CrawlerServerModule,
    X2y2Module,
    HttpModule,
    HistoricalNftPriceModule,
    HistoricalNftOfferModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    CrawlerServerService,
    BullmqService,
    X2y2Service,
  ],
})
export class AppModule {}
