import { IsString } from 'class-validator';

export class CreateTrackedNftDto {
  @IsString()
  tokenId: string;
  contractAddress: string;
  userUuid: string;
}
