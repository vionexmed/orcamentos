"use client";

import { useState } from "react";
import PageHeader from "./PageHeader";
import { formatMoeda, formatNumero } from "@/lib/format";
import { IconPlus, IconSearch, IconEdit, IconTrash, IconProdutos, IconClose } from "./icons";

export type Produto = {
  id: number;
  codigo: string;
  descricao: string;
  regAnvisa: string;
  marca: string;
  unidade: string;
  precoUnitario: number;
  ativo: boolean;
};

type FormState = {
  codigo: string;
  descricao: string;
  regAnvisa: string;
  marca: string;
  unidade: string;
  precoUnitario: string;
  ativo: boolean;
};

const vazio: FormState = {
  codigo: "",
  descricao: "",
  regAnvisa: "",
  marca: "",
  unidade: "UN",
  precoUnitario: "",
  ativo: true,
};

export default function ProdutosManager({ inicial }: { inicial: Produto[] }) {
  const [lista, setLista] = useState<Produto[]>(inicial);
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState<FormState>(vazio);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function reload() {
    const res = await fetch("/api/produtos");
    if (res.ok) setLista(await res.json());
  }

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setErro("");
    setAberto(true);
  }

  function abrirEdicao(p: Produto) {
    setEditando(p);
    setForm({
      codigo: p.codigo,
      descricao: p.descricao,
      regAnvisa: p.regAnvisa,
      marca: p.marca,
      unidade: p.unidade,
      precoUnitario: formatNumero(p.precoUnitario),
      ativo: p.ativo,
    });
    setErro("");
    setAberto(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    const url = editando ? `/api/produtos/${editando.id}` : "/api/produtos";
    const method = editando ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSalvando(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErro(data.error ?? "Erro ao salvar.");
      return;
    }
    setAberto(false);
    await reload();
  }

  async function excluir(p: Produto) {
    if (!confirm(`Excluir o produto "${p.descricao}"?`)) return;
    const res = await fetch(`/api/produtos/${p.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Erro ao excluir.");
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (data.inativado) {
      alert("Produto está em orçamentos antigos; foi inativado em vez de excluído.");
    }
    await reload();
  }

  const filtrada = lista.filter((p) =>
    `${p.descricao} ${p.codigo} ${p.marca} ${p.regAnvisa}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Produtos" subtitle="Catálogo de produtos e equipamentos médicos">
        <button className="btn-primary" onClick={abrirNovo}>
          <IconPlus className="h-4 w-4" />
          Novo produto
        </button>
      </PageHeader>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="search"
            placeholder="Buscar por descrição, código, marca ou ANVISA..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtrada.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <IconProdutos className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              {busca ? "Nenhum produto encontrado." : "Nenhum produto cadastrado ainda."}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {busca ? "Tente outro termo." : "Monte seu catálogo de produtos e equipamentos."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="th">Código</th>
                  <th className="th">Descrição</th>
                  <th className="th">Reg. ANVISA</th>
                  <th className="th">Marca</th>
                  <th className="th text-right">Preço</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrada.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="td tabular-nums">{p.codigo || "—"}</td>
                    <td className="td font-medium text-slate-800">
                      {p.descricao}
                      {!p.ativo && (
                        <span className="badge ml-2 bg-slate-100 text-slate-500">
                          inativo
                        </span>
                      )}
                    </td>
                    <td className="td tabular-nums">{p.regAnvisa || "—"}</td>
                    <td className="td">{p.marca || "—"}</td>
                    <td className="td text-right font-semibold tabular-nums text-slate-800">
                      {formatMoeda(p.precoUnitario)}
                    </td>
                    <td className="td">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="btn-icon"
                          onClick={() => abrirEdicao(p)}
                          title="Editar"
                        >
                          <IconEdit className="h-[18px] w-[18px]" />
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => excluir(p)}
                          title="Excluir"
                        >
                          <IconTrash className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {aberto && (
        <Modal onClose={() => setAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-900">
                {editando ? "Editar produto" : "Novo produto"}
              </h2>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setAberto(false)}
                title="Fechar"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            {erro && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {erro}
              </p>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Código</label>
                <input
                  className="field"
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="label">Reg. ANVISA *</label>
                <input
                  className="field"
                  placeholder="Nº de registro ou 'Isento'"
                  value={form.regAnvisa}
                  onChange={(e) => setForm({ ...form, regAnvisa: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Descrição *</label>
              <input
                className="field"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Marca</label>
                <input
                  className="field"
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Unidade</label>
                <input
                  className="field"
                  value={form.unidade}
                  onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Preço unitário (R$)</label>
                <input
                  className="field text-right"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.precoUnitario}
                  onChange={(e) =>
                    setForm({ ...form, precoUnitario: e.target.value })
                  }
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              />
              Produto ativo (aparece na busca ao montar orçamentos)
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAberto(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
