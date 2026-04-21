/*
  Warnings:

  - Added the required column `driverId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Driver` DROP FOREIGN KEY `Driver_carId_fkey`;

-- DropIndex
DROP INDEX `Driver_carId_fkey` ON `Driver`;

-- AlterTable
ALTER TABLE `Car` ADD COLUMN `driverId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
