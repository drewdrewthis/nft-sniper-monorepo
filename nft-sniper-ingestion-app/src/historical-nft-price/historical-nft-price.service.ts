import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { compact } from 'lodash/fp';

@Injectable()
export class HistoricalNftPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistoricalPrices(options: {
    tokenIds?: number[];
    contractAddress?: string;
    limit?: number;
  }) {
    console.log(options.tokenIds);
    const data = await this.prisma.historicalNftPrice.findMany({
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

  /**
   * This could potentially return extra items if
   * someone adds tracked tokens between pulls (where there's no data
   * for a particular token. In this case, it will grab an extra item)
   */
  async getLastestPrices() {
    const trackedNfts = await this.prisma.nFT.findMany({
      orderBy: [{ contractAddress: 'asc' }, { tokenId: 'asc' }],
      select: {
        historicalPrices: {
          orderBy: {
            actualDate: 'desc',
          },
          include: {
            marketplace: true,
          },
          take: 1,
        },
      },
    });

    return compact(trackedNfts.map((nft) => nft.historicalPrices[0]));
  }
}
