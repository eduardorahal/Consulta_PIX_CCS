import axios from "axios";
import xml2js from "xml2js";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {

    let lista = [];

    const now = new Date();

    var late = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // the next day, ...
        18, 55, 0 // ...at 00:00:00 hours
    );

    var early = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // the next day, ...
        10, 0, 0 // ...at 00:00:00 hours
    );

    if (now > late || now < early) {

        lista.push({msg: 'Detalhamento somente pode ser solicitado entre 10h e 19h', status: 'falha' })

    } else {

        // Busca as Requisições do Usuário na fila para solicitação de detalhamento. Em virtude do horário da solicitação pelo usuário.
        const filaCCS = await prisma.requisicaoRelacionamentoCCS.findMany({
            where: {
                relacionamentosCCS: {
                    some: {
                        statusDetalhamento: 'Na fila',
                    }
                }
            },
            include: {
                relacionamentosCCS: {
                    where: {
                        statusDetalhamento: 'Na fila',
                    }
                }
            },
            orderBy: {
                id: 'desc',
            }
        })

        // De possse das Requisições 'Na fila', envia solicitação de detalhamento ao BACEN
        for await (let requisicao of filaCCS) {

            requisicao.relacionamentosCCS.map(async (relacionamento) => {

                let numeroRequisicao = requisicao.numeroRequisicao;
                let cpfCnpj = requisicao.cpfCnpj;
                let cnpjResponsavel = relacionamento.cnpjResponsavel;
                let cnpjParticipante = relacionamento.cnpjParticipante;
                let dataInicioRelacionamento = relacionamento.dataInicioRelacionamento;
                let nomeBancoResponsavel = relacionamento.nomeBancoResponsavel;

                let config = {
                    method: "get",
                    maxBodyLength: Infinity,
                    url:
                        "https://www3.bcb.gov.br/bc_ccs/rest/requisitar-detalhamentos?numeros-requisicoes=" +
                        numeroRequisicao +
                        "&ids-pessoa=" +
                        cpfCnpj +
                        "&cnpj-responsaveis=" +
                        cnpjResponsavel +
                        "&cnpj-participantes=" +
                        cnpjParticipante +
                        "&datas-inicio=" +
                        dataInicioRelacionamento,
                    headers: {
                        Authorization: "Basic ZWp1ZnMucy1hcGljY3M6Ym9rYTIxMjQ=",
                        accept: "*/*",
                    },
                };

                const vinculos = await axios
                    .request(config)
                    .then(async (response) => {
                        const parser = xml2js.Parser();
                        await parser
                            .parseStringPromise(response.data)
                            .then(async (res) => {

                                // armazena as informações da requisição de detalhamento
                                try {
                                    await prisma.relacionamentoCCS.update({
                                        where: {
                                            id: relacionamento.id,
                                        },
                                        data: {
                                            dataRequisicaoDetalhamento: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].dataHoraRequisicao[0],
                                            statusDetalhamento: 'Solicitado. Aguardando...',
                                            respondeDetalhamento: true,
                                            resposta: false
                                        },
                                    }).then(
                                        lista.push({banco: nomeBancoResponsavel, msg: 'Detalhamento Solicitado', status: 'sucesso' })
                                      )
                                } catch (e) {
                                    console.log('Erro ao salvar atualização CCS no Banco de Dados. Tente novamente', e);
                                }
                            })
                            .catch((err) => console.error("Erro ao fazer o parse da resposta BACEN", err));
                    })
                    .catch(async (error) => {
                        if (error.response.status === 500) {

                            // armazena que a IF não responde a detalhamentos
                            try {
                                await prisma.relacionamentoCCS.update({
                                    where: {
                                        id: relacionamento.id,
                                    },
                                    data: {
                                        dataRequisicaoDetalhamento: (new Date()).toISOString(),
                                        statusDetalhamento: 'IF não detalha',
                                        respondeDetalhamento: false,
                                        resposta: true
                                    },
                                }).then(
                                    lista.push({banco: nomeBancoResponsavel, msg: 'Sem detalhamento', status: 'falha' })
                                  )
                            } catch (e) {
                                console.log('Erro ao salvar atualização CCS no Banco de Dados. Tente novamente', e);
                            }
                        };
                    });

            })
        }

    }
    return NextResponse.json(lista)
}
