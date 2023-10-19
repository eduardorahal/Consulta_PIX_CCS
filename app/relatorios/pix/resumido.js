'use client'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default async function RelatorioResumidoPix(vinculosPix) {

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

    const tables = [];

    for await (let cpf of cpfs) {
        let vinculos = await vinculosPix.filter((vinculos) => vinculos.cpfCnpj == cpf)
        let rows = vinculos.map((vinculo) => {
            return [
                { text: vinculo.chave, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: vinculo.tipoChave, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: vinculo.cpfCnpj ? formatCnpjCpf(vinculo.cpfCnpj) : null, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: vinculo.nomeProprietario ? vinculo.nomeProprietario.toUpperCase() : null, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: vinculo.participante + '\nAgência: ' + vinculo.agencia + '\nConta: ' + parseInt(vinculo.numeroConta, 10) + '\nTipo: ' + vinculo.tipoConta, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: vinculo.status, fontSize: 9, margin: [0, 2, 0, 2] }
            ]
        })
        tables.push({
            table: {
                headerRows: 2,
                pageBreak: 'before',
                dontBreakRows: true,
                widths: [172, 80, 65, 160, '*', 35],
                body: [
                    [
                        {
                            text: (vinculos[0].cpfCnpj) ? (vinculos[0].nomeProprietario + ' - CPF: ' + formatCnpjCpf(vinculos[0].cpfCnpj)) : vinculos[0].nomeProprietario,
                            alignment: 'left',
                            colSpan: 6,
                            fontSize: 10,
                            bold: true
                        },
                        {},
                        {},
                        {},
                        {},
                        {}
                    ],
                    [
                        { text: 'Chave', fontSize: 10, bold: true },
                        { text: 'Tipo', fontSize: 10, bold: true },
                        { text: 'CPF/CNPJ', fontSize: 10, bold: true },
                        { text: 'Nome', fontSize: 10, bold: true },
                        { text: 'Banco', fontSize: 10, bold: true },
                        { text: 'Status', fontSize: 10, bold: true }
                    ],
                    ...rows
                ]
            },
            layout: 'lightHorizontalLines',
        })
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
                                    { text: 'RELAÇÃO DE CHAVES PIX - RESUMIDA', alignment: 'center', fontSize: 10, bold: true },
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

    pdfMake.createPdf(doc).download('Relatório Resumido PIX')

};