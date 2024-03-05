/*
  Warnings:

  - You are about to drop the column `cpf` on the `RequisicaoPix` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `RequisicaoRelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `dataMovimento` on the `RequisicaoRelacionamentoCCS` table. All the data in the column will be lost.
  - Added the required column `cpfResponsavel` to the `RequisicaoPix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpfCnpjConsulta` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpfResponsavel` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataConsulta` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFimConsulta` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicioConsulta` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequisicaoPix" DROP COLUMN "cpf",
ADD COLUMN     "cpfResponsavel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" DROP COLUMN "cpf",
DROP COLUMN "dataMovimento",
ADD COLUMN     "cpfCnpjConsulta" TEXT NOT NULL,
ADD COLUMN     "cpfResponsavel" TEXT NOT NULL,
ADD COLUMN     "dataConsulta" TEXT NOT NULL,
ADD COLUMN     "dataFimConsulta" TEXT NOT NULL,
ADD COLUMN     "dataInicioConsulta" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RequisicaoDetalhamentoCCS" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "RequisicaoDetalhamentoCCS_pkey" PRIMARY KEY ("id")
);
