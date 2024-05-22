import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from 'bcrypt';

export async function POST(request) {
    try {
        const body = await request.json()

        const { nome, cpf, email, password, unidade, matricula, admin } = body;

        let hashedPassword = await hash(password, 10)

        const alreadyExistsUser = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { email: email },
                    { cpf: cpf },
                    { matricula: matricula }
                ]
            }
        });

        if (alreadyExistsUser) {
            return NextResponse.json({ status: 409, message: "Usuário Já Cadastrado" })
        }

        const savedUser = await prisma.usuario.create({
            data: {
                nome,
                cpf,
                email,
                password: hashedPassword,
                unidade,
                matricula,
                admin
            }
        })

        if (savedUser) {
            return NextResponse.json({ status: 201, message: "Obrigado pelo cadastro!" })
        }

    } catch (e) {
        console.log(e)
    }

}