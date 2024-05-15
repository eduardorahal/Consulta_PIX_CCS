import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";
import { prisma } from "@/lib/prisma";
import { validateToken } from "@/app/auth/tokenValidation";


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let cpfResponsavel = searchParams.get("cpfResponsavel");
  let token = (searchParams.get('token')).replaceAll(" ", "+");

  const validToken = await validateToken(token, cpfResponsavel)
  if (validToken) {

    // Busca as Requisições do Usuário cadastradas no Banco de Dados
    const requisicoesCCS = await prisma.requisicaoRelacionamentoCCS.findMany({
      where: {
        cpfResponsavel: cpfResponsavel,
      },
      include: {
        relacionamentosCCS: {
          include: {
            bemDireitoValorCCS: {
              include: {
                vinculados: true,
              },
              orderBy: {
                dataInicio: 'desc'
              }
            }
          },
          orderBy: {
            numeroBancoResponsavel: 'asc'
          }
        },
      },
      orderBy: {
        id: 'desc',
      }
    })

    return NextResponse.json(requisicoesCCS)
  } else {
    return NextResponse.json({})
  }
}
