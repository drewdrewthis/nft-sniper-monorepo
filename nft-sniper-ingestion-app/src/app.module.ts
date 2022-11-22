import { CacheModule, CacheStore, Module } from '@nestjs/common';
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
import { AlchemyModule } from './apis/alchemy/alchemy.module';
import endpoints from './config/endpoints';
import { NftModule } from './nft/nft.module';
import { HistoricalNftOfferService } from './historical-nft-offer/historical-nft-offer.service';
import { ResevoirModule } from './apis/resevoir/resevoir.module';
import { DemoModule } from './demo/demo.module';
import { redisStore } from 'cache-manager-ioredis-yet';
import type { RedisOptions } from 'ioredis';

const { REDIS_HOST, REDIS_PORT } = process.env;

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
    AlchemyModule,
    CacheModule.register<RedisOptions>({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,

      // Store-specific configuration:
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
    }),
    NftModule,
    ResevoirModule,
    DemoModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    CrawlerServerService,
    HistoricalNftOfferService,
    BullmqService,
    X2y2Service,
  ],
})
export class AppModule {}
