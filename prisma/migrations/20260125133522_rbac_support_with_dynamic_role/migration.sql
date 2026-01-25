/*
  Warnings:

  - You are about to drop the column `userId` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BuyerInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Commodity` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Deduction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Expenditure` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ExpenditureType` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ServiceProvider` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SupplierInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `BuyerInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Commodity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Deduction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Expenditure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `ExpenditureType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `ServiceProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `SupplierInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Buyer" DROP CONSTRAINT "Buyer_userId_fkey";

-- DropForeignKey
ALTER TABLE "BuyerInvoice" DROP CONSTRAINT "BuyerInvoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "Commodity" DROP CONSTRAINT "Commodity_userId_fkey";

-- DropForeignKey
ALTER TABLE "Deduction" DROP CONSTRAINT "Deduction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Expenditure" DROP CONSTRAINT "Expenditure_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExpenditureType" DROP CONSTRAINT "ExpenditureType_userId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceProvider" DROP CONSTRAINT "ServiceProvider_userId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_userId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierInvoice" DROP CONSTRAINT "SupplierInvoice_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropIndex
DROP INDEX "Organization_username_key";

-- AlterTable
ALTER TABLE "Buyer" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BuyerInvoice" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Commodity" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Deduction" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Expenditure" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ExpenditureType" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "ServiceProvider" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SuperAdmin" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER;

-- AlterTable
ALTER TABLE "SupplierInvoice" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" INTEGER,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commodity" ADD CONSTRAINT "Commodity_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deduction" ADD CONSTRAINT "Deduction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoice" ADD CONSTRAINT "SupplierInvoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyerInvoice" ADD CONSTRAINT "BuyerInvoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenditureType" ADD CONSTRAINT "ExpenditureType_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
