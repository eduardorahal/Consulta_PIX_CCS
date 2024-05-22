-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "unidade" TEXT,
    "matricula" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
