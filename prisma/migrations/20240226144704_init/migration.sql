/*
  Warnings:

  - You are about to drop the column `cnpjBanco` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - Added the required column `cnpj` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelacionamentoCCS" DROP COLUMN "cnpjBanco",
ADD COLUMN     "cnpj" TEXT NOT NULL;
