/*
  Warnings:

  - You are about to drop the column `trackedNftId` on the `HistoricalNftOffer` table. All the data in the column will be lost.
  - You are about to drop the column `trackedNftId` on the `HistoricalNftPrice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoricalNftOffer" DROP CONSTRAINT "HistoricalNftOffer_trackedNftId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricalNftPrice" DROP CONSTRAINT "HistoricalNftPrice_trackedNftId_fkey";

-- AlterTable
ALTER TABLE "HistoricalNftOffer" DROP COLUMN "trackedNftId";

-- AlterTable
ALTER TABLE "HistoricalNftPrice" DROP COLUMN "trackedNftId";
