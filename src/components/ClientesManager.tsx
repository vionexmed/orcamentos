"use client";

import { useState } from "react";
import PageHeader from "./PageHeader";
import { buscarCep } from "@/lib/cep";

export type Cliente = {
  id: number;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  observacao: string;
};

const vazio: Omit<Cliente, "id"> = {
  razaoSocial: "",
  cnpj: "",
  email: "",
  telefone: "",
  endereco: "",
  cidade: "",
  uf: "",
  cep: "",
  observacao: "",
};

export default function ClientesManager({ inicial }: { inicial: Cliente[] }) {
  const [lista, setLista] = useState<Cliente[]>(inicial);
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState<Omit<Cliente, "id">>(vazio);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);

  async function preencherPorCep() {
    setBuscandoCep(true);
    const r = await buscarCep(form.cep);
    setBuscandoCep(false);
    if (r) {
      setForm((f) => ({
        ...f,
        endereco: [r.endereco, r.bairro].filter(Boolean).join(" - ") || f.endereco,
        cidade: r.cidade || f.cidade,
        uf: r.uf || f.uf,
      }));
    }
  }

  async function reload() {
    const res = await fetch("/api/clientes");
    if (res.ok) setLista(await res.json());
  }

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setErro("");
    setAberto(true);
  }

  function abrirEdicao(c: Cliente) {
    setEditando(c);
    const { id: _id, ...resto } = c;
    setForm(resto);
    setErro("");
    setAberto(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    const url = editando ? `/api/clientes/${editando.id}` : "/api/clientes";
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

  async function excluir(c: Cliente) {
    if (!confirm(`Excluir o cliente "${c.razaoSocial}"?`)) return;
    const res = await fetch(`/api/clientes/${c.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Erro ao excluir.");
      return;
    }
    await reload();
  }

  const filtrada = lista.filter((c) =>
    `${c.razaoSocial} ${c.cnpj} ${c.cidade}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Clientes" subtitle="Empresas para quem você emite orçamentos">
        <button className="btn-primary" onClick={abrirNovo}>
          + Novo cliente
        </button>
      </PageHeader>

      <div className="mb-4">
        <input
          className="field max-w-sm"
          placeholder="Buscar por nome, CNPJ ou cidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        {filtrada.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Razão social</th>
                <th className="px-4 py-3">CNPJ</th>
                <th className="px-4 py-3">Cidade/UF</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrada.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {c.razaoSocial}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.cnpj || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {[c.cidade, c.uf].filter(Boolean).join("/") || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.email || c.telefone || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-brand-600 hover:underline"
                      onClick={() => abrirEdicao(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="ml-4 text-red-600 hover:underline"
                      onClick={() => excluir(c)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {aberto && (
        <Modal onClose={() => setAberto(false)}>
          <form onSubmit={salvar} className="space-y-4">
            <h2 className="text-lg font-semibold">
              {editando ? "Editar cliente" : "Novo cliente"}
            </h2>
            {erro && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {erro}
              </p>
            )}
            <div>
              <label className="label">Razão social *</label>
              <input
                className="field"
                value={form.razaoSocial}
                onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">CNPJ</label>
                <input
                  className="field"
                  value={form.cnpj}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input
                  className="field"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">E-mail</label>
              <input
                className="field"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">
                CEP
                {buscandoCep && (
                  <span className="ml-1 font-normal text-slate-400">— buscando endereço…</span>
                )}
              </label>
              <input
                className="field"
                placeholder="00000-000"
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
                onBlur={preencherPorCep}
              />
            </div>
            <div>
              <label className="label">Endereço</label>
              <input
                className="field"
                value={form.endereco}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="label">Cidade</label>
                <input
                  className="field"
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                />
              </div>
              <div>
                <label className="label">UF</label>
                <input
                  className="field"
                  maxLength={2}
                  value={form.uf}
                  onChange={(e) =>
                    setForm({ ...form, uf: e.target.value.toUpperCase() })
                  }
                />
              </div>
            </div>
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
