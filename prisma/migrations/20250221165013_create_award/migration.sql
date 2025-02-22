-- CreateTable
CREATE TABLE "players-on-matchs" (
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "players-on-matchs_pkey" PRIMARY KEY ("matchId","playerId")
);

-- CreateTable
CREATE TABLE "award" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "award_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "players-on-matchs" ADD CONSTRAINT "players-on-matchs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players-on-matchs" ADD CONSTRAINT "players-on-matchs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
