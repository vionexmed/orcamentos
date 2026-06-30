import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getEmpresa } from "@/lib/empresa";
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
  const [orcamento, empresa] = await Promise.all([
    prisma.orcamento.findUnique({
      where: { id: Number(id) },
      include: { cliente: true, itens: { orderBy: { ordem: "asc" } } },
    }),
    getEmpresa(),
  ]);

  if (!orcamento) notFound();

  return (
    <div className="mx-auto max-w-[820px]">
      <PrintActions orcamentoId={orcamento.id} />
      <EstiloSwitcher orcamentoId={orcamento.id} atual={normalizarEstilo(orcamento.template)} />
      <DocumentoOrcamento orcamento={orcamento} empresa={empresa} />
    </div>
  );
}
