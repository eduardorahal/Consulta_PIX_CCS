import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from 'xml2js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lista = [];
    let cpfCnpj = searchParams.get('cpfCnpj');
    let dataInicio = searchParams.get('dataInicio');
    let dataFim = searchParams.get('dataFim');
    let numProcesso = searchParams.get('numProcesso');
    let motivo = searchParams.get('motivo');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www3.bcb.gov.br/bc_ccs/rest/requisitar-relacionamentos?id-cliente=' + cpfCnpj + '&data-inicio=' + dataInicio + '&data-fim=' + dataFim + '&numero-processo=' + numProcesso + '&motivo=' + motivo,
        headers: {
            'Authorization': 'Basic ZWp1ZnMucy1hcGljY3M6Ym9rYTIxMjM=',
            'accept': '*/*'
        }
    };

    const vinculos = await axios.request(config)
        .then(response => {
            const parser = xml2js.Parser();
            parser.parseStringPromise(response.data)
            .then((res) => {
                console.log(res.requisicaoRelacionamento.clientes[0].clientes[0].relacionamentos[0].relacionamentos);
                lista.push(res)
            })
            .catch((err) => console.error(err))
        })
        .catch((error) => {
            console.log(error)
        })
    return NextResponse.json(lista)
}