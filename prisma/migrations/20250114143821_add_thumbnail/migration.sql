/*
  Warnings:

  - Added the required column `thumbnail` to the `materi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `sub_materi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materi` ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sub_materi` ADD COLUMN `thumbnail` VARCHAR(191) NOT NULL;
