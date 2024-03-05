-- CreateTable
CREATE TABLE "RequisicaoPix" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "caso" INTEGER,
    "tipoBusca" TEXT NOT NULL,
    "chaveBusca" TEXT NOT NULL,
    "motivoBusca" TEXT NOT NULL,
    "vinculos" JSONB,

    CONSTRAINT "RequisicaoPix_pkey" PRIMARY KEY ("id")
);
