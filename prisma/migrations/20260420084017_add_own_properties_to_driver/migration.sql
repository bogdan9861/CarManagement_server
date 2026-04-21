/*
  Warnings:

  - You are about to drop the column `carId` on the `Driver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Driver` DROP COLUMN `carId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Driver_email_key` ON `Driver`(`email`);
