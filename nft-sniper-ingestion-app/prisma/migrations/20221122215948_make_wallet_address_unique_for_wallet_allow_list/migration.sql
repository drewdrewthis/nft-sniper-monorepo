/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `WalletAllowList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WalletAllowList_walletAddress_key" ON "WalletAllowList"("walletAddress");
