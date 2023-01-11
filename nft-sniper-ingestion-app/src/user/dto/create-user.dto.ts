import { IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  discordId?: string;

  @IsOptional()
  walletAddress?: string;
}
