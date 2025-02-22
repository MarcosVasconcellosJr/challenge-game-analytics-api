/*
  Warnings:

  - You are about to drop the column `ocurredAt` on the `match-event` table. All the data in the column will be lost.
  - Added the required column `occurredAt` to the `match-event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match-event" DROP COLUMN "ocurredAt",
ADD COLUMN     "occurredAt" TIMESTAMP(3) NOT NULL;
