import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  let response = [];
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");
  try {
    await prisma.requisicaoRelacionamentoCCS.update({
      where: {
        id: parseInt(id),
      },
      data: {
        detalhamento: true
      },
    }).then(
      response.push({msg: 'Detalhamento Consluído', status: 'sucesso' })
    )
  } catch (e) {
    throw e;
  }
  return NextResponse.json(response);
}