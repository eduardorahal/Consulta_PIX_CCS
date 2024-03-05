import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let cpfResponsavel = searchParams.get("cpfCnpj");
  const requisicoesPIX = await prisma.requisicaoPix.findMany({
              where: {
                cpfResponsavel: cpfResponsavel,
              },
              orderBy: {
                id: 'desc',
              },
            });
  return NextResponse.json(requisicoesPIX)
}
