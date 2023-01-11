import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
