-- AlterTable
ALTER TABLE "players-on-matchs" ADD COLUMN     "fragScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "killVsDeathScore" INTEGER NOT NULL DEFAULT 0;
