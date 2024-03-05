-- CreateTable
CREATE TABLE "RequisicaoRelacionamentoCCS" (
    "id" SERIAL NOT NULL,
    "dataMovimento" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "caso" INTEGER,
    "numeroRequisicao" TEXT NOT NULL,
    "numeroProcesso" TEXT NOT NULL,
    "motivoBusca" TEXT NOT NULL,
    "clientes" JSONB,

    CONSTRAINT "RequisicaoRelacionamentoCCS_pkey" PRIMARY KEY ("id")
);
