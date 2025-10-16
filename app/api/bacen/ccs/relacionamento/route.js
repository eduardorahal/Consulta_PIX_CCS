import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from 'xml2js';
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/app/auth/validateToken";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let lista = [];
    let relacionamentos = [];
    let cpfResponsavel = searchParams.get('cpfResponsavel');
    let lotacao = searchParams.get('lotacao');
    let token = (searchParams.get('token'));
    let cpfCnpj = searchParams.get('cpfCnpj');
    let dataInicio = searchParams.get('dataInicio');
    let dataFim = searchParams.get('dataFim');
    let numProcesso = searchParams.get('numProcesso');
    let motivo = searchParams.get('motivo');
    let caso = searchParams.get('caso');
    var credentials = btoa(process.env.usernameBC + ':' + process.env.passwordBC);
    var basicAuth = 'Basic ' + credentials;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www3.bcb.gov.br/bc_ccs/rest/requisitar-relacionamentos?id-cliente=' + cpfCnpj + '&data-inicio=' + dataInicio + '&data-fim=' + dataFim + '&numero-processo=' + numProcesso + '&motivo=' + motivo,
        headers: {
            'Authorization': basicAuth,
            'accept': '*/*'
        }
    };

    const validToken = await verifyJwtToken(token);
    if (validToken) {
        try {
            const response = await axios.request(config);
            const parser = new xml2js.Parser();
            const res = await parser.parseStringPromise(response.data);

            if (res.requisicaoRelacionamento.clientes[0].clientes[0].relacionamentos) {
                relacionamentos.push(res.requisicaoRelacionamento.clientes[0].clientes[0].relacionamentos[0].relacionamentos);
                
                for await (let relacionamento of relacionamentos[0]) {
                    try {
                        const participanteResponsavel = await axios.get('https://www3.bcb.gov.br/informes/rest/pessoasJuridicas?cnpj=' + relacionamento.cnpj);
                        relacionamento.cnpjResponsavel = relacionamento.cnpj[0];
                        relacionamento.numeroBancoResponsavel = (participanteResponsavel.data.codigoCompensacao ? participanteResponsavel.data.codigoCompensacao.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) : '000');
                        relacionamento.nomeBancoResponsavel = participanteResponsavel.data.nome;
                        relacionamento.dataInicioRelacionamento = relacionamento.periodos[0].periodos[0].dataInicio[0];
                        relacionamento.dataFimRelacionamento = relacionamento.periodos[0].periodos[0].dataFim ? relacionamento.periodos[0].periodos[0].dataFim[0] : "";
                    } catch (err) {
                        relacionamento.cnpjResponsavel = relacionamento.cnpj[0];
                        relacionamento.numeroBancoResponsavel = "000";
                        relacionamento.nomeBancoResponsavel = "BANCO NÃO INFORMADO";
                        relacionamento.dataInicioRelacionamento = relacionamento.periodos[0].periodos[0].dataInicio[0];
                        relacionamento.dataFimRelacionamento = relacionamento.periodos[0].periodos[0].dataFim ? relacionamento.periodos[0].periodos[0].dataFim[0] : "";
                    }
                    try {
                        const participanteBanco = await axios.get('https://www3.bcb.gov.br/informes/rest/pessoasJuridicas?cnpj=' + relacionamento.cnpjParticipante);
                        relacionamento.cnpjParticipante = relacionamento.cnpjParticipante[0];
                        relacionamento.numeroBancoParticipante = (participanteBanco.data.codigoCompensacao ? participanteBanco.data.codigoCompensacao.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) : '000');
                        relacionamento.nomeBancoParticipante = participanteBanco.data.nome;
                    } catch (err) {
                        relacionamento.cnpjParticipante = relacionamento.cnpjParticipante[0];
                        relacionamento.numeroBancoParticipante = "000";
                        relacionamento.nomeBancoParticipante = "BANCO NÃO INFORMADO";
                    }
                    relacionamento.numeroRequisicao = res.requisicaoRelacionamento.numeroRequisicao[0];
                    relacionamento.idPessoa = res.requisicaoRelacionamento.clientes[0].clientes[0].id[0];
                    relacionamento.nomePessoa = res.requisicaoRelacionamento.clientes[0].clientes[0].nome[0];
                    relacionamento.tipoPessoa = res.requisicaoRelacionamento.clientes[0].clientes[0].tipoPessoa[0];
                    delete relacionamento.responsavelAtivo;
                    delete relacionamento.periodos;
                    delete relacionamento.cnpj;
                }

                let requisicao = {
                    dataRequisicao: res.requisicaoRelacionamento.dataMovimento[0],
                    dataInicioConsulta: dataInicio,
                    dataFimConsulta: dataFim,
                    cpfCnpjConsulta: cpfCnpj,
                    numeroProcesso: res.requisicaoRelacionamento.numeroProcesso[0],
                    motivoBusca: res.requisicaoRelacionamento.motivo[0],
                    cpfResponsavel: cpfResponsavel,
                    lotacao: lotacao,
                    caso: caso,
                    numeroRequisicao: res.requisicaoRelacionamento.numeroRequisicao[0],
                    cpfCnpj: res.requisicaoRelacionamento.clientes[0].clientes[0].id[0],
                    tipoPessoa: res.requisicaoRelacionamento.clientes[0].clientes[0].tipoPessoa[0],
                    nome: res.requisicaoRelacionamento.clientes[0].clientes[0].nome[0],
                    relacionamentosCCS: {
                        create: relacionamentos[0]
                    },
                    autorizado: true,
                    status: "Sucesso"
                };

                let requisicaoSalva = await prisma.requisicaoRelacionamentoCCS.create({ data: requisicao });
                let retornoConsulta = await prisma.requisicaoRelacionamentoCCS.findUnique({
                    where: { id: requisicaoSalva.id },
                    include: { relacionamentosCCS: true }
                });
                lista.push(retornoConsulta);

            } else {
                let requisicao = {
                    dataRequisicao: res.requisicaoRelacionamento.dataMovimento[0],
                    dataInicioConsulta: dataInicio,
                    dataFimConsulta: dataFim,
                    cpfCnpjConsulta: cpfCnpj,
                    numeroProcesso: res.requisicaoRelacionamento.numeroProcesso[0],
                    motivoBusca: res.requisicaoRelacionamento.motivo[0],
                    cpfResponsavel: cpfResponsavel,
                    lotacao: lotacao,
                    caso: caso,
                    numeroRequisicao: res.requisicaoRelacionamento.numeroRequisicao[0],
                    cpfCnpj: res.requisicaoRelacionamento.clientes[0].clientes[0].id[0],
                    tipoPessoa: res.requisicaoRelacionamento.clientes[0].clientes[0].tipoPessoa[0],
                    nome: res.requisicaoRelacionamento.clientes[0].clientes[0].nome[0],
                    autorizado: true,
                    status: "Sucesso"
                };

                await prisma.requisicaoRelacionamentoCCS.create({ data: requisicao });
                lista.push({ cpfCnpj: cpfCnpj, status: 'Sucesso', msg: 'CPF / CNPJ Não possui relacionamentos no período informado' });
            }
        } catch (error) {
            let requisicao = {
                dataRequisicao: new Date().toDateString(),
                dataInicioConsulta: '',
                dataFimConsulta: '',
                cpfCnpjConsulta: cpfCnpj,
                numeroProcesso: '',
                motivoBusca: motivo,
                cpfResponsavel: cpfResponsavel,
                lotacao: lotacao,
                caso: caso,
                numeroRequisicao: '',
                cpfCnpj: '',
                tipoPessoa: '',
                nome: '',
                autorizado: true,
                status: "Falha"
            };

            await prisma.requisicaoRelacionamentoCCS.create({ data: requisicao });
            lista.push({ cpfCnpj: cpfCnpj, status: 'Falha', msg: 'CPF ou CNPJ incorreto' });
        }
        return NextResponse.json(lista);
    } else {
        return NextResponse.json(lista);
    }
}
