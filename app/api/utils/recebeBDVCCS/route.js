import axios from "axios";
import xml2js from "xml2js";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {

  // Busca as Requisições do Usuário cadastradas no Banco de Dados aguardando resposta dos Bancos
  const requisicoesCCS = await prisma.requisicaoRelacionamentoCCS.findMany({
    where: {
      relacionamentosCCS: {
        some: {
          statusDetalhamento: 'Solicitado. Aguardando...',
        }       
      }
    },
    include: {
      relacionamentosCCS: {
        where: {
          statusDetalhamento: 'Solicitado. Aguardando...',
        }
      }
    },
    orderBy: {
      id: 'desc',
    }
  })

  // De posse das Requisições, busca no BACEN quais requisições já possuem respostas
  for await (let requisicao of requisicoesCCS){
    let numeroRequisicao = requisicao.numeroRequisicao;
    let cpfCnpj = requisicao.cpfCnpj;
    requisicao.relacionamentosCCS.map(async(relacionamento) => {
      
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url:
          "https://www3.bcb.gov.br/bc_ccs/rest/obter-respostas-detalhamento?numero-requisicao=" +
          numeroRequisicao +
          "&id-pessoa=" +
          cpfCnpj +
          "&cnpj-responsavel=" +
          relacionamento.cnpjResponsavel +
          "&cnpj-participante=" +
          relacionamento.cnpjParticipante,
        headers: {
          Authorization: "Basic ZWp1ZnMucy1hcGljY3M6Ym9rYTIxMjQ=",
          accept: "*/*",
        },
      };

      await axios
      .request(config)
      .then(async (response) => {
        const parser = xml2js.Parser();
        await parser
        .parseStringPromise(response.data)
        .then(async (res) => {

          let resposta;
          let codigoResposta;
          let codigoIfResposta;
          let nuopResposta;
          let statusDetalhamento;

          // Verifica quais respostas chegaram e armazena as respostas do Detalhamento
          if (res.respostaDetalhamentos.respostaDetalhamento || res.respostaDetalhamento){

            resposta = true;
            statusDetalhamento = "Concluído";

            if(res.respostaDetalhamentos.respostaDetalhamento){
              codigoResposta = res.respostaDetalhamentos.respostaDetalhamento[0].codigo[0]
            } else {
              codigoResposta = res.respostaDetalhamento[0].codigo[0]
            }
            
            if (res.respostaDetalhamentos.respostaDetalhamento) {
              codigoIfResposta = (res.respostaDetalhamentos.respostaDetalhamento[0].codigoIf) ? (res.respostaDetalhamentos.respostaDetalhamento[0].codigoIf[0]) : '';
            } else {
              codigoIfResposta = (res.respostaDetalhamento[0].codigoIf) ? (res.respostaDetalhamento[0].codigoIf[0]) : '';
            }
            
            if (res.respostaDetalhamentos.respostaDetalhamento) {
              nuopResposta = (res.respostaDetalhamentos.respostaDetalhamento[0].nuop) ? (res.respostaDetalhamentos.respostaDetalhamento[0].nuop[0]) : '';
            } else {
              nuopResposta = (res.respostaDetalhamento[0].nuop) ? res.respostaDetalhamento[0].nuop[0] : '';
            }

            relacionamento.resposta = resposta;
            relacionamento.codigoResposta = codigoResposta;
            relacionamento.codigoIfResposta = codigoIfResposta;
            relacionamento.nuopResposta = nuopResposta;

            try {
              await prisma.relacionamentoCCS.update({
                where: {
                  id: relacionamento.id,
                },
                data: {
                  resposta: true,
                  codigoResposta: codigoResposta,
                  codigoIfResposta: codigoIfResposta,
                  nuopResposta: nuopResposta,
                  statusDetalhamento: statusDetalhamento
                },
              })
            } catch (e) {
              throw e;
            }
          }
             
          if (resposta){

            // Busca pelo BDV da Resposta no BACEN
            let configBDV = {
              method: "get",
              maxBodyLength: Infinity,
              url:
                "https://www3.bcb.gov.br/bc_ccs/rest/obter-bdvs-resposta?numero-controle-resposta=" +
                codigoResposta,
              headers: {
                Authorization: "Basic ZWp1ZnMucy1hcGljY3M6Ym9rYTIxMjQ=",
                accept: "*/*",
              },
            };

            await axios
            .request(configBDV)
            .then(async (responseBDV) => {
              const parser = xml2js.Parser();
              await parser
                .parseStringPromise(responseBDV.data)
                .then(async (resBDV) => {
                  resBDV.bemDireitoValors.bemDireitoValor.map(async (bdv) => {
                    let vinculados = [];
                    if (bdv.vinculados[0].vinculados){
                      vinculados = bdv.vinculados[0].vinculados;
                      vinculados.map((vinculado) => {
                      vinculado.idPessoa = vinculado.idPessoa[0] 
                      vinculado.dataInicio = vinculado.dataInicio[0] 
                      vinculado.dataFim = (vinculado.dataFim) ? (vinculado.dataFim[0]) : ''
                      vinculado.nomePessoa = vinculado.nomePessoa[0] 
                      vinculado.nomePessoaReceita = vinculado.nomePessoaReceita[0] 
                      vinculado.tipo = vinculado.tipo[0] 
                    })
                    }
                    
                    let bdvPronto = {
                      idRelacionamento: relacionamento.id,
                      cnpjParticipante: (bdv.cnpjParticipante) ? bdv.cnpjParticipante[0] : '',
                      tipo: (bdv.tipo) ? bdv.tipo[0] : '',
                      agencia: (bdv.agencia) ? bdv.agencia[0] : '',
                      conta: (bdv.conta) ? bdv.conta[0] : '',
                      vinculo: (bdv.vinculo) ? bdv.vinculo[0] : '',
                      nomePessoa: (bdv.nomePessoa) ? bdv.nomePessoa[0] : '',
                      dataInicio: (bdv.dataInicio) ? bdv.dataInicio[0] : '',
                      dataFim: (bdv.dataFim) ? bdv.dataFim[0] : '',
                      vinculados: {
                        create: vinculados
                        },
                    }
                    try {
                      await prisma.bemDireitoValorCCS.create({
                          data: bdvPronto
                      })
                    } catch (e) {
                        throw e
                    }
                  })
                })    
            })
          }     
        })
      })
  })
  }
  return NextResponse.json({message: 'done'})
}
