/*
  Warnings:

  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_googleId_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `googleId`,
    DROP COLUMN `isVerified`,
    DROP COLUMN `otpCode`,
    DROP COLUMN `otpExpiry`;
