/*
  Warnings:

  - The primary key for the `match` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'INSTRUCTOR');

-- AlterTable
ALTER TABLE "match" DROP CONSTRAINT "match_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "match_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "match-event" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "isWorldEvent" BOOLEAN NOT NULL DEFAULT false,
    "ocurredAt" TIMESTAMP(3) NOT NULL,
    "weaponId" TEXT NOT NULL,
    "sourcePlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT NOT NULL,

    CONSTRAINT "match-event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_sourcePlayerId_fkey" FOREIGN KEY ("sourcePlayerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_targetPlayerId_fkey" FOREIGN KEY ("targetPlayerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
