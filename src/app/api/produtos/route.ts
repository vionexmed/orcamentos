import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseValorBR } from "@/lib/format";

export async function GET() {
  const produtos = await prisma.produto.findMany({
    orderBy: { descricao: "asc" },
  });
  return NextResponse.json(produtos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const descricao = String(body.descricao ?? "").trim();
  if (!descricao) {
    return NextResponse.json(
      { error: "Descrição do produto é obrigatória." },
      { status: 400 },
    );
  }
  const regAnvisa = String(body.regAnvisa ?? "").trim();
  if (!regAnvisa) {
    return NextResponse.json(
      { error: "Registro ANVISA é obrigatório (use 'Isento' se não houver)." },
      { status: 400 },
    );
  }
  const produto = await prisma.produto.create({
    data: {
      codigo: String(body.codigo ?? ""),
      descricao,
      regAnvisa,
      marca: String(body.marca ?? ""),
      unidade: String(body.unidade ?? "UN") || "UN",
      precoUnitario: parseValorBR(body.precoUnitario),
      ativo: body.ativo === undefined ? true : Boolean(body.ativo),
    },
  });
  return NextResponse.json(produto, { status: 201 });
}
