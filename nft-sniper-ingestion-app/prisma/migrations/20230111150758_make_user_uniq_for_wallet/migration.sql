/*
  Warnings:

  - A unique constraint covering the columns `[userUuid]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userUuid_key" ON "Wallet"("userUuid");
