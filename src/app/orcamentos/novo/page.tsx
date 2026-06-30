import { prisma } from "@/lib/db";
import { getEmpresa } from "@/lib/empresa";
import OrcamentoForm from "@/components/OrcamentoForm";

export const dynamic = "force-dynamic";

export default async function NovoOrcamentoPage() {
  const [clientes, produtos, empresa] = await Promise.all([
    prisma.cliente.findMany({ orderBy: { razaoSocial: "asc" } }),
    prisma.produto.findMany({ orderBy: { descricao: "asc" } }),
    getEmpresa(),
  ]);

  return (
    <OrcamentoForm
      clientes={clientes}
      produtos={produtos}
      defaults={{
        condicaoPagamentoPadrao: empresa.condicaoPagamentoPadrao,
        prazoEntregaPadrao: empresa.prazoEntregaPadrao,
        validadeDiasPadrao: empresa.validadeDiasPadrao,
      }}
    />
  );
}
