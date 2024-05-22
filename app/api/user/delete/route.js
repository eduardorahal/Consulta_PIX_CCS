import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json()

        const { id } = body;

        const deletedUser = await prisma.usuario.delete({
            where: {
              id
            }
          })

        if (deletedUser) {
            return NextResponse.json({ status: 201, message: "Usuário Deletado!" })
        }

    } catch (e) {
        console.log(e)
    }

}