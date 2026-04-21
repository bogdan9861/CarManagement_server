-- DropForeignKey
ALTER TABLE `Notifications` DROP FOREIGN KEY `Notifications_reportId_fkey`;

-- DropIndex
DROP INDEX `Notifications_reportId_fkey` ON `Notifications`;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
