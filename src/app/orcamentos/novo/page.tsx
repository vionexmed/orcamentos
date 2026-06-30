import { prisma } from "@/lib/db";
import { getEmpresas } from "@/lib/empresa";
import OrcamentoForm from "@/components/OrcamentoForm";

export const dynamic = "force-dynamic";

export default async function NovoOrcamentoPage() {
  const [clientes, produtos, empresas] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { razaoSocial: "asc" } }),
    prisma.produto.findMany({ orderBy: { descricao: "asc" } }),
    getEmpresas(),
  ]);

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
    />
  );
}
