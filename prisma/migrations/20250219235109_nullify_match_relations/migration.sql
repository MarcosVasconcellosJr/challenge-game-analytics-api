-- DropForeignKey
ALTER TABLE "match" DROP CONSTRAINT "match_winningPlayerId_fkey";

-- DropForeignKey
ALTER TABLE "match" DROP CONSTRAINT "match_winningTeamId_fkey";

-- AlterTable
ALTER TABLE "match" ALTER COLUMN "winningTeamId" DROP NOT NULL,
ALTER COLUMN "winningPlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_winningTeamId_fkey" FOREIGN KEY ("winningTeamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_winningPlayerId_fkey" FOREIGN KEY ("winningPlayerId") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
