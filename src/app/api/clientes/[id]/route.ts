import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const clienteId = Number(id);
  const body = await req.json();
  const razaoSocial = String(body.razaoSocial ?? "").trim();
  if (!razaoSocial) {
    return NextResponse.json(
      { error: "Razão social é obrigatória." },
      { status: 400 },
    );
  }
  const cliente = await prisma.cliente.update({
    where: { id: clienteId },
    data: {
      razaoSocial,
      cnpj: String(body.cnpj ?? ""),
      email: String(body.email ?? ""),
      telefone: String(body.telefone ?? ""),
      endereco: String(body.endereco ?? ""),
      cidade: String(body.cidade ?? ""),
      uf: String(body.uf ?? ""),
      cep: String(body.cep ?? ""),
      observacao: String(body.observacao ?? ""),
    },
  });
  return NextResponse.json(cliente);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const clienteId = Number(id);

  const emUso = await prisma.orcamento.count({ where: { clienteId } });
  if (emUso > 0) {
    return NextResponse.json(
      {
        error: `Não é possível excluir: este cliente está em ${emUso} orçamento(s).`,
      },
      { status: 409 },
    );
  }

  await prisma.cliente.delete({ where: { id: clienteId } });
  return NextResponse.json({ ok: true });
}
