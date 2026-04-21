-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_carId_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_userId_fkey`;

-- DropIndex
DROP INDEX `Report_carId_fkey` ON `Report`;

-- DropIndex
DROP INDEX `Report_userId_fkey` ON `Report`;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
