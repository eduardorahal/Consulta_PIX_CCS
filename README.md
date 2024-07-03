# Consulta PIX e CCS - LAB-LD da Polícia Civil de Santa Catarina

Consulta PIX e CCS desenvolvida no Laboratório de Tecnologia Contra Lavagem de Dinheiro da Polícia Civil de Santa Catarina.

- Desenvolvedor: Agente de Polícia Eduardo Rahal (eduardo-rahal@pc.sc.gov.br)
- Coordenador: Delegado de Polícia Rodrigo Schneider (rodrigo-schneider@pc.sc.gov.br)

O uso é restrito às Polícias Judiciárias e demais órgãos cadastradas junto ao Banco Central para efetuar tais consultas.
Este código não deve ser compartilhado para além deste público alvo.

INSTRUÇÕES PARA INSTALAÇÃO E EXECUÇÃO:

Aplicação desenvolvida utilizando NEXT JS 13 E REACT.

1. Fazer download e Instalar NodeJS e Git. (https://www.youtube.com/watch?v=FVuNVtaKvMk - a partir do minuto 3:00)
   
2. Preparar um servidor com PostgreSQL para armazenamento dos dados da aplicação. Pode ser local, no mesmo computador em que a aplicação irá rodar. (https://www.youtube.com/watch?v=UbX-2Xud1JA)
   
3. Fazer o 'clone' do repositório (https://www.youtube.com/watch?v=HZp1KUvJbnw)

4. Criar um arquivo '.env' na raiz do projeto, contendo as seguintes variáveis de ambiente:
    * Atenção: Estas variáveis precisam ser preenchidas com as informações de usuário e senha de cada local.
    * PostgreSQL, com usuário e senha criados na instalação do PostgreSQL
    * BACEN: Usuário e Senha fornecidos pelo BACEN
        
        <code>
        DATABASE_URL="postgresql://usuario:senha@localhost:5432/consultapixccs?schema=public"
        usernameBC="USUÁRIO FORNECIDO PELO BACEN. EX. eju**.s-apiccs"
        passwordBC="SENHA DE ACESSO"
        </code>
        
5. Rodar o arquivo 'setup.js' que está na raiz do projeto, para instalação das Dependências do Aplicativo, criação do Banco de Dados e Primeiro Usuário ADMIN. O arquivo pode ser editado conforme necessidade do órgão. Para tanto, basta ler os comentários do código. Apenas este usuário precisa ser criado por ali. Os demais poderão ser criados já dentro da interface gráfica da Aplicação. 

    COMANDO: 'node setup.js'

6. Para rodar a aplicação, 'npm run dev' ou equivalente

7. Necessário configurar Imagens e Cabeçalho dos relatórios, que utiliza ferramenta PDFMAKE
   
    IMAGENS:
        Em /public/base64 alterar a logo da PC para a logo do seu órgão. Atentar para as dimensões, para que permaneçam as mesmas, para não deformar a logo.
   
    CABEÇALHOS DOS RELATÓRIOS
        ARQUIVOS:
            * /app/pix/components/Relatorios/resumidoPIX.js - LINHA 95
            * /app/pix/components/Relatorios/detalhadoPIX.js - LINHA 134
            * /app/ccs/components/Relatorios/resumidoCCS.js - LINHA 145
            * /app/ccs/components/Relatorios/detalhadoCCS.js - LINHA 323
  
  Em todos, verificar as importações das Logos nas linhas 7 e 8. Se o nome do arquivo da Logo tiver sido alterado em /public/base64 , deve ser alterado aí também. Imagens são utilizadas em outras linhas destes arquivos, então em caso de alteração dos nomes, localizar e alterar.