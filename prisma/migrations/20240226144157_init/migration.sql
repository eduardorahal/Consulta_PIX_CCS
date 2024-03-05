/*
  Warnings:

  - You are about to drop the column `idCliente` on the `RelacionamentoCCS` table. All the data in the column will be lost.
  - You are about to drop the `ClienteCCS` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idRequisicao` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpfCnpj` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFimSolicitacao` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicioSolicitacao` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPessoa` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClienteCCS" DROP CONSTRAINT "ClienteCCS_idRequisicao_fkey";

-- DropForeignKey
ALTER TABLE "RelacionamentoCCS" DROP CONSTRAINT "RelacionamentoCCS_idCliente_fkey";

-- AlterTable
ALTER TABLE "RelacionamentoCCS" DROP COLUMN "idCliente",
ADD COLUMN     "idRequisicao" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" ADD COLUMN     "cpfCnpj" TEXT NOT NULL,
ADD COLUMN     "dataFimSolicitacao" TEXT NOT NULL,
ADD COLUMN     "dataInicioSolicitacao" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "tipoPessoa" TEXT NOT NULL;

-- DropTable
DROP TABLE "ClienteCCS";

-- AddForeignKey
ALTER TABLE "RelacionamentoCCS" ADD CONSTRAINT "RelacionamentoCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RequisicaoRelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
