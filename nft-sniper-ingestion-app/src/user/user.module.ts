import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WalletService } from '../wallet/wallet.service';

@Module({
  controllers: [UserController],
  providers: [UserService, WalletService],
})
export class UserModule {}
