-- DropForeignKey
ALTER TABLE `materi_progress` DROP FOREIGN KEY `materi_progress_materiId_fkey`;

-- DropForeignKey
ALTER TABLE `sub_materi_progress` DROP FOREIGN KEY `sub_materi_progress_subMateriId_fkey`;

-- AddForeignKey
ALTER TABLE `materi_progress` ADD CONSTRAINT `materi_progress_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_materi_progress` ADD CONSTRAINT `sub_materi_progress_subMateriId_fkey` FOREIGN KEY (`subMateriId`) REFERENCES `sub_materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
