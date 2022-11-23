import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Validate is registered user */
  async validateUser(walletAddress: string): Promise<any> {
    const user = await this.usersService.findOne(walletAddress);

    return user || null;
  }

  async login(user: any) {
    const payload = { walletAddress: user.walletAddress, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
