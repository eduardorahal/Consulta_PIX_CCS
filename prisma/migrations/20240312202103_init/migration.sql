/*
  Warnings:

  - You are about to drop the `RespostaDetalhamentoCCS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BemDireitoValorCCS" DROP CONSTRAINT "BemDireitoValorCCS_idRequisicao_fkey";

-- DropForeignKey
ALTER TABLE "RespostaDetalhamentoCCS" DROP CONSTRAINT "RespostaDetalhamentoCCS_idRequisicao_fkey";

-- AlterTable
ALTER TABLE "RequisicaoDetalhamentoCCS" ADD COLUMN     "codigoIfResposta" TEXT,
ADD COLUMN     "codigoResposta" TEXT,
ADD COLUMN     "nuopResposta" TEXT,
ADD COLUMN     "respondeDetalhamento" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "resposta" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" ADD COLUMN     "detalhamento" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "RespostaDetalhamentoCCS";

-- AddForeignKey
ALTER TABLE "BemDireitoValorCCS" ADD CONSTRAINT "BemDireitoValorCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RequisicaoDetalhamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
