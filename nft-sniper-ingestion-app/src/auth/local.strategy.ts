import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ethers } from 'ethers';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { User } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'siwe-strategy') {
  name = 'LocalStrategy';

  constructor(private authService: AuthService) {
    super();
  }

  /**
   *
   * Validate that the request is properly formed
   * @param req
   * @returns User
   */
  async validate(req: Request): Promise<User> {
    const { walletAddress } = req.body;

    const contentType = req.headers['content-type'];

    if (contentType !== 'application/json') {
      throw new UnauthorizedException();
    }

    if (!walletAddress) {
      throw new UnauthorizedException(`Wallet address is not valid`);
    }

    const user = await this.authService.validateUser(walletAddress);

    if (!user) {
      throw new UnauthorizedException(`Wallet address is not allowed`);
    }

    return user;
  }

  verifySignature(
    walletAddress: string,
    signedMessage: { message: string; signature: string },
  ) {
    const signerAddress = ethers.utils.verifyMessage(
      signedMessage.message,
      signedMessage.signature,
    );

    return signerAddress.toLowerCase() === walletAddress.toLowerCase();
  }
}
