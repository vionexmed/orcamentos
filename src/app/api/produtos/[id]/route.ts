import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseValorBR } from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const produtoId = Number(id);
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
  const produto = await prisma.produto.update({
    where: { id: produtoId },
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
  return NextResponse.json(produto);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const produtoId = Number(id);

  const emUso = await prisma.orcamentoItem.count({ where: { produtoId } });
  if (emUso > 0) {
    // Não apaga: mantém o histórico. Apenas inativa para sumir das buscas.
    await prisma.produto.update({
      where: { id: produtoId },
      data: { ativo: false },
    });
    return NextResponse.json({ ok: true, inativado: true });
  }

  await prisma.produto.delete({ where: { id: produtoId } });
  return NextResponse.json({ ok: true });
}
