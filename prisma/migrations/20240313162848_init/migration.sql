/*
  Warnings:

  - You are about to drop the column `cnpj` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `nomeBanco` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `nomeParticipante` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `numeroBanco` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `numeroParticipante` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `dataFimSolicitacao` on the `RequisicaoRelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicioSolicitacao` on the `RequisicaoRelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the `RequisicaoDetalhamentoCCS` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cnpjResponsavel` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idPessoa` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeBancoParticipante` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeBancoResponsavel` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroBancoParticipante` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroBancoResponsavel` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroRequisicao` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BemDireitoValorCCS" DROP CONSTRAINT "BemDireitoValorCCS_idRequisicao_fkey";

-- AlterTable
ALTER TABLE "RelacionamentoCCS" DROP COLUMN "cnpj",
DROP COLUMN "nomeBanco",
DROP COLUMN "nomeParticipante",
DROP COLUMN "numeroBanco",
DROP COLUMN "numeroParticipante",
ADD COLUMN     "cnpjResponsavel" TEXT NOT NULL,
ADD COLUMN     "codigoIfResposta" TEXT,
ADD COLUMN     "codigoResposta" TEXT,
ADD COLUMN     "idPessoa" TEXT NOT NULL,
ADD COLUMN     "nomeBancoParticipante" TEXT NOT NULL,
ADD COLUMN     "nomeBancoResponsavel" TEXT NOT NULL,
ADD COLUMN     "numeroBancoParticipante" TEXT NOT NULL,
ADD COLUMN     "numeroBancoResponsavel" TEXT NOT NULL,
ADD COLUMN     "numeroRequisicao" TEXT NOT NULL,
ADD COLUMN     "nuopResposta" TEXT,
ADD COLUMN     "respondeDetalhamento" BOOLEAN,
ADD COLUMN     "resposta" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" DROP COLUMN "dataFimSolicitacao",
DROP COLUMN "dataInicioSolicitacao";

-- DropTable
DROP TABLE "RequisicaoDetalhamentoCCS";

-- AddForeignKey
ALTER TABLE "BemDireitoValorCCS" ADD CONSTRAINT "BemDireitoValorCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
