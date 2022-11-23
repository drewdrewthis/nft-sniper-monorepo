import { Module } from '@nestjs/common';
import { WalletAllowListService } from './wallet-allow-list.service';

@Module({
  imports: [],
  providers: [WalletAllowListService],
})
export class WalletAllowListModule {}
