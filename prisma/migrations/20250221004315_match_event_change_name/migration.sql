/*
  Warnings:

  - You are about to drop the column `sourcePlayerId` on the `match-event` table. All the data in the column will be lost.
  - You are about to drop the column `targetPlayerId` on the `match-event` table. All the data in the column will be lost.
  - Added the required column `killerPlayerId` to the `match-event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `victimPlayerId` to the `match-event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "match-event" DROP CONSTRAINT "match-event_sourcePlayerId_fkey";

-- DropForeignKey
ALTER TABLE "match-event" DROP CONSTRAINT "match-event_targetPlayerId_fkey";

-- AlterTable
ALTER TABLE "match-event" DROP COLUMN "sourcePlayerId",
DROP COLUMN "targetPlayerId",
ADD COLUMN     "killerPlayerId" TEXT NOT NULL,
ADD COLUMN     "victimPlayerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_killerPlayerId_fkey" FOREIGN KEY ("killerPlayerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_victimPlayerId_fkey" FOREIGN KEY ("victimPlayerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
