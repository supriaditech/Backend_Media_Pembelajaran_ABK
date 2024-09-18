/*
  Warnings:

  - You are about to drop the column `materiProgressId` on the `sub_materi_progress` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sub_materi_progress` DROP FOREIGN KEY `sub_materi_progress_materiProgressId_fkey`;

-- AlterTable
ALTER TABLE `sub_materi_progress` DROP COLUMN `materiProgressId`;
