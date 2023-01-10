import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SiweMessage } from 'siwe';
import { SiweUser } from '@prisma/client';
import { z } from 'zod';

const envSchema = z.object({
  WEB_APP_API_KEY: z.string(),
});

const { WEB_APP_API_KEY } = envSchema.parse(process.env);

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Validate is registered user */
  async validateUser(
    walletAddress: string,
    signature: string,
    message: string,
  ): Promise<SiweUser | null> {
    const user = await this.usersService.findOne(walletAddress);
    this.validateSignature(walletAddress, signature, message);

    return user;
  }

  async login(user: any) {
    const payload = { walletAddress: user.walletAddress, sub: user.nonce };
    const token = this.jwtService.sign(payload);

    return Promise.resolve({
      access_token: token,
    }).finally(() => {
      this.afterLogin(user);
    });
  }

  async discordLogin(user: { discordId: string }) {
    const payload = { discordId: user?.discordId };

    if (!user.discordId) throw new Error('Discord ID is required');

    const token = this.jwtService.sign(payload);

    return Promise.resolve({
      access_token: token,
    });
  }

  async getNonceForWallet(walletAddress: string) {
    const user = await this.usersService.findOrCreate(walletAddress);
    const { nonce } = user;
    return nonce;
  }

  async afterLogin(user: any) {
    this.usersService.updateNonceForWalletAddress(user.walletAddress);
  }

  async validateSignature(
    walletAddress: string,
    signature: string,
    message: string,
  ) {
    const user = await this.usersService.findOne(walletAddress);

    if (!user) {
      throw new UnauthorizedException(
        `User with wallet ${walletAddress} doesn't exist`,
      );
    }

    try {
      const siweMessage = new SiweMessage(message);
      return siweMessage.validate(signature);
    } catch (e) {
      this.logger.error(e);
    }
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

  validateApiKey(apiKey: string) {
    return apiKey === WEB_APP_API_KEY;
  }
}
