'use client'

export default async function ExportaTXT(requisicoes) {


    var dados = [];

    for await (let requisicao of requisicoes) {
        let relacionamentos = requisicao.relacionamentosCCS;
        for await (let relacionamento of relacionamentos) {
            let bdvs = relacionamento.bemDireitoValorCCS;
            for await (let bdv of bdvs) {
                let vinculos = bdv.vinculados;
                if(vinculos.length > 0) {
                    console.log(vinculos)
                }
            }
        }
    }


    // var file = window.document.createElement("a");
    // file.href = window.URL.createObjectURL(
    //     new Blob([JSON.stringify(requisicoes)]),
    //     { type: "text/plain;charset=utf-8" }
    // );
    // file.download = "requisicoesCCS.txt";
    // document.body.appendChild(file);
    // file.click();
    // document.body.removeChild(file);

}
// 1 CASO TEXTO 30 Número do Caso, no formato NNN-SIGLA-NNNNNN-DV, onde NNN-SIGLA é a identificação do órgão solicitante, NNNNNN (6 números) é o número do caso e DV (2 números) é o dígito verificador do número do caso.
// 2 NUM-REQ TEXTO 17 Número da requisição no CCS
// 3 DT-REQ DATA 8 Data da requisição no formato DDMMAAAA
// 4 CPF/CNPJ NÚMERO 14 CPF/CNPJ consultado sem caracteres separadores.
// 5 NOME(SRF) TEXTO 80 Nome da pessoa física ou jurídica no cadastro da Receita Federal
// 6 NOME-IF-RESP TEXTO 80 Nome da IF responsável pelo envio das informações
// 7 DT-INI-REL DATA 8 Data do início do relacionamento do CPF/CNPJ consultado com a IF que está enviando as informações no formato DDMMAAAA
// 8 DT-FIM-REL DATA 8 Data do fim do relacionamento do CPF/CNPJ consultado com a IF que está enviando as informações. Deve ser informada no formato DDMMAAAA
// 9 NOME-IF TEXTO 80 Nome da IF que possui o B/D/V (Bem, Direito ou Valor)
// 10 NUM-IF NÚMERO 3 Número da IF responsável pelo envio das informações
// 11 TIPO-BDV NÚMERO 1 Tipo do B/D/V (1-Conta Corrente; 2- Conta de Poupança; 3- Conta de Investimento; 4-Outras Aplicações Financeiras; 5- Conta de não-residente – CC5; 6-Conta de Pagamento)
// 12 AGÊNCIA NÚMERO 4 Número da agência do B/D/V sem dígito verificador
// 13 CTA TEXTO 20 Número da conta do B/D/V com dígito verificador. Não usar separadores, tais como ponto, barra, traço ou outro caractere de formatação
// 14 NOME(SRF) BDV TEXTO 80 Nome da pessoa do B/D/V obtido no cadastro da Receita Federal
// 15 TP-VINC-1 NÚMERO 1 Tipo do vínculo (1- Titular; 2- Co-Titular; 3- Outros (procurador, responsável ou representante))
// 16 DT-INI DATA 8 Data de início do vínculo no formato DDMMAAAA
// 17 DT-FIM DATA 8 Data de fim do vínculo no formato DDMMAAAA
// 18 CPF/CNPJ VINC TEXTO 14 Pessoa vinculada ao CPF/CNPJ que está sendo consultado sem caracteres separadores
// 19 NOME-VINC TEXTO 80 Nome da pessoa vinculada
// 20 TP-VINC-2 TEXTO 1 Tipo do vínculo (1- Titular; 2- Co-Titular; 3- Outros (procurador, responsável ou representante))
// 21 DT-INI VINC DATA 8 Data de início do vínculo no formato DDMMAAAA
// 22 DT-FIM VINC DATA 8 Data de encerramento do vínculo no formato DDMMAAAA
// 23 SITUACAO-INFORMACAO NÚMERO 2 Situação da informação do cliente (00 – Completo, 01 – Liminar, 02 - Relacionamento Inexistente, 99 - Em mora)
// 24 CNPJ-IF TEXTO 14 CNPJ da IF responsável pelo envio das informações