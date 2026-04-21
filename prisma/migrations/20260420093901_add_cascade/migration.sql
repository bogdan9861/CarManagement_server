-- DropForeignKey
ALTER TABLE `Driver` DROP FOREIGN KEY `Driver_userId_fkey`;

-- DropIndex
DROP INDEX `Driver_userId_fkey` ON `Driver`;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
