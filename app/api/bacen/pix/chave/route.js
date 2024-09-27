import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/app/auth/validateToken";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lista = [];
    let cpfResponsavel = searchParams.get('cpfResponsavel');
    let lotacao = searchParams.get('lotacao');
    let token = (searchParams.get('token'));
    let chaveBusca = searchParams.get('chave');
    let motivo = searchParams.get('motivo');
    let data = new Date();
    let caso = searchParams.get('caso');
    var credentials = btoa(process.env.usernameBC + ':' + process.env.passwordBC);
    var basicAuth = 'Basic ' + credentials;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www3.bcb.gov.br/bc_ccs/rest/consultar-vinculo-pix?chave=' + chaveBusca + '&motivo=' + motivo,
        headers: {
            'Accept': 'application/json',
            'Authorization': basicAuth,
        }
    };

    const validToken = await verifyJwtToken(token)
    if (validToken) {
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
                    if (chave.cpfCnpj == null || !(chave.cpfCnpj)) {
                        if (chave.eventosVinculo.nomeProprietario) {
                            chave.nomeProprietario = chave.eventosVinculo.nomeProprietario;
                            chave.cpfCnpj = chave.eventosVinculo.cpfCnpj;
                        } else {
                            chave.nomeProprietario = 'NOME NÃO INFORMADO';
                            chave.cpfCnpj = 'CPF/CNPJ NÃO INFORMADO'
                        }

                    }

                    // armazena as informações da requisição contendo os dados do solicitante e a resposta obtida

                    let requisicao = {
                        data: data,
                        cpfResponsavel: cpfResponsavel,
                        lotacao: lotacao,
                        caso: caso,
                        tipoBusca: 'chave',
                        chaveBusca: chaveBusca,
                        motivoBusca: motivo,
                        resultado: 'Sucesso',
                        vinculos: chave,
                        autorizado: true,
                        chaves: {
                            create: {
                                chave: chave.chave,
                                tipoChave: chave.tipoChave,
                                status: chave.status,
                                dataAberturaReivindicacao: chave.dataAberturaReivindicacao,
                                cpfCnpj: chave.cpfCnpj,
                                nomeProprietario: chave.nomeProprietario,
                                nomeFantasia: chave.nomeFantasia,
                                participante: chave.participante,
                                agencia: chave.agencia,
                                numeroConta: chave.numeroConta,
                                tipoConta: chave.tipoConta,
                                dataAberturaConta: chave.dataAberturaConta,
                                proprietarioDaChaveDesde: chave.proprietarioDaChaveDesde,
                                dataCriacao: chave.dataCriacao,
                                ultimaModificacao: chave.ultimaModificacao,
                                numeroBanco: chave.numerobanco,
                                nomeBanco: chave.nomebanco,
                                cpfCnpjBusca: chave.cpfCnpjBusca,
                                nomeProprietarioBusca: chave.nomeProprietarioBusca,
                                eventosVinculo: {
                                    create: chave.eventosVinculo.map(evento => ({
                                        tipoEvento: evento.tipoEvento,
                                        motivoEvento: evento.motivoEvento,
                                        dataEvento: evento.dataEvento,
                                        chave: evento.chave,
                                        tipoChave: evento.tipoChave,
                                        cpfCnpj: evento.cpfCnpj,
                                        nomeProprietario: evento.nomeProprietario,
                                        nomeFantasia: evento.nomeFantasia,
                                        participante: evento.participante,
                                        agencia: evento.agencia,
                                        numeroConta: evento.numeroConta,
                                        tipoConta: evento.tipoConta,
                                        dataAberturaConta: evento.dataAberturaConta,
                                        numeroBanco: evento.numerobanco,
                                        nomeBanco: evento.nomebanco
                                    }))
                                }
                            }
                        },
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
                        lotacao: lotacao,
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