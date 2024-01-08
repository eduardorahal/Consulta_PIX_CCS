import { NextResponse } from "next/server";
import axios from "axios";

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
        }
    };

    const vinculos = await axios.request(config)
        .then(response => {
            console.log(JSON.stringify(response.data))
        })
        .catch((error) => {
            console.log(error)
        })
    return NextResponse.json(lista)
}