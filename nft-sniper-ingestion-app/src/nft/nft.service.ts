import { HttpException, Injectable, Logger } from '@nestjs/common';
import { NFT } from '@prisma/client';
import * as ethers from 'ethers';
import { AlchemyService } from '../apis/alchemy/alchemy.service';
import { HistoricalNftOfferService } from '../historical-nft-offer/historical-nft-offer.service';
import { PrismaService } from '../prisma';
import { Token } from '../types';
import { DemoService } from '../demo/demo.service';
import { ConfigService } from '../config/config.service';

class MaxTrackedTokensReached extends Error {}

@Injectable()
export class NftService {
  logger = new Logger(NftService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alchemy: AlchemyService,
    private readonly historialOffersService: HistoricalNftOfferService,
    private readonly demoService: DemoService,
    private readonly configService: ConfigService,
  ) {}

  async getAllNFTMetadata() {
    const tokens = await this.prisma.nFT.findMany();
    const result = await this.alchemy.getNFTMetadataBatch(tokens);

    this.logger.log('got data', JSON.stringify(result));

    return result;
  }

  async getNFTMetadataForTokens(tokens: Token[]) {
    const result = await this.alchemy.getNFTMetadataBatch(tokens);

    this.logger.log('got data', JSON.stringify(result));

    return result;
  }

  getNfts(): Promise<Pick<NFT, 'contractAddress' | 'tokenId'>[]> {
    return this.prisma.nFT.findMany({
      include: {
        historicalPrices: {
          orderBy: {
            actualDate: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  /**
   * Get all data for the nfts associated with this wallet
   * @param walletAddress
   */
  async getNftDataForWallet(walletAddress: string) {
    const trackedNfts = await this.getTrackedNftsForWallet(walletAddress);
    return this.demoService.getNftDemoData(trackedNfts);
  }

  /** Deprecated */
  async getTrackedNftDataForWallet(walletAddress: string) {
    const trackedNfts = await this.getTrackedNftsForWallet(walletAddress);
    const ids = trackedNfts.map((trackedNft) => trackedNft.NFT.id);
    const tokens = trackedNfts.map((trackedNft) => trackedNft.NFT);

    const latestOffers =
      await this.historialOffersService.getLastestOffersForNFTsById(ids);

    const metadatas = await this.getNFTMetadataForTokens(tokens);

    return trackedNfts.map((trackedNft) => {
      const offers = latestOffers.filter((offer) => {
        return (
          offer.contractAddress.toLowerCase() ===
            trackedNft.contractAddress.toLowerCase() &&
          offer.tokenId === trackedNft.tokenId
        );
      });

      const metadata = metadatas?.find((meta) => {
        return (
          meta.contract.address.toLowerCase() ===
            trackedNft.contractAddress.toLowerCase() &&
          Number(meta.id.tokenId) === trackedNft.tokenId
        );
      });

      return {
        ...trackedNft,
        historicalPrices: trackedNft.NFT.historicalPrices,
        offers,
        metadata,
      };
    });
  }

  async getTrackedNftsForWallet(walletAddress: string) {
    ethers.utils.getAddress(walletAddress);

    return this.prisma.trackedNft.findMany({
      where: {
        walletAddress,
      },
      include: {
        NFT: {
          include: {
            historicalPrices: {
              distinct: ['marketplaceId'],
              orderBy: {
                actualDate: 'desc',
              },
              take: 2,
            },
          },
        },
      },
    });
  }

  async add(payload: {
    tokenId: number;
    contractAddress: string;
    walletAddress: string;
  }) {
    this.logger.log('Received request to add nft', payload);

    const { walletAddress, tokenId, contractAddress } = payload;

    // Validate addresses
    ethers.utils.getAddress(contractAddress);
    ethers.utils.getAddress(walletAddress);

    await this.validateCanAddMoreTokens(walletAddress);

    await this.prisma.nFT.upsert({
      where: {
        contractAddress_tokenId: { contractAddress, tokenId },
      },
      create: {
        tokenId: Number(tokenId),
        contractAddress,
      },
      update: {},
    });

    await this.prisma.trackedNft.upsert({
      where: {
        contractAddress_tokenId: { contractAddress, tokenId },
      },
      create: {
        tokenId: Number(tokenId),
        contractAddress,
        walletAddress,
      },
      update: {},
    });
  }

  async remove(payload: {
    tokenId: number;
    contractAddress: string;
    walletAddress: string;
  }) {
    this.logger.log('Received request to remove nft', payload);

    const { walletAddress, tokenId, contractAddress } = payload;

    // Validate addresses
    ethers.utils.getAddress(contractAddress);
    ethers.utils.getAddress(walletAddress);

    return this.prisma.trackedNft.delete({
      where: {
        contractAddress_tokenId: { contractAddress, tokenId },
      },
    });
  }

  verifySignature(
    walletAddress: string,
    signedMessage: { message: string; signature: string },
  ) {
    // Verify signature
    const signerAddress = ethers.utils.verifyMessage(
      signedMessage.message,
      signedMessage.signature,
    );

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Verification failed');
    }
  }

  /** Will throw if user has maximum tokens */
  async validateCanAddMoreTokens(walletAddress: string) {
    const MAX = this.configService.envVars.MAX_TRACKABLE_TOKEN_COUNT;
    const count = await this.prisma.trackedNft.count({
      where: {
        walletAddress,
      },
    });

    if (count < MAX) {
      return true;
    } else {
      throw new MaxTrackedTokensReached(
        `You can only track a maximum of ${MAX} tokens`,
      );
    }
  }
}
