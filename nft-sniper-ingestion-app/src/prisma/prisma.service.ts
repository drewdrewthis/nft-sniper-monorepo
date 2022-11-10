import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { NormalizedNftData } from '../types';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async getTrackedNfts() {
    return this.nFT.findMany();
  }

  async saveMultipleNftData(data: Required<NormalizedNftData>[]) {
    data.map((item) => {
      this.saveSingleNftData(item);
    });
  }

  async saveSingleNftData(data: Required<NormalizedNftData>) {
    const {
      url,
      offers,
      rawJson,
      price,
      marketplaceName,
      tokenId,
      contractAddress,
    } = data;

    console.log(data);

    // Save rawJson
    const rawScrapeData = await this.rawScrapeData.create({
      data: {
        url,
        rawData: rawJson as Prisma.JsonObject,
      },
    });

    const marketplace = await this.marketplace.findFirstOrThrow({
      where: {
        name: marketplaceName,
      },
    });

    await this.historicalNftPrice.create({
      data: {
        ...price,
        marketplaceId: marketplace.id,
        tokenId,
        contractAddress,
        rawScrapeDataId: rawScrapeData.id,
      },
    });

    await this.historicalNftOffer.createMany({
      data: offers.map((offer) => ({
        ...offer,
        priceAmount: offer.priceAmount,
        marketplaceId: marketplace.id,
        tokenId,
        contractAddress,
        rawScrapeDataId: rawScrapeData.id,
      })),
    });
  }

  cleanDb() {
    return this.$transaction([
      // this.bookmark.deleteMany(),
      // this.user.deleteMany(),
    ]);
  }
}
