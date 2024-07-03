// setup.js

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { hash } = require('bcrypt')

const prisma = new PrismaClient();

async function main() {
  try {
    // Instalação das dependências do aplicativo
    console.log('Instalando as dependências do aplicativo...');
    execSync('npm install');

    // Criação do banco de dados
    console.log('Criando o banco de dados...');
    execSync('npx prisma generate');

    // Execução das migrações
    console.log('Executando as migrações...');
    execSync('npx prisma migrate dev --name init');

    // Verificação e criação do usuário admin padrão
    console.log('Verificando o usuário admin padrão...');
    const existingAdmin = await prisma.usuario.findFirst({ where: { admin: true } });
    if (!existingAdmin) {
      console.log('Criando o usuário admin padrão...');
      let hashedPassword = await hash('admin', 10) // Substitua pela senha desejada (de preferência, armazene de forma segura)
      await prisma.usuario.create({
        data: {
          nome: 'Admin',
          cpf: '12345678900', // Substitua pelo CPF desejado
          email: 'admin@admin.com', // Substitua pelo e-mail desejado
          password: hashedPassword,
          admin: true
        }
      });
      console.log('Usuário admin padrão criado com sucesso.');
    } else {
      console.log('O usuário admin padrão já existe.');
    }

    console.log('Configuração concluída com sucesso.');
  } catch (error) {
    console.error('Erro durante a configuração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();