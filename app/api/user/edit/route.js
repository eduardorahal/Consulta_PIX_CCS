import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from 'bcrypt';

export async function POST(request) {
    try {
        const body = await request.json()

        const { id, nome, cpf, email, password, lotacao, matricula, admin } = body;

        let hashedPassword = await hash(password, 10)

        const updatedUser = await prisma.usuario.update({
            where: {
              id
            },
            data: {
                nome,
                cpf,
                email,
                password: hashedPassword,
                lotacao,
                matricula,
                admin
            },
          })

        if (updatedUser) {
            return NextResponse.json({ status: 201, message: "Usuário Atualizado!" })
        }

    } catch (e) {
        console.log(e)
    }

}