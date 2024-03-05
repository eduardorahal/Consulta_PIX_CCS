import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let cpfResponsavel = searchParams.get("cpfCnpj");
  const requisicoesCCS = await prisma.requisicaoRelacionamentoCCS.findMany({
              where: {
                cpfResponsavel: cpfResponsavel,
              },
              orderBy: {
                id: 'desc',
              },
            });
  return NextResponse.json(requisicoesCCS)
}
