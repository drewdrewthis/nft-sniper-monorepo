import { IsString } from 'class-validator';

export class GetTrackedDataForWalletDto {
  @IsString()
  walletAddress: `0x${string}` | 'demo';
}
