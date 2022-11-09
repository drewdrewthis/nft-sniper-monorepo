import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { compact, groupBy } from 'lodash/fp';

@Injectable()
export class HistoricalNftOfferService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistoricalOffers(options: {
    tokenIds?: number[];
    contractAddress?: string;
    limit?: number;
  }) {
    console.log(options.tokenIds);
    const data = await this.prisma.historicalNftOffer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where:
        options.tokenIds || options.contractAddress
          ? {
              tokenId: {
                in: options.tokenIds,
              },
              contractAddress: options.contractAddress,
            }
          : undefined,
      take: options.limit ? Number(options.limit) : undefined,
      include: {
        rawScrapeData: false,
      },
    });

    return data.map((item) => {
      return {
        ...item,
      };
    });
  }

  async getLastestOffers() {
    const nfts = await this.prisma.nFT.findMany({
      select: {
        historicalOffers: {
          orderBy: {
            rawScrapeDataId: 'desc',
          },
          take: 1,
        },
      },
    });

    const ids = compact(
      nfts.map((nft) => nft.historicalOffers[0]?.rawScrapeDataId),
    );

    return await this.prisma.historicalNftOffer.findMany({
      orderBy: {
        rawScrapeDataId: 'desc',
      },
      where: {
        rawScrapeDataId: {
          in: ids,
        },
      },
    });
  }
}
