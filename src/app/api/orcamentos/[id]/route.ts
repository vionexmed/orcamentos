import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validarOrcamento } from "@/lib/orcamento-payload";
import { isEstiloValido } from "@/lib/estilos";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id: Number(id) },
    include: { cliente: true, itens: { orderBy: { ordem: "asc" } } },
  });
  if (!orcamento) {
    return NextResponse.json({ error: "Orçamento não encontrado." }, { status: 404 });
  }
  return NextResponse.json(orcamento);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const orcamentoId = Number(id);
  const body = await req.json();
  const validacao = validarOrcamento(body);
  if (!validacao.ok) {
    return NextResponse.json({ error: validacao.erro }, { status: 400 });
  }
  const dados = validacao.dados;

  const orcamento = await prisma.$transaction(async (tx) => {
    // Substitui os itens (apaga e recria) para refletir a edição.
    await tx.orcamentoItem.deleteMany({ where: { orcamentoId } });

    return tx.orcamento.update({
      where: { id: orcamentoId },
      data: {
        clienteId: dados.clienteId,
        ...(dados.data ? { data: dados.data } : {}),
        condicaoPagamento: dados.condicaoPagamento,
        prazoEntrega: dados.prazoEntrega,
        validadeProposta: dados.validadeProposta,
        observacoes: dados.observacoes,
        status: dados.status,
        template: dados.template,
        itens: {
          create: dados.itens.map((it) => ({
            produtoId: it.produtoId,
            codigo: it.codigo,
            descricao: it.descricao,
            regAnvisa: it.regAnvisa,
            marca: it.marca,
            unidade: it.unidade,
            quantidade: it.quantidade,
            valorUnitario: it.valorUnitario,
            ordem: it.ordem,
          })),
        },
      },
      include: { itens: true, cliente: true },
    });
  });

  return NextResponse.json(orcamento);
}

/** Atualização parcial — usado para trocar o estilo (template) ou o status. */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const data: { template?: string; status?: string } = {};

  if (body.template !== undefined) {
    if (!isEstiloValido(body.template)) {
      return NextResponse.json({ error: "Estilo inválido." }, { status: 400 });
    }
    data.template = body.template;
  }
  if (body.status !== undefined) {
    data.status = String(body.status);
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
  }

  const orcamento = await prisma.orcamento.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(orcamento);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.orcamento.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
