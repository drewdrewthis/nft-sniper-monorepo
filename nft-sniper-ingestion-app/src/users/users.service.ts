import { Injectable } from '@nestjs/common';
import { WALLET_ALLOW_LIST } from '../constants';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  walletAddress: string;
  nonce: string;
};

@Injectable()
export class UsersService {
  private static readonly users: User[] = WALLET_ALLOW_LIST.map(
    (walletAddress, idx) => {
      return {
        userId: idx,
        walletAddress,
        nonce: Math.random().toString(),
      };
    },
  );

  async findOne(walletAddress: string): Promise<User | undefined> {
    return UsersService.users.find(
      (user) => user.walletAddress === walletAddress,
    );
  }
}
