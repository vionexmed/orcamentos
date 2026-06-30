"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import { formatData, formatMoeda, formatNumeroOrcamento } from "@/lib/format";
import { calcularTotais, STATUS_LABEL } from "@/lib/orcamento";
import {
  IconPlus,
  IconSearch,
  IconPrint,
  IconEdit,
  IconTrash,
  IconOrcamentos,
} from "./icons";

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
  ENVIADO: "bg-brand-100 text-brand-700",
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
          <IconPlus className="h-4 w-4" />
          Novo orçamento
        </Link>
      </PageHeader>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="search"
            placeholder="Buscar por número ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtrada.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <IconOrcamentos className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              {busca ? "Nenhum orçamento encontrado." : "Nenhum orçamento por aqui ainda."}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {busca
                ? "Tente outro termo de busca."
                : "Crie o primeiro para começar o histórico."}
            </p>
            {!busca && (
              <Link href="/orcamentos/novo" className="btn-primary mt-5">
                <IconPlus className="h-4 w-4" />
                Criar o primeiro orçamento
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="th">Nº</th>
                  <th className="th">Data</th>
                  <th className="th">Cliente</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Total</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrada.map((o) => {
                  const { totalGeral } = calcularTotais(o.itens);
                  return (
                    <tr key={o.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="td font-semibold tabular-nums text-brand-800">
                        {formatNumeroOrcamento(o.numero)}
                      </td>
                      <td className="td tabular-nums">{formatData(o.data)}</td>
                      <td className="td font-medium text-slate-800">
                        {o.cliente.razaoSocial}
                      </td>
                      <td className="td">
                        <span
                          className={`badge ${statusCor[o.status] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </td>
                      <td className="td text-right font-semibold tabular-nums text-slate-800">
                        {formatMoeda(totalGeral)}
                      </td>
                      <td className="td">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/orcamentos/${o.id}/imprimir`}
                            className="btn-icon"
                            title="Ver / PDF"
                          >
                            <IconPrint className="h-[18px] w-[18px]" />
                          </Link>
                          <Link
                            href={`/orcamentos/${o.id}/editar`}
                            className="btn-icon"
                            title="Editar"
                          >
                            <IconEdit className="h-[18px] w-[18px]" />
                          </Link>
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => excluir(o)}
                            title="Excluir"
                          >
                            <IconTrash className="h-[18px] w-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
