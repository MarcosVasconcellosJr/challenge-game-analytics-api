/*
  Warnings:

  - You are about to drop the column `killerPlayerId` on the `match-event` table. All the data in the column will be lost.
  - You are about to drop the column `victimPlayerId` on the `match-event` table. All the data in the column will be lost.
  - Added the required column `killerId` to the `match-event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `victimId` to the `match-event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "match-event" DROP CONSTRAINT "match-event_killerPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "match-event" DROP CONSTRAINT "match-event_victimPlayerId_fkey";

-- AlterTable
ALTER TABLE "match-event" DROP COLUMN "killerPlayerId",
DROP COLUMN "victimPlayerId",
ADD COLUMN     "isFriendlyFire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "killerId" TEXT NOT NULL,
ADD COLUMN     "victimId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
