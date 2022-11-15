-- AlterTable
ALTER TABLE "HistoricalNftOffer" ADD COLUMN     "trackedNftId" INTEGER;

-- AlterTable
ALTER TABLE "HistoricalNftPrice" ADD COLUMN     "trackedNftId" INTEGER;

-- CreateTable
CREATE TABLE "TrackedNft" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "TrackedNft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackedNft_contractAddress_tokenId_key" ON "TrackedNft"("contractAddress", "tokenId");

-- AddForeignKey
ALTER TABLE "TrackedNft" ADD CONSTRAINT "TrackedNft_contractAddress_tokenId_fkey" FOREIGN KEY ("contractAddress", "tokenId") REFERENCES "NFT"("contractAddress", "tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftPrice" ADD CONSTRAINT "HistoricalNftPrice_trackedNftId_fkey" FOREIGN KEY ("trackedNftId") REFERENCES "TrackedNft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftOffer" ADD CONSTRAINT "HistoricalNftOffer_trackedNftId_fkey" FOREIGN KEY ("trackedNftId") REFERENCES "TrackedNft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
