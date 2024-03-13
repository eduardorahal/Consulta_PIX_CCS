/*
  Warnings:

  - You are about to drop the column `dataFim` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - Added the required column `dataInicioRelacionamento` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelacionamentoCCS" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
ADD COLUMN     "dataFimRelacionamento" TEXT,
ADD COLUMN     "dataInicioRelacionamento" TEXT NOT NULL;
