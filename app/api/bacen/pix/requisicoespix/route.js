import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateToken } from "@/app/auth/tokenValidation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let cpfResponsavel = searchParams.get("cpfCnpj");
  let token = (searchParams.get('token')).replaceAll(" ", "+");
  
  const validToken = await validateToken(token, cpfResponsavel)
  if (validToken) {
    const requisicoesPIX = await prisma.requisicaoPix.findMany({
      where: {
        cpfResponsavel: cpfResponsavel,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return NextResponse.json(requisicoesPIX)
  } else {
    return NextResponse.json({})
  }
}
