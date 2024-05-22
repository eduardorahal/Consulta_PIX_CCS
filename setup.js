// setup.js

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  try {
    // Instalação das dependências do aplicativo
    console.log('Instalando as dependências do aplicativo...');
    execSync('npm install');

    // Criação do banco de dados
    console.log('Criando o banco de dados...');
    execSync('npx prisma db create');

    // Execução das migrações
    console.log('Executando as migrações...');
    execSync('npx prisma migrate dev --name init');

    // Verificação e criação do usuário admin padrão
    console.log('Verificando o usuário admin padrão...');
    const existingAdmin = await prisma.usuario.findFirst({ where: { admin: true } });
    if (!existingAdmin) {
      console.log('Criando o usuário admin padrão...');
      await prisma.usuario.create({
        data: {
          nome: 'Admin',
          cpf: '12345678900', // Substitua pelo CPF desejado
          email: 'admin@example.com', // Substitua pelo e-mail desejado
          senha: 'senha_segura', // Substitua pela senha desejada (de preferência, armazene de forma segura)
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