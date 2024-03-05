/*
  Warnings:

  - Added the required column `resultado` to the `RequisicaoPix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequisicaoPix" ADD COLUMN     "resultado" TEXT NOT NULL;
