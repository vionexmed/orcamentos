import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getEmpresa } from "@/lib/empresa";
import OrcamentoForm from "@/components/OrcamentoForm";

export const dynamic = "force-dynamic";

export default async function EditarOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [clientes, produtos, empresa, orcamento] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { razaoSocial: "asc" } }),
    prisma.produto.findMany({ orderBy: { descricao: "asc" } }),
    getEmpresa(),
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
      defaults={{
        condicaoPagamentoPadrao: empresa.condicaoPagamentoPadrao,
        prazoEntregaPadrao: empresa.prazoEntregaPadrao,
        validadeDiasPadrao: empresa.validadeDiasPadrao,
      }}
      inicial={{
        id: orcamento.id,
        clienteId: orcamento.clienteId,
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
