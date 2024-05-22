import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from 'bcrypt';
import { verifyJwtToken } from "@/app/auth/validateToken";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    let token = (searchParams.get('token'));

    const validToken = await verifyJwtToken(token)

    if (validToken) {
        const usuarios = await prisma.usuario.findMany({
          orderBy: {
            nome: 'asc',
          },
        });
        return NextResponse.json(usuarios)
      } else {
        return NextResponse.json({})
      }

}