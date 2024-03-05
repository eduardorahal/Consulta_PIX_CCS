/*
  Warnings:

  - You are about to drop the column `dataFim` on the `RequisicaoDetalhamentoCCS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RequisicaoDetalhamentoCCS" DROP COLUMN "dataFim",
ALTER COLUMN "caso" DROP NOT NULL;
