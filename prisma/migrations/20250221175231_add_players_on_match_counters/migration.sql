-- AlterTable
ALTER TABLE "players-on-matchs" ADD COLUMN     "deathCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "friendlyKillCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "killCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxStreakCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "preferredWeaponId" TEXT,
ADD COLUMN     "totalKillCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "players-on-matchs" ADD CONSTRAINT "players-on-matchs_preferredWeaponId_fkey" FOREIGN KEY ("preferredWeaponId") REFERENCES "weapon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
