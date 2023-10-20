import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lista = [];
    let chave = searchParams.get('chave');
    let motivo = searchParams.get('motivo');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www3.bcb.gov.br/bc_ccs/rest/consultar-vinculo-pix?chave=' + chave + '&motivo=' + motivo,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic ZWp1ZnMucy1hcGljY3M6Ym9rYTIxMjM=',
        }
    };

    const vinculos = await axios.request(config)
        .then(res1 => res1.data)
        .then(async (chave) => {
            if (chave.chave != null) {
                await axios.get('https://www3.bcb.gov.br/informes/rest/pessoasJuridicas?cnpj=' + chave.participante)
                    .then(response => response.data)
                    .then((participante) => {
                        chave.numerobanco = (participante.codigoCompensacao ? participante.codigoCompensacao.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) : '000');
                        chave.nomebanco = participante.nome
                    })
                    .catch((err) => {
                        chave.numerobanco = "000";
                        chave.nomebanco = "BANCO NÃO INFORMADO"
                    })
                for await (let evento of chave.eventosVinculo) {
                    await axios.get('https://www3.bcb.gov.br/informes/rest/pessoasJuridicas?cnpj=' + evento.participante)
                        .then(response => response.data)
                        .then((participante) => {
                            evento.numerobanco = (participante.codigoCompensacao ? participante.codigoCompensacao.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) : '000');
                            evento.nomebanco = participante.nome
                        })
                        .catch((err) => {
                            evento.numerobanco = "000";
                            evento.nomebanco = "BANCO NÃO INFORMADO"
                        })
                }
                if (chave.status == null) {
                    chave.status = 'INATIVO'
                }
                lista.push(chave)
            }
        }
        )
        .catch((error) => {
            console.log(error);
        })

    return NextResponse.json(lista)
}