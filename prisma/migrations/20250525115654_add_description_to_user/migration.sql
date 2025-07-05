/*
  Warnings:

  - You are about to drop the column `hobby` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hobby",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "intro" TEXT;
