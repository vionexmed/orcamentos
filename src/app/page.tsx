import { prisma } from "@/lib/db";
import OrcamentosList from "@/components/OrcamentosList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const orcamentos = await prisma.orcamento.findMany({
    orderBy: { numero: "desc" },
    include: {
      cliente: { select: { razaoSocial: true } },
      itens: { select: { quantidade: true, valorUnitario: true } },
    },
  });

  const linhas = orcamentos.map((o) => ({
    id: o.id,
    numero: o.numero,
    data: o.data.toISOString(),
    status: o.status,
    cliente: { razaoSocial: o.cliente.razaoSocial },
    itens: o.itens,
  }));

  return <OrcamentosList inicial={linhas} />;
}
