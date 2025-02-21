-- DropForeignKey
ALTER TABLE "match-event" DROP CONSTRAINT "match-event_matchId_fkey";

-- AddForeignKey
ALTER TABLE "match-event" ADD CONSTRAINT "match-event_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
