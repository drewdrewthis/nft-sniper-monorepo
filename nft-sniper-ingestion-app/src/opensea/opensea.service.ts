import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OpenseaService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistoricalPrices(options: {
    tokenIds?: number[];
    contractAddress?: string;
    limit?: number;
  }) {
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
        rawScrapeData: true,
      },
    });

    return data.map((item) => {
      const url = `https://opensea.io/assets/ethereum/${item.contractAddress}/${item.tokenId}`;

      return {
        ...item,
        url,
      };
    });
  }
}
