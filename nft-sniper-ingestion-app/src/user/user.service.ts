import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly walletService: WalletService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(createUserDto: CreateUserDto) {
    const { discordId, walletAddress } = createUserDto;

    if (discordId && walletAddress) {
      const user = await this.findOrCreateUserByDiscordId(discordId);
      await this.walletService.findOrCreate({
        walletAddress,
        userUuid: user.uuid,
      });

      return await this.findOne(user.uuid);
    }

    if (discordId) {
      return this.findOrCreateUserByDiscordId(discordId);
    }

    if (walletAddress) {
      return this.findOrCreateUserByWalletAddress(walletAddress);
    }

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(uuid: string) {
    return this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async findBy(args: {
    walletAddress?: string;
    discordId?: string;
    uuid?: string;
  }) {
    const { walletAddress, discordId, uuid } = args;
    if (uuid) return this.findOne(uuid);
    if (discordId) return this.findUserByDiscordId(discordId);
    if (walletAddress) return this.findUserByWalletAddress(walletAddress);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOrCreateUserByDiscordId(discordId: string) {
    const user = await this.findUserByDiscordId(discordId);

    if (user) {
      return user;
    } else {
      return this.createUserWithDiscordId(discordId);
    }
  }

  async findOrCreateUserByWalletAddress(walletAddress: string) {
    const user = await this.findUserByWalletAddress(walletAddress);

    if (user) {
      return user;
    } else {
      return this.createUserWithWalletAddress(walletAddress);
    }
  }

  async findUserByWalletAddress(walletAddress: string) {
    return this.prisma.user.findFirst({
      where: {
        wallets: {
          every: {
            walletAddress: {
              equals: walletAddress,
            },
          },
        },
      },
      include: {
        wallets: true,
      },
    });
  }

  async createUserWithWalletAddress(walletAddress: string) {
    const newUser = await this.prisma.user.create({ data: {} });
    return this.prisma.wallet.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        userUuid: newUser.uuid,
      },
    });
  }

  async createUserWithDiscordId(discordId: string) {
    const newUser = await this.prisma.user.create({ data: {} });
    await this.prisma.discordUser.upsert({
      where: { discordId },
      update: {},
      create: { discordId, userUuid: newUser.uuid },
    });

    return newUser;
  }

  async findUserByDiscordId(discordId: string) {
    return this.prisma.user.findFirst({
      where: {
        discordUsers: {
          every: {
            discordId: {
              equals: discordId,
            },
          },
        },
      },
      include: {
        discordUsers: true,
      },
    });
  }
}
