import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validarOrcamento } from "@/lib/orcamento-payload";

export async function GET() {
  const orcamentos = await prisma.orcamento.findMany({
    orderBy: { numero: "desc" },
    include: { cliente: true, itens: true },
  });
  return NextResponse.json(orcamentos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validacao = validarOrcamento(body);
  if (!validacao.ok) {
    return NextResponse.json({ error: validacao.erro }, { status: 400 });
  }
  const dados = validacao.dados;

  const orcamento = await prisma.$transaction(async (tx) => {
    // Numeração sequencial automática (próximo após o maior número atual).
    const ultimo = await tx.orcamento.findFirst({
      orderBy: { numero: "desc" },
      select: { numero: true },
    });
    const numero = (ultimo?.numero ?? 0) + 1;

    return tx.orcamento.create({
      data: {
        numero,
        clienteId: dados.clienteId,
        empresaId: dados.empresaId,
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

  return NextResponse.json(orcamento, { status: 201 });
}
