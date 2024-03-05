/*
  Warnings:

  - You are about to drop the column `clientes` on the `RequisicaoRelacionamentoCCS` table. All the data in the column will be lost.
  - Added the required column `autorizado` to the `RequisicaoDetalhamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autorizado` to the `RequisicaoPix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autorizado` to the `RequisicaoRelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequisicaoDetalhamentoCCS" ADD COLUMN     "autorizado" BOOLEAN NOT NULL,
ADD COLUMN     "cpfAutorizacao" TEXT,
ADD COLUMN     "dataHoraAutorizacao" TEXT,
ADD COLUMN     "nomeAutorizacao" TEXT,
ADD COLUMN     "tokenAutorizacao" TEXT;

-- AlterTable
ALTER TABLE "RequisicaoPix" ADD COLUMN     "autorizado" BOOLEAN NOT NULL,
ADD COLUMN     "cpfAutorizacao" TEXT,
ADD COLUMN     "dataHoraAutorizacao" TEXT,
ADD COLUMN     "nomeAutorizacao" TEXT,
ADD COLUMN     "tokenAutorizacao" TEXT;

-- AlterTable
ALTER TABLE "RequisicaoRelacionamentoCCS" DROP COLUMN "clientes",
ADD COLUMN     "autorizado" BOOLEAN NOT NULL,
ADD COLUMN     "cpfAutorizacao" TEXT,
ADD COLUMN     "dataHoraAutorizacao" TEXT,
ADD COLUMN     "nomeAutorizacao" TEXT,
ADD COLUMN     "tokenAutorizacao" TEXT;

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "tipoPessoa" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicioSolicitacao" TEXT NOT NULL,
    "dataFimSolicitacao" TEXT NOT NULL,
    "dataRequisicao" TEXT NOT NULL,
    "idRequisicao" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relacionamento" (
    "id" SERIAL NOT NULL,
    "cnpjBanco" TEXT NOT NULL,
    "numeroBanco" TEXT NOT NULL,
    "nomeBanco" TEXT NOT NULL,
    "cnpjParticipante" TEXT NOT NULL,
    "numeroParticipante" TEXT NOT NULL,
    "nomeParticipante" TEXT NOT NULL,
    "dataInicioRelacionamento" TEXT NOT NULL,
    "dataFimRelacionamento" TEXT,
    "idCliente" INTEGER NOT NULL,

    CONSTRAINT "Relacionamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RespostaDetalhamentoCCS" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "codigoIf" TEXT NOT NULL,
    "dataMovimento" TEXT NOT NULL,
    "nuop" TEXT NOT NULL,
    "unidadeAtualizacao" TEXT NOT NULL,
    "operadorAtualizacao" TEXT NOT NULL,
    "idRequisicao" INTEGER NOT NULL,

    CONSTRAINT "RespostaDetalhamentoCCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BemDireitoValor" (
    "id" SERIAL NOT NULL,
    "cnpjParticipante" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "vinculo" TEXT NOT NULL,
    "nomePessoa" TEXT NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL,
    "idRequisicao" INTEGER NOT NULL,

    CONSTRAINT "BemDireitoValor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vinculados" (
    "id" SERIAL NOT NULL,
    "idBDV" INTEGER NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "nomePessoa" TEXT NOT NULL,
    "nomePessoaReceita" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Vinculados_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RequisicaoRelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relacionamento" ADD CONSTRAINT "Relacionamento_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespostaDetalhamentoCCS" ADD CONSTRAINT "RespostaDetalhamentoCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RequisicaoDetalhamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BemDireitoValor" ADD CONSTRAINT "BemDireitoValor_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RespostaDetalhamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vinculados" ADD CONSTRAINT "Vinculados_idBDV_fkey" FOREIGN KEY ("idBDV") REFERENCES "BemDireitoValor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
