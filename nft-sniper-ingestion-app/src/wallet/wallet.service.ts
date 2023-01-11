import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createWalletDto: CreateWalletDto) {
    const { userUuid, walletAddress } = createWalletDto;
    return this.prisma.wallet.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        userUuid,
      },
    });
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  async findByUserUuid(uuid: string) {
    return this.prisma.wallet.findUnique({
      where: {
        userUuid: uuid,
      },
    });
  }

  async findByWalletAddress(walletAddress: string) {
    return this.prisma.wallet.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });
  }

  async findOrCreate(args: { walletAddress: string; userUuid: string }) {
    const { walletAddress, userUuid } = args;
    const wallet = await this.findByWalletAddress(walletAddress);

    if (wallet) {
      return wallet;
    }

    return this.create({
      walletAddress,
      userUuid,
    });
  }
}
