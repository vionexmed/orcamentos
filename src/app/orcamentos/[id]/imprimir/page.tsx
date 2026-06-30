import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getEmpresaPadrao } from "@/lib/empresa";
import PrintActions from "@/components/PrintActions";
import DocumentoOrcamento from "@/components/DocumentoOrcamento";
import EstiloSwitcher from "@/components/EstiloSwitcher";
import { normalizarEstilo } from "@/lib/estilos";

export const dynamic = "force-dynamic";

export default async function ImprimirOrcamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id: Number(id) },
    include: {
      cliente: true,
      empresa: true,
      itens: { orderBy: { ordem: "asc" } },
    },
  });

  if (!orcamento) notFound();

  // Empresa do documento: a escolhida no orçamento; se não houver (orçamentos
  // antigos), usa a empresa padrão como fallback.
  const empresa = orcamento.empresa ?? (await getEmpresaPadrao());

  return (
    <div className="mx-auto max-w-[820px]">
      <PrintActions orcamentoId={orcamento.id} />
      <EstiloSwitcher orcamentoId={orcamento.id} atual={normalizarEstilo(orcamento.template)} />
      <DocumentoOrcamento orcamento={orcamento} empresa={empresa} />
    </div>
  );
}
