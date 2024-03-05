/*
  Warnings:

  - You are about to drop the column `dataConsulta` on the `RequisicaoRelacionamentoCCS` table. All the data in the column will be lost.
  - Added the required column `caso` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpjParticipante` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpjResponsavel` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpfResponsavel` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFim` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicio` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataRequisicao` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idPessoa` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroRequisicao` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPessoa` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataRequisicao` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequisicaoDetalhamentoCCS" ADD COLUMN     "caso" INTEGER NOT NULL,
ADD COLUMN     "cnpjParticipante" TEXT NOT NULL,
ADD COLUMN     "cnpjResponsavel" TEXT NOT NULL,
ADD COLUMN     "cpfResponsavel" TEXT NOT NULL,
ADD COLUMN     "dataFim" TEXT NOT NULL,
ADD COLUMN     "dataInicio" TEXT NOT NULL,
ADD COLUMN     "dataRequisicao" TEXT NOT NULL,
ADD COLUMN     "idPessoa" TEXT NOT NULL,
ADD COLUMN     "numeroRequisicao" TEXT NOT NULL,
ADD COLUMN     "tipoPessoa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" DROP COLUMN "dataConsulta",
ADD COLUMN     "dataRequisicao" TEXT NOT NULL;
