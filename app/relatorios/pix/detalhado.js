'use client'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default async function RelatorioDetalhadoPix(vinculosPix) {

    const Logo_LAB = await fetch('/base64/Logo_LAB.txt').then(response => response.text())
    const Logo_PCSC = await fetch('/base64/Logo_PCSC.txt').then(response => response.text())

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    let cpfs = [...new Set(
        vinculosPix.map((item) => {
            return item.cpfCnpj
        })
    )];

    const formatCnpjCpf = (value) => {
        const cnpjCpf = value.replace(/\D/g, '');

        if (cnpjCpf.length === 11) {
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
        }

        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
    }

    const formatarData = (data) => {
        let novadata = new Date(data)
        return novadata.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '/' + (novadata.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '/' + novadata.getFullYear()
    }

    const tables = [];

    for await (let cpf of cpfs) {
        let vinculos = await vinculosPix.filter((vinculos) => vinculos.cpfCnpj == cpf)
        let nomeProprietario = (vinculos[0].nomeProprietario).toUpperCase()
        tables.push(
            {
                table:
                {
                    widths: ['*'],
                    body: [
                        [
                            {
                                type: 'none',
                                bold: true,
                                fontSize: 12,
                                margin: [5, 2, 2, 2],
                                text: nomeProprietario + ' - CPF: ' + formatCnpjCpf(cpf),
                                fillColor: '#CCCCCC'
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            }
        )
        for await (let vinculo of vinculos) {
            let rows = vinculo.eventosVinculo.map((evento) => {
                return [
                    { text: formatarData(evento.dataEvento), fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: evento.tipoEvento, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: evento.motivoEvento, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: evento.cpfCnpj ? formatCnpjCpf(evento.cpfCnpj) : null, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: evento.nomeProprietario ? evento.nomeProprietario.toUpperCase() : null, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: evento.participante + '\nAgência: ' + evento.agencia + '\nConta: ' + parseInt(evento.numeroConta, 10) + '\nTipo: ' + evento.tipoConta, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: formatarData(evento.dataAberturaConta), alignment: 'right', fontSize: 9, margin: [0, 2, 0, 2] }
                ]
            })
            tables.push({
                table: {
                    headerRows: 2,
                    pageBreak: 'before',
                    dontBreakRows: true,
                    widths: [55, 40, 98, 70, '*', 150, 70],
                    body: [
                        [
                            {
                                text: 'Chave: ' + vinculo.chave + ' - ' + vinculo.status,
                                alignment: 'left',
                                colSpan: 7,
                                fontSize: 11,
                                margin: [0, 10, 0, 5],
                                bold: true
                            },
                            {},
                            {},
                            {},
                            {},
                            {},
                            {}
                        ],
                        [
                            { text: 'Data', fontSize: 10, bold: true },
                            { text: 'Evento', fontSize: 10, bold: true },
                            { text: 'Motivo', fontSize: 10, bold: true },
                            { text: 'CPF/CNPJ', fontSize: 10, bold: true },
                            { text: 'Nome', fontSize: 10, bold: true },
                            { text: 'Banco', fontSize: 10, bold: true },
                            { text: 'Abertura Conta', alignment: 'right', fontSize: 10, bold: true }
                        ],
                        ...rows
                    ]
                },
                layout: 'lightHorizontalLines',
            })
        }
        let ultimoCPF = cpfs[cpfs.length - 1]
        if (ultimoCPF != cpf) {
            tables.push(
                { text: {}, pageBreak: 'after' },
            )
        }
    }


    const content = [

        tables

    ];

    function Header(currentPage, pageCount, pageSize) {
        return [
            {
                margin: [20, 20, 40, 0],
                table: {
                    widths: [200, '*', 180],
                    body: [
                        [
                            { image: Logo_LAB, alignment: 'center', width: 150 },
                            {
                                text: [
                                    { text: 'POLÍCIA CIVIL DE SANTA CATARINA\nDIRETORIA ESTADUAL DE INVESTIGAÇÃO CRIMINAL\nLABORATÓRIO DE TECNOLOGIA CONTRA LAVAGEM DE DINHEIRO\n\n', alignment: 'center', fontSize: 10 },
                                    { text: 'RELAÇÃO DE CHAVES PIX - DETALHADA', alignment: 'center', fontSize: 10, bold: true },
                                ]
                            },
                            { image: Logo_PCSC, alignment: 'right', width: 50 },
                        ],
                    ],
                },
                layout: 'noBorders'
            }

        ]
    }

    function Footer(currentPage, pageCount) {
        return [
            {
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [
                            { text: '\n\nCONFIDENCIAL', alignment: 'left', fontSize: 9, bold: true, margin: [40, 0, 0, 0] },
                            {
                                text: currentPage + ' / ' + pageCount,
                                fontSize: 9,
                                alignment: 'right',
                                margin: [0, 20, 40, 0]
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            }

        ]
    }

    const doc = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [40, 90, 40, 60],
        header: Header,
        content: [content],
        footer: Footer,
    }

    pdfMake.createPdf(doc).download('RelatórioDetalhadoPIX.pdf')

};