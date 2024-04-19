import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  let lista = [];
  const { searchParams } = new URL(request.url);
  let numeroRequisicao = searchParams.get("numeroRequisicao");
  let cpfCnpj = searchParams.get("cpfCnpj");
  let cnpjResponsavel = searchParams.get("cnpjResponsavel");
  let cnpjParticipante = searchParams.get("cnpjParticipante");
  let dataInicioRelacionamento = searchParams.get("dataInicioRelacionamento");
  let idRelacionamento = searchParams.get("idRelacionamento");
  let nomeBancoResponsavel = searchParams.get("nomeBancoResponsavel");

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

  if (now > late || now < early){
    
    // armazena as informações da requisição de detalhamento
    try {
      await prisma.relacionamentoCCS.update({
        where: {
          id: parseInt(idRelacionamento),
        },
        data: {
          statusDetalhamento: 'Na fila',
        },
      }).then(
        lista.push({banco: nomeBancoResponsavel, msg: 'Na fila de processamento', status: 'pendente' })
      )
    } catch (e) {
      console.log('Erro ao salvar atualização CCS no Banco de Dados. Tente novamente', e);
    }
    
  } else {

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
                id: parseInt(idRelacionamento),
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
      if(error.response.status === 500){

        // armazena que a IF não responde a detalhamentos
        try {
          await prisma.relacionamentoCCS.update({
            where: {
              id: parseInt(idRelacionamento),
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
  }

  return NextResponse.json(lista);
}
