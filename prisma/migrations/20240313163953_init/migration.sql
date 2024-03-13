/*
  Warnings:

  - You are about to drop the column `dataFimRelacionamento` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicioRelacionamento` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - Added the required column `dataInicio` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelacionamentoCCS" DROP COLUMN "dataFimRelacionamento",
DROP COLUMN "dataInicioRelacionamento",
ADD COLUMN     "dataFim" TEXT,
ADD COLUMN     "dataInicio" TEXT NOT NULL;
