/*
  Warnings:

  - You are about to drop the column `email` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Driver` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Driver_email_key` ON `Driver`;

-- AlterTable
ALTER TABLE `Driver` DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `password`;
