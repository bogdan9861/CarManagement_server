-- DropForeignKey
ALTER TABLE `DriverToAdmin` DROP FOREIGN KEY `DriverToAdmin_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `DriverToAdmin` DROP FOREIGN KEY `DriverToAdmin_driverId_fkey`;

-- DropIndex
DROP INDEX `DriverToAdmin_adminId_fkey` ON `DriverToAdmin`;

-- AddForeignKey
ALTER TABLE `DriverToAdmin` ADD CONSTRAINT `DriverToAdmin_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverToAdmin` ADD CONSTRAINT `DriverToAdmin_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
