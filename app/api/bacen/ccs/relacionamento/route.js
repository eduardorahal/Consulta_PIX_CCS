import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from 'xml2js';
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lista = [];
    let relacionamentos = [];
    let cpfResponsavel = process.env.CPF_RESPONSAVEL
    let cpfCnpj = searchParams.get('cpfCnpj');
    let dataInicio = searchParams.get('dataInicio');
    let dataFim = searchParams.get('dataFim');
    let numProcesso = searchParams.get('numProcesso');
    let motivo = searchParams.get('motivo');
    let caso = searchParams.get('caso');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www3.bcb.gov.br/bc_ccs/rest/requisitar-relacionamentos?id-cliente=' + cpfCnpj + '&data-inicio=' + dataInicio + '&data-fim=' + dataFim + '&numero-processo=' + numProcesso + '&motivo=' + motivo,
        headers: {
            'Authorization': 'Basic ZWp1ZnMucy1hcGljY3M6Ym9rYTIxMjQ=',
            'accept': '*/*'
        }
    };

    const vinculos = await axios.request(config)
        .then(async response => {
            const parser = xml2js.Parser();
            await parser.parseStringPromise(response.data)
                .then(async (res) => {
                    relacionamentos.push(res.requisicaoRelacionamento.clientes[0].clientes[0].relacionamentos[0].relacionamentos)
                    // Pesquisa pelos nomes das IFs em cada registro de relacionamento

                    for await (let relacionamento of relacionamentos[0]) {
                        await axios.get('https://www3.bcb.gov.br/informes/rest/pessoasJuridicas?cnpj=' + relacionamento.cnpj)
                            .then(response => response.data)
                            .then((participante) => {
                                relacionamento.cnpjResponsavel = relacionamento.cnpj[0];
                                relacionamento.numeroBancoResponsavel = (participante.codigoCompensacao ? participante.codigoCompensacao.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) : '000');
                                relacionamento.nomeBancoResponsavel = participante.nome;
                                relacionamento.dataInicioRelacionamento = relacionamento.periodos[0].periodos[0].dataInicio[0];
                                relacionamento.dataFimRelacionamento = relacionamento.periodos[0].periodos[0].dataFim ? relacionamento.periodos[0].periodos[0].dataFim[0] : "";
                            })
                            .catch((err) => {
                                relacionamento.cnpjResponsavel = relacionamento.cnpj[0];
                                relacionamento.numeroBancoResponsavel = "000";
                                relacionamento.nomeBancoResponsavel = "BANCO NÃO INFORMADO";
                                relacionamento.dataInicioRelacionamento = relacionamento.periodos[0].periodos[0].dataInicio[0];
                                relacionamento.dataFimRelacionamento = relacionamento.periodos[0].periodos[0].dataFim ? relacionamento.periodos[0].periodos[0].dataFim[0] : "";
                            })
                        await axios.get('https://www3.bcb.gov.br/informes/rest/pessoasJuridicas?cnpj=' + relacionamento.cnpjParticipante)
                            .then(response => response.data)
                            .then((participante) => {
                                relacionamento.cnpjParticipante = relacionamento.cnpjParticipante[0]
                                relacionamento.numeroBancoParticipante = (participante.codigoCompensacao ? participante.codigoCompensacao.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) : '000');
                                relacionamento.nomeBancoParticipante = participante.nome;
                            })
                            .catch((err) => {
                                relacionamento.cnpjBancoParticipante = relacionamento.cnpjParticipante[0]
                                relacionamento.numeroBancoParticipante = "000";
                                relacionamento.nomeBancoParticipante = "BANCO NÃO INFORMADO";
                            })
                        relacionamento.numeroRequisicao = res.requisicaoRelacionamento.numeroRequisicao[0];
                        relacionamento.idPessoa = res.requisicaoRelacionamento.clientes[0].clientes[0].id[0];
                        delete relacionamento.responsavelAtivo;
                        delete relacionamento.periodos;
                        delete relacionamento.cnpj;

                    }

                    // armazena as informações da requisição contendo os dados da solicitação e a resposta obtida

                    let requisicao = {
                        dataRequisicao:  res.requisicaoRelacionamento.dataMovimento[0],
                        dataInicioConsulta: dataInicio,
                        dataFimConsulta: dataFim,
                        cpfCnpjConsulta: cpfCnpj,
                        numeroProcesso: res.requisicaoRelacionamento.numeroProcesso[0],
                        motivoBusca: res.requisicaoRelacionamento.motivo[0],
                        cpfResponsavel: cpfResponsavel,
                        caso: caso,
                        numeroRequisicao: res.requisicaoRelacionamento.numeroRequisicao[0],
                        cpfCnpj: res.requisicaoRelacionamento.clientes[0].clientes[0].id[0],
                        tipoPessoa: res.requisicaoRelacionamento.clientes[0].clientes[0].tipoPessoa[0],
                        nome: res.requisicaoRelacionamento.clientes[0].clientes[0].nome[0],
                        relacionamentosCCS: {
                            create: relacionamentos[0]
                            },
                        autorizado: true
                    }
                    try {
                        let requisicaoSalva = await prisma.requisicaoRelacionamentoCCS.create({
                            data: requisicao
                        })
                        let retornoConsulta = await prisma.requisicaoRelacionamentoCCS.findUnique({
                            where: {
                                id: requisicaoSalva.id,
                            },
                            include: {
                                relacionamentosCCS: true,
                            },
                        })
                        lista.push(retornoConsulta)
                    } catch (e) {
                        throw e
                    }

                })
                .catch((err) => console.error(err))
        })
        .catch((error) => {
            console.log(error)
        })
    return NextResponse.json(lista)
}