"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EstiloPicker from "./EstiloPicker";
import type { EstiloId } from "@/lib/estilos";

/** Permite trocar o estilo de um orçamento já finalizado, na visualização. */
export default function EstiloSwitcher({
  orcamentoId,
  atual,
}: {
  orcamentoId: number;
  atual: EstiloId;
}) {
  const router = useRouter();
  const [estilo, setEstilo] = useState<EstiloId>(atual);
  const [salvando, setSalvando] = useState(false);

  async function trocar(id: EstiloId) {
    if (id === estilo || salvando) return;
    const anterior = estilo;
    setEstilo(id);
    setSalvando(true);
    const res = await fetch(`/api/orcamentos/${orcamentoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: id }),
    });
    setSalvando(false);
    if (!res.ok) {
      setEstilo(anterior);
      alert("Não foi possível trocar o estilo.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="no-print mb-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          Estilo do documento
        </p>
        <span className="text-xs text-slate-400">
          {salvando ? "salvando…" : "clique para trocar"}
        </span>
      </div>
      <EstiloPicker value={estilo} onChange={trocar} disabled={salvando} />
    </div>
  );
}
