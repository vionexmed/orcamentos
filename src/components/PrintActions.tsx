"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrintActions({ orcamentoId }: { orcamentoId: number }) {
  const router = useRouter();
  return (
    <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
      <button className="btn-secondary" onClick={() => router.push("/")}>
        ← Voltar
      </button>
      <div className="flex items-center gap-2">
        <Link href={`/orcamentos/${orcamentoId}/editar`} className="btn-secondary">
          Editar
        </Link>
        <button className="btn-primary" onClick={() => window.print()}>
          🖨 Baixar PDF / Imprimir
        </button>
      </div>
    </div>
  );
}
