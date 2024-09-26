const { execSync } = require('child_process');
const readline = require('readline');
const { hash } = require('bcrypt');

async function generatePrismaClient() {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
}

async function setupDatabase() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    console.log('Verificando o usuário admin padrão...');
    const existingAdmin = await prisma.usuario.findFirst({ where: { admin: true } });
    if (!existingAdmin) {
      console.log('Criando o usuário admin padrão...');

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Digite a senha para o usuário admin: ', async (password) => {
        let hashedPassword = await hash(password, 10); // Hash the password
        await prisma.usuario.create({
          data: {
            nome: 'Admin',
            cpf: '12345678900',
            email: 'admin@admin.com',
            password: hashedPassword,
            admin: true
          }
        });
        console.log('Usuário admin padrão criado com sucesso.');
        rl.close();
        await prisma.$disconnect();
      });
    } else {
      console.log('O usuário admin padrão já existe.');
      await prisma.$disconnect();
    }

    console.log('Configuração concluída com sucesso.');
  } catch (error) {
    console.error('Erro durante a configuração:', error);
    await prisma.$disconnect();
  }
}

async function main() {
  try {
    console.log('Instalando as dependências do aplicativo...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('Criando o banco de dados...');
    await generatePrismaClient();

    console.log('Executando as migrações...');
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

    await setupDatabase();

  } catch (error) {
    console.error('Erro durante a configuração:', error);
  }
}

main();