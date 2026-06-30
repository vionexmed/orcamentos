"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconEdit, IconDownload } from "./icons";

export default function PrintActions({ orcamentoId }: { orcamentoId: number }) {
  const router = useRouter();
  return (
    <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
      <button className="btn-secondary" onClick={() => router.push("/")}>
        <IconArrowLeft className="h-4 w-4" />
        Voltar
      </button>
      <div className="flex items-center gap-2">
        <Link href={`/orcamentos/${orcamentoId}/editar`} className="btn-secondary">
          <IconEdit className="h-4 w-4" />
          Editar
        </Link>
        <button className="btn-primary" onClick={() => window.print()}>
          <IconDownload className="h-4 w-4" />
          Baixar PDF / Imprimir
        </button>
      </div>
    </div>
  );
}
