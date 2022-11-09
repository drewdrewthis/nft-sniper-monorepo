import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
    const trackedNfts = await this.prisma.nFT.findMany();

    const latestScrape =
      (await this.prisma.rawScrapeData.findMany({
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
        },
        take: 1,
      })) || [];

    const data = await this.prisma.historicalNftOffer.findMany({
      where: {
        rawScrapeDataId: latestScrape[0].id,
        tokenId: {
          in: trackedNfts.map((t) => t.tokenId),
        },
        contractAddress: {
          in: trackedNfts.map((t) => t.contractAddress),
        },
      },
    });

    return data.map((item) => {
      return {
        ...item,
      };
    });
  }
}
