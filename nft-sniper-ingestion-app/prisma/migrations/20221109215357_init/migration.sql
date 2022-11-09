-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "attributesJson" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marketplace" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Marketplace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalNftPrice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priceAmount" TEXT,
    "priceCurrency" TEXT,
    "fiatPrice" TEXT,
    "fiatCurrency" TEXT,
    "tokenId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "marketplaceId" INTEGER NOT NULL,
    "rawScrapeDataId" INTEGER NOT NULL,

    CONSTRAINT "HistoricalNftPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalNftOffer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "priceAmount" TEXT,
    "priceCurrency" TEXT,
    "fiatPrice" TEXT,
    "fiatCurrency" TEXT,
    "from" TEXT,
    "tokenId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "marketplaceId" INTEGER NOT NULL,
    "rawScrapeDataId" INTEGER NOT NULL,

    CONSTRAINT "HistoricalNftOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawScrapeData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,

    CONSTRAINT "RawScrapeData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFT_contractAddress_tokenId_key" ON "NFT"("contractAddress", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Marketplace_name_key" ON "Marketplace"("name");

-- AddForeignKey
ALTER TABLE "HistoricalNftPrice" ADD CONSTRAINT "HistoricalNftPrice_contractAddress_tokenId_fkey" FOREIGN KEY ("contractAddress", "tokenId") REFERENCES "NFT"("contractAddress", "tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftPrice" ADD CONSTRAINT "HistoricalNftPrice_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES "Marketplace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftPrice" ADD CONSTRAINT "HistoricalNftPrice_rawScrapeDataId_fkey" FOREIGN KEY ("rawScrapeDataId") REFERENCES "RawScrapeData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftOffer" ADD CONSTRAINT "HistoricalNftOffer_contractAddress_tokenId_fkey" FOREIGN KEY ("contractAddress", "tokenId") REFERENCES "NFT"("contractAddress", "tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftOffer" ADD CONSTRAINT "HistoricalNftOffer_marketplaceId_fkey" FOREIGN KEY ("marketplaceId") REFERENCES "Marketplace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalNftOffer" ADD CONSTRAINT "HistoricalNftOffer_rawScrapeDataId_fkey" FOREIGN KEY ("rawScrapeDataId") REFERENCES "RawScrapeData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
