/*
  Warnings:

  - You are about to drop the `video_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `video_progress` DROP FOREIGN KEY `video_progress_userId_fkey`;

-- DropTable
DROP TABLE `video_progress`;

-- CreateTable
CREATE TABLE `materi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_materi` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_materi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_sub_materi` VARCHAR(191) NOT NULL,
    `video_url` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `materiId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materi_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `materiId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'UNDERSTOOD') NOT NULL DEFAULT 'PENDING',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_materi_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `subMateriId` INTEGER NOT NULL,
    `materiProgressId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'UNDERSTOOD') NOT NULL DEFAULT 'PENDING',
    `videoPlayCount` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sub_materi` ADD CONSTRAINT `sub_materi_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `materi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materi_progress` ADD CONSTRAINT `materi_progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materi_progress` ADD CONSTRAINT `materi_progress_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `materi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_materi_progress` ADD CONSTRAINT `sub_materi_progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_materi_progress` ADD CONSTRAINT `sub_materi_progress_subMateriId_fkey` FOREIGN KEY (`subMateriId`) REFERENCES `sub_materi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_materi_progress` ADD CONSTRAINT `sub_materi_progress_materiProgressId_fkey` FOREIGN KEY (`materiProgressId`) REFERENCES `materi_progress`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
