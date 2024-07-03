
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default async function RelatorioResumidoCCS(requisicoes) {

    const Logo_LAB = await fetch('/base64/Logo_LAB.txt').then(response => response.text())
    const Logo_PCSC = await fetch('/base64/Logo_PCSC.txt').then(response => response.text())

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const formatCnpjCpf = (value) => {
        const cnpjCpf = value.replace(/\D/g, '');

        if (cnpjCpf.length === 11) {
            return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
        }

        return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
    }

    const formatarData = (data) => {
        let novadata = new Date(data)
        return ((novadata.getDate() + 1)).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '/' + (novadata.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + '/' + novadata.getFullYear()
    }

    const tables = [];

    for await (const [i, requisicao] of requisicoes.entries()) {
        let relacionamentos = requisicao.relacionamentosCCS;

        relacionamentos.sort((a,b) => a.resposta - b.resposta)
        relacionamentos.sort((a,b) => a.respondeDetalhamento - b.respondeDetalhamento)

        tables.push(
            {
                table:
                {
                    widths: ['*','*'],
                    body: [
                        [
                            {
                                type: 'none',
                                colSpan: 1,
                                bold: true,
                                fontSize: 12,
                                margin: [5, 2, 2, 2],
                                text: (requisicao.nome + ' - CPF: ' + formatCnpjCpf(requisicao.cpfCnpj)),
                                fillColor: '#CCCCCC'
                            },
                            {
                                type: 'none',
                                colSpan: 1,
                                bold: true,
                                alignment: 'right',
                                fontSize: 12,
                                margin: [5, 2, 2, 2],
                                text: ('Requisição nº ' + requisicao.numeroRequisicao + ' de ' + formatarData(requisicao.dataRequisicao)),
                                fillColor: '#CCCCCC'
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            }
        )
        for await (let relacionamento of relacionamentos) {

                tables.push({
                    table: {
                        headerRows: 2,
                        pageBreak: 'before',
                        dontBreakRows: true,
                        widths: ['10%', '15%', '25%', '*', '10%', '10%'],
                        body: [
                            [
                                {
                                    text: {},
                                    alignment: 'left',
                                    colSpan: 6,
                                    fontSize: 11,
                                    margin: [3, 3, 3, 3],
                                    bold: true,
                                },
                                {},
                                {},
                                {},
                                {},
                                {}
                            ],
                            [
                                {
                                    text: 'Instituição: ' + relacionamento.numeroBancoResponsavel + ' - ' + relacionamento.nomeBancoResponsavel,
                                    alignment: 'left',
                                    colSpan: 4,
                                    fontSize: 11,
                                    margin: [3, 3, 3, 3],
                                    bold: true,
                                },
                                {},
                                {},
                                {},
                                {
                                    text: formatarData(relacionamento.dataInicioRelacionamento) + ' - ' + (relacionamento.dataFimRelacionamento ? formatarData(relacionamento.dataFimRelacionamento) : 'Vigente'),
                                    alignment: 'right',
                                    colSpan: 2,
                                    fontSize: 11,
                                    margin: [3, 3, 3, 3],
                                    bold: true,
                                },
                                {}
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                })    
        }

        if (i !== requisicoes.length - 1) {
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
                                    { text: 'REQUISIÇÕES CCS - RESUMIDA', alignment: 'center', fontSize: 10, bold: true },
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

    pdfMake.createPdf(doc).download('RelatórioResumidoCCS.pdf')

};