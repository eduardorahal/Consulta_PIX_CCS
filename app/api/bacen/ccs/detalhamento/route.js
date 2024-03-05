import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  let lista = [];
  const { searchParams } = new URL(request.url);
  let cpfResponsavel = process.env.CPF_RESPONSAVEL;
  let numeroRequisicao = searchParams.get("numeroRequisicao");
  let cpfCnpj = searchParams.get("cpfCnpj");
  let cnpjResponsavel = searchParams.get("cnpjResponsavel");
  let cnpjParticipante = searchParams.get("cnpjParticipante");
  let dataInicioRelacionamento = searchParams.get("dataInicioRelacionamento");
  let caso = searchParams.get("caso");

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
      console.log(response.status)
      const parser = xml2js.Parser();
      await parser
        .parseStringPromise(response.data)
        .then(async (res) => {
          console.log(res)
          // armazena as informações da requisição contendo os dados da solicitação

          let requisicao = {
            dataRequisicao: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].dataHoraRequisicao[0],
            caso: caso,
            cpfResponsavel: cpfResponsavel,
            numeroRequisicao: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].numeroRequisicao[0],
            idPessoa: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].idPessoa[0],
            tipoPessoa: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].tipoPessoa[0],
            cnpjResponsavel: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].cnpjResponsavel[0],
            cnpjParticipante: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].cnpjParticipante[0],
            dataInicio: res.requisicaoDetalhamentos.requisicaoDetalhamento[0].dataInicio[0],
            autorizado: true
          };
          try {
            await prisma.requisicaoDetalhamentoCCS
              .create({
                data: requisicao,
              })
              .then(lista.push(requisicao));
          } catch (e) {
            throw e;
          }
        })
        .catch((err) => console.error(err));
    })
    .catch((error) => {
      console.log(error.response.status);
    });
  return NextResponse.json(lista);
}
