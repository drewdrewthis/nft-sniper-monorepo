-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "userUuid" TEXT;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
