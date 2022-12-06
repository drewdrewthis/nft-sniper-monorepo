/*
  Warnings:

  - A unique constraint covering the columns `[contractAddress,tokenId,walletAddress]` on the table `TrackedNft` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TrackedNft" DROP CONSTRAINT "TrackedNft_contractAddress_tokenId_fkey";

-- DropIndex
DROP INDEX "TrackedNft_contractAddress_tokenId_key";

-- AlterTable
ALTER TABLE "NFT" ADD COLUMN     "trackedNftId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "TrackedNft_contractAddress_tokenId_walletAddress_key" ON "TrackedNft"("contractAddress", "tokenId", "walletAddress");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_trackedNftId_fkey" FOREIGN KEY ("trackedNftId") REFERENCES "TrackedNft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
