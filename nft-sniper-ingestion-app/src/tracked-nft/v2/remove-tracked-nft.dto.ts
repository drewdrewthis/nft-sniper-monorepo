import { IsString } from 'class-validator';

export class RemoveTrackedNftDto {
  @IsString()
  tokenId: string;
  contractAddress: string;
  userUuid: string;
}
