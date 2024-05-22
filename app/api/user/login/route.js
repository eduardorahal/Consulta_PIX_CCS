import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';
import { SignJWT, base64url } from "jose";

export async function POST(request) {
    try {
        const body = await request.json()

        const { email, password } = body;

        // Buscar EMAIL no Banco de Dados e armazenar
        const registeredUser = await prisma.usuario.findUnique({
            where: {
                email: email,
            }
        });

        if (!registeredUser) {
            return NextResponse.json({ status: 409, message: "Email ou Senha inválidos." })
        }

        // Validar a SENHA do Usuário
        if (!bcrypt.compareSync(password, registeredUser.password)) {
            return NextResponse.json({ status: 409, message: "Email ou Senha inválidos." })
        }

        // Geração do TOKEN
        const payload = {
            id: registeredUser.id,
            cpf: registeredUser.cpf,
            name: registeredUser.name,
            email: registeredUser.email,
            unidade: registeredUser.unidade,
            matricula: registeredUser.matricula,
            admin: registeredUser.admin,
        }

        const secret = base64url.decode('zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI')
        const key = new TextEncoder().encode(secret);
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(key);

        // Envia confirmação e Token para Usuário

        return NextResponse.json({ status: 201, message: "Bem-vindo!", token: token, payload })

    } catch (e) {
        console.log(e)
    }
}