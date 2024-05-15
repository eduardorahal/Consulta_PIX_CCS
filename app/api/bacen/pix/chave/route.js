import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { validateToken } from "@/app/auth/tokenValidation";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lista = [];
    let cpfResponsavel = searchParams.get('cpfResponsavel');
    let token = (searchParams.get('token')).replaceAll(" ", "+");
    let chaveBusca = searchParams.get('chave');
    let motivo = searchParams.get('motivo');
    let data = new Date();
    let caso = searchParams.get('caso');
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www3.bcb.gov.br/bc_ccs/rest/consultar-vinculo-pix?chave=' + chaveBusca + '&motivo=' + motivo,
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.authBACEN,
        }
    };

    const validToken = await validateToken(token, cpfResponsavel)
    if(validToken){
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
                if (chave.cpfCnpj == null) {
                    chave.nomeProprietario = chave.eventosVinculo.nomeProprietario;
                    chave.cpfCnpj = chave.eventosVinculo.cpfCnpj;
                }

                // armazena as informações da requisição contendo os dados do solicitante e a resposta obtida

                let requisicao = {
                    data: data,
                    cpfResponsavel: cpfResponsavel,
                    caso: caso,
                    tipoBusca: 'chave',
                    chaveBusca: chaveBusca,
                    motivoBusca: motivo,
                    resultado: 'Sucesso',
                    vinculos: chave,
                    autorizado: true
                }
                try {
                    await prisma.requisicaoPix.create({
                        data: requisicao
                    }).then(
                        lista.push(chave)
                    )
                } catch (e) {
                    throw e
                }
            } else {
                let requisicao = {
                    data: data,
                    cpfResponsavel: cpfResponsavel,
                    caso: caso,
                    tipoBusca: 'chave',
                    chaveBusca: chaveBusca,
                    motivoBusca: motivo,
                    resultado: 'Chave não encontrada',
                    autorizado: true
                }
                try {
                    await prisma.requisicaoPix.create({
                        data: requisicao
                    })
                } catch (e) {
                    throw e
                }
            }
        })
        .catch((error) => {
            console.log(error);
        })
        return NextResponse.json(lista)
    } else {
        return NextResponse.json(lista)
    }
    
    
}