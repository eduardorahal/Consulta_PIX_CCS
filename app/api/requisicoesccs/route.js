import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";
import { prisma } from "@/lib/prisma";


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let cpfResponsavel = searchParams.get("cpfCnpj");

  // Busca as Requisições do Usuário cadastradas no Banco de Dados
  const requisicoesCCS = await prisma.requisicaoRelacionamentoCCS.findMany({
    where: {
      cpfResponsavel: cpfResponsavel,
    },
    include: {
      relacionamentosCCS: true
    },
    orderBy: {
      id: 'desc',
    }
  });

  // De posse das Requisições, busca no BACEN quais requisições já possuem respostas
  requisicoesCCS.map((requisicao) => {
    let numeroRequisicao = requisicao.numeroRequisicao;
    let cpfCnpj = requisicao.cpfCnpj;
    requisicao.relacionamentosCCS.map(async(relacionamento) => {
      
    if(relacionamento.resposta == false && relacionamento.respondeDetalhamento == true){
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

          // Verifica quais respostas chegaram e armazena as respostas do Detalhamento
          if(res.respostaDetalhamentos.respostaDetalhamento){
            resposta = true;
            codigoResposta = res.respostaDetalhamentos.respostaDetalhamento[0].codigo[0];
            codigoIfResposta = (res.respostaDetalhamentos.respostaDetalhamento[0].codigoIf) ? (res.respostaDetalhamentos.respostaDetalhamento[0].codigoIf[0]) : '';
            nuopResposta = (res.respostaDetalhamentos.respostaDetalhamento[0].nuop) ? (res.respostaDetalhamentos.respostaDetalhamento[0].nuop[0]) : '';

            try {
              await prisma.relacionamentoCCS.update({
                where: {
                  id: relacionamento.id,
                },
                data: {
                  resposta: true,
                  codigoResposta: codigoResposta,
                  codigoIfResposta: codigoIfResposta,
                  nuopResposta: nuopResposta
                },
              })
            } catch (e) {
              throw e;
            }
          }

          if(res.respostaDetalhamento){
            resposta = true;
            codigoResposta = res.respostaDetalhamento[0].codigo[0];
            codigoIfResposta = (res.respostaDetalhamento[0].codigoIf) ? (res.respostaDetalhamento[0].codigoIf[0]) : '';
            nuopResposta = (res.respostaDetalhamento[0].nuop) ? (res.respostaDetalhamento[0].nuop[0]) : '';

            try {
              await prisma.relacionamentoCCS.update({
                where: {
                  id: relacionamento.id,
                },
                data: {
                  resposta: true,
                  codigoResposta: codigoResposta,
                  codigoIfResposta: codigoIfResposta,
                  nuopResposta: nuopResposta
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
                  console.log(resBDV)
                })    
            })
          }
                    
        })
      })
    }
  })
})

  return NextResponse.json(requisicoesCCS)
}
