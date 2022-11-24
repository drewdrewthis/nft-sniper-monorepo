import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage } from 'siwe';
import { SiweUser } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Validate is registered user */
  async validateUser(
    walletAddress: string,
    signature: string,
  ): Promise<SiweUser | null> {
    const user = await this.usersService.findOne(walletAddress);
    this.validateSignature(walletAddress, signature);

    return user;
  }

  async login(user: any) {
    const payload = { walletAddress: user.walletAddress, sub: user.userId };
    const token = this.jwtService.sign(payload);

    return Promise.resolve({
      access_token: token,
    }).then(() => {
      this.afterLogin(user);
    });
  }

  async afterLogin(user: any) {
    this.usersService.updateNonceForWalletAddress(user.walletAddress);
  }

  async validateSignature(walletAddress: string, signature: string) {
    const user = await this.usersService.findOne(walletAddress);

    if (!user) {
      throw new UnauthorizedException(
        `User with wallet ${walletAddress} doesn't exist`,
      );
    }

    const siweMessage = this.generateSiweMessage(walletAddress, user?.nonce);
    return siweMessage.validate(signature);
  }

  generateSiweMessage(walletAddress: string, nonce: string) {
    return new SiweMessage({
      domain: 'alphasniper.xyz',
      address: walletAddress,
      statement: 'Please log-in by signing this message',
      uri: 'https://alphasniper.xyz/login',
      version: '1',
      chainId: 1,
      nonce,
    });
  }
}
