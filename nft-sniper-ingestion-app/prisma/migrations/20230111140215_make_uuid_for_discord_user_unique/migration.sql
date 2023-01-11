/*
  Warnings:

  - A unique constraint covering the columns `[userUuid]` on the table `DiscordUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_userUuid_key" ON "DiscordUser"("userUuid");
