/*
  Warnings:

  - A unique constraint covering the columns `[contractAddress,tokenId]` on the table `TrackedNfts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TrackedNfts_contractAddress_tokenId_key" ON "TrackedNfts"("contractAddress", "tokenId");
