/*
  Warnings:

  - Added the required column `status` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" ADD COLUMN     "status" TEXT NOT NULL;
