import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
