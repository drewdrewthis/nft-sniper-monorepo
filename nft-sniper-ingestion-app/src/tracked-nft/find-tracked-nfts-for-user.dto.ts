import { IsOptional } from 'class-validator';
export class FindTrackedNftsForUserDto {
  @IsOptional()
  walletAddress?: string;
  @IsOptional()
  discordId?: string;
  @IsOptional()
  uuid?: string;
}
