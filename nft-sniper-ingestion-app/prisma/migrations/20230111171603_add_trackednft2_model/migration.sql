-- CreateTable
CREATE TABLE "TrackedNft2" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "nFTId" INTEGER NOT NULL,

    CONSTRAINT "TrackedNft2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackedNft2_nFTId_userUuid_key" ON "TrackedNft2"("nFTId", "userUuid");

-- AddForeignKey
ALTER TABLE "TrackedNft2" ADD CONSTRAINT "TrackedNft2_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackedNft2" ADD CONSTRAINT "TrackedNft2_nFTId_fkey" FOREIGN KEY ("nFTId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
