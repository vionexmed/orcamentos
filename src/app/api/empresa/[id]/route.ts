import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dadosEmpresa } from "@/lib/empresa-payload";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const empresa = await prisma.empresa.update({
    where: { id: Number(id) },
    data: dadosEmpresa(body),
  });
  return NextResponse.json(empresa);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const empresaId = Number(id);

  // Não permite remover se houver orçamentos vinculados (preserva o histórico).
  const vinculados = await prisma.orcamento.count({ where: { empresaId } });
  if (vinculados > 0) {
    return NextResponse.json(
      {
        error: `Não é possível excluir: há ${vinculados} orçamento(s) usando esta empresa.`,
      },
      { status: 409 },
    );
  }

  await prisma.empresa.delete({ where: { id: empresaId } });
  return NextResponse.json({ ok: true });
}
