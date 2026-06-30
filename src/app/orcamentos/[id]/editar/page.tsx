import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getEmpresas } from "@/lib/empresa";
import OrcamentoForm from "@/components/OrcamentoForm";

export const dynamic = "force-dynamic";

export default async function EditarOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [clientes, produtos, empresas, orcamento] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { razaoSocial: "asc" } }),
    prisma.produto.findMany({ orderBy: { descricao: "asc" } }),
    getEmpresas(),
    prisma.orcamento.findUnique({
      where: { id: Number(id) },
      include: { itens: { orderBy: { ordem: "asc" } } },
    }),
  ]);

  if (!orcamento) notFound();

  return (
    <OrcamentoForm
      clientes={clientes}
      produtos={produtos}
      empresas={empresas.map((e) => ({
        id: e.id,
        razaoSocial: e.razaoSocial,
        nomeFantasia: e.nomeFantasia,
        condicaoPagamentoPadrao: e.condicaoPagamentoPadrao,
        prazoEntregaPadrao: e.prazoEntregaPadrao,
        validadeDiasPadrao: e.validadeDiasPadrao,
      }))}
      inicial={{
        id: orcamento.id,
        clienteId: orcamento.clienteId,
        empresaId: orcamento.empresaId,
        data: orcamento.data.toISOString(),
        condicaoPagamento: orcamento.condicaoPagamento,
        prazoEntrega: orcamento.prazoEntrega,
        validadeProposta: orcamento.validadeProposta.toISOString(),
        observacoes: orcamento.observacoes,
        status: orcamento.status,
        template: orcamento.template,
        itens: orcamento.itens.map((it) => ({
          produtoId: it.produtoId,
          codigo: it.codigo,
          descricao: it.descricao,
          regAnvisa: it.regAnvisa,
          marca: it.marca,
          unidade: it.unidade,
          quantidade: it.quantidade,
          valorUnitario: it.valorUnitario,
        })),
      }}
    />
  );
}
