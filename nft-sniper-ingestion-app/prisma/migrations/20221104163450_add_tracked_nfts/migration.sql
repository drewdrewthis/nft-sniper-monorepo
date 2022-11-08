-- CreateTable
CREATE TABLE "TrackedNfts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,

    CONSTRAINT "TrackedNfts_pkey" PRIMARY KEY ("id")
);
