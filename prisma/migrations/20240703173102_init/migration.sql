-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lotacao" TEXT,
    "matricula" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequisicaoPix" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "cpfResponsavel" TEXT NOT NULL,
    "lotacao" TEXT,
    "caso" TEXT,
    "tipoBusca" TEXT NOT NULL,
    "chaveBusca" TEXT NOT NULL,
    "motivoBusca" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "vinculos" JSONB,
    "autorizado" BOOLEAN NOT NULL,
    "cpfAutorizacao" TEXT,
    "nomeAutorizacao" TEXT,
    "dataHoraAutorizacao" TEXT,
    "tokenAutorizacao" TEXT,

    CONSTRAINT "RequisicaoPix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequisicaoRelacionamentoCCS" (
    "id" SERIAL NOT NULL,
    "dataRequisicao" TEXT NOT NULL,
    "dataInicioConsulta" TEXT NOT NULL,
    "dataFimConsulta" TEXT NOT NULL,
    "cpfCnpjConsulta" TEXT NOT NULL,
    "numeroProcesso" TEXT NOT NULL,
    "motivoBusca" TEXT NOT NULL,
    "cpfResponsavel" TEXT NOT NULL,
    "lotacao" TEXT,
    "caso" TEXT,
    "numeroRequisicao" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "tipoPessoa" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "autorizado" BOOLEAN NOT NULL,
    "cpfAutorizacao" TEXT,
    "nomeAutorizacao" TEXT,
    "dataHoraAutorizacao" TEXT,
    "tokenAutorizacao" TEXT,
    "status" TEXT NOT NULL,
    "detalhamento" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RequisicaoRelacionamentoCCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelacionamentoCCS" (
    "id" SERIAL NOT NULL,
    "numeroRequisicao" TEXT NOT NULL,
    "idPessoa" TEXT NOT NULL,
    "nomePessoa" TEXT NOT NULL,
    "tipoPessoa" TEXT NOT NULL,
    "cnpjResponsavel" TEXT NOT NULL,
    "numeroBancoResponsavel" TEXT NOT NULL,
    "nomeBancoResponsavel" TEXT NOT NULL,
    "cnpjParticipante" TEXT NOT NULL,
    "numeroBancoParticipante" TEXT NOT NULL,
    "nomeBancoParticipante" TEXT NOT NULL,
    "dataInicioRelacionamento" TEXT NOT NULL,
    "dataFimRelacionamento" TEXT,
    "idRequisicao" INTEGER NOT NULL,
    "dataRequisicaoDetalhamento" TEXT,
    "statusDetalhamento" TEXT NOT NULL DEFAULT 'Nao Solicitado',
    "respondeDetalhamento" BOOLEAN,
    "resposta" BOOLEAN NOT NULL DEFAULT false,
    "codigoResposta" TEXT,
    "codigoIfResposta" TEXT,
    "nuopResposta" TEXT,

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
    "dataFim" TEXT,
    "idRelacionamento" INTEGER NOT NULL,

    CONSTRAINT "BemDireitoValorCCS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculadosBDVCCS" (
    "id" SERIAL NOT NULL,
    "idBDV" INTEGER NOT NULL,
    "dataInicio" TEXT NOT NULL,
    "dataFim" TEXT,
    "idPessoa" TEXT NOT NULL,
    "nomePessoa" TEXT NOT NULL,
    "nomePessoaReceita" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "VinculadosBDVCCS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_matricula_key" ON "Usuario"("matricula");

-- AddForeignKey
ALTER TABLE "RelacionamentoCCS" ADD CONSTRAINT "RelacionamentoCCS_idRequisicao_fkey" FOREIGN KEY ("idRequisicao") REFERENCES "RequisicaoRelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BemDireitoValorCCS" ADD CONSTRAINT "BemDireitoValorCCS_idRelacionamento_fkey" FOREIGN KEY ("idRelacionamento") REFERENCES "RelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculadosBDVCCS" ADD CONSTRAINT "VinculadosBDVCCS_idBDV_fkey" FOREIGN KEY ("idBDV") REFERENCES "BemDireitoValorCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
