/*
  Warnings:

  - You are about to drop the `BemDireitoValor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Relacionamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vinculados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BemDireitoValor" DROP CONSTRAINT "BemDireitoValor_idRequisicao_fkey";

-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_idRequisicao_fkey";

-- DropForeignKey
ALTER TABLE "Relacionamento" DROP CONSTRAINT "Relacionamento_idCliente_fkey";

-- DropForeignKey
ALTER TABLE "Vinculados" DROP CONSTRAINT "Vinculados_idBDV_fkey";

-- DropTable
DROP TABLE "BemDireitoValor";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Relacionamento";

-- DropTable
DROP TABLE "Vinculados";

-- CreateTable
CREATE TABLE "ClienteCCS" (
    "id" SERIAL NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "tipoPessoa" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicioSolicitacao" TEXT NOT NULL,
    "dataFimSolicitacao" TEXT NOT NULL,
    "dataRequisicao" TEXT NOT NULL,
    "idRequisicao" INTEGER NOT NULL,

    CONSTRAINT "ClienteCCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelacionamentoCCS" (
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

    CONSTRAINT "RelacionamentoCCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BemDireitoValorCCS" (
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

    CONSTRAINT "BemDireitoValorCCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculadosBDVCCS" (
    "id" SERIAL NOT NULL,
    "idBDV" INTEGER NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "nomePessoa" TEXT NOT NULL,
    "nomePessoaReceita" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "VinculadosBDVCCS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClienteCCS" ADD CONSTRAINT "ClienteCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RequisicaoRelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelacionamentoCCS" ADD CONSTRAINT "RelacionamentoCCS_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "ClienteCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BemDireitoValorCCS" ADD CONSTRAINT "BemDireitoValorCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RespostaDetalhamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculadosBDVCCS" ADD CONSTRAINT "VinculadosBDVCCS_idBDV_fkey" FOREIGN KEY ("idBDV") REFERENCES "BemDireitoValorCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
