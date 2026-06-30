"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import { formatData, formatMoeda, formatNumeroOrcamento } from "@/lib/format";
import { calcularTotais, STATUS_LABEL } from "@/lib/orcamento";

export type OrcamentoLinha = {
  id: number;
  numero: number;
  data: string;
  status: string;
  cliente: { razaoSocial: string };
  itens: { quantidade: number; valorUnitario: number }[];
};

const statusCor: Record<string, string> = {
  ABERTO: "bg-slate-100 text-slate-600",
  ENVIADO: "bg-brand-600 text-white",
  APROVADO: "bg-emerald-100 text-emerald-700",
  RECUSADO: "bg-red-100 text-red-700",
};

export default function OrcamentosList({ inicial }: { inicial: OrcamentoLinha[] }) {
  const router = useRouter();
  const [lista, setLista] = useState(inicial);
  const [busca, setBusca] = useState("");

  async function excluir(o: OrcamentoLinha) {
    if (!confirm(`Excluir o orçamento Nº ${o.numero}?`)) return;
    const res = await fetch(`/api/orcamentos/${o.id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Erro ao excluir o orçamento.");
      return;
    }
    setLista((prev) => prev.filter((x) => x.id !== o.id));
    router.refresh();
  }

  const filtrada = lista.filter((o) =>
    `${o.numero} ${o.cliente.razaoSocial}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        subtitle="Histórico de propostas emitidas"
      >
        <Link href="/orcamentos/novo" className="btn-primary">
          + Novo orçamento
        </Link>
      </PageHeader>

      <div className="mb-4">
        <input
          className="field max-w-sm"
          placeholder="Buscar por número ou cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        {filtrada.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              Nenhum orçamento por aqui ainda.
            </p>
            <Link href="/orcamentos/novo" className="btn-primary mt-4">
              Criar o primeiro orçamento
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Nº</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrada.map((o) => {
                const { totalGeral } = calcularTotais(o.itens);
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {formatNumeroOrcamento(o.numero)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatData(o.data)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {o.cliente.razaoSocial}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${statusCor[o.status] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-800">
                      {formatMoeda(totalGeral)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/orcamentos/${o.id}/imprimir`}
                        className="text-brand-600 hover:underline"
                      >
                        Ver / PDF
                      </Link>
                      <Link
                        href={`/orcamentos/${o.id}/editar`}
                        className="ml-3 text-slate-600 hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        className="ml-3 text-red-600 hover:underline"
                        onClick={() => excluir(o)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
