-- DropForeignKey
ALTER TABLE `sub_materi` DROP FOREIGN KEY `sub_materi_materiId_fkey`;

-- AddForeignKey
ALTER TABLE `sub_materi` ADD CONSTRAINT `sub_materi_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
