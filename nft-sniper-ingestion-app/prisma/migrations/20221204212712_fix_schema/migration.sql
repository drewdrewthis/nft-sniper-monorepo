/*
  Warnings:

  - You are about to drop the column `trackedNftId` on the `NFT` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_trackedNftId_fkey";

-- AlterTable
ALTER TABLE "NFT" DROP COLUMN "trackedNftId";

-- AddForeignKey
ALTER TABLE "TrackedNft" ADD CONSTRAINT "TrackedNft_contractAddress_tokenId_fkey" FOREIGN KEY ("contractAddress", "tokenId") REFERENCES "NFT"("contractAddress", "tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
