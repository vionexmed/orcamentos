"use client";

import { useState } from "react";
import { buscarCep } from "@/lib/cep";
import { estiloLogo, tamanhoPlaceholder } from "@/lib/logo";
import { IconTrash } from "./icons";

export type Empresa = {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  cep: string;
  cidade: string;
  uf: string;
  email: string;
  telefone: string;
  logoPath: string;
  logoAltura: number;
  condicaoPagamentoPadrao: string;
  prazoEntregaPadrao: string;
  validadeDiasPadrao: number;
};

export default function ConfiguracoesForm({
  inicial,
  onSaved,
  onRemoved,
  podeRemover,
}: {
  inicial: Empresa;
  onSaved: (empresa: Empresa) => void;
  onRemoved: (id: number) => void;
  podeRemover: boolean;
}) {
  const [form, setForm] = useState<Empresa>(inicial);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [enviandoLogo, setEnviandoLogo] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);

  const nova = form.id <= 0;

  function set<K extends keyof Empresa>(campo: K, valor: Empresa[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

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

  async function enviarLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnviandoLogo(true);
    setErro("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setEnviandoLogo(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErro(data.error ?? "Erro ao enviar a logo.");
      return;
    }
    const { url } = await res.json();
    set("logoPath", url);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");
    const url = nova ? "/api/empresa" : `/api/empresa/${form.id}`;
    const method = nova ? "POST" : "PUT";
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
    const salva: Empresa = await res.json();
    setForm(salva);
    onSaved(salva);
    setMensagem("Dados salvos com sucesso.");
  }

  async function remover() {
    if (nova) {
      onRemoved(form.id);
      return;
    }
    if (!confirm("Excluir esta empresa? Essa ação não pode ser desfeita.")) return;
    setRemovendo(true);
    setErro("");
    const res = await fetch(`/api/empresa/${form.id}`, { method: "DELETE" });
    setRemovendo(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErro(data.error ?? "Erro ao excluir.");
      return;
    }
    onRemoved(form.id);
  }

  return (
    <form onSubmit={salvar}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {form.razaoSocial || (nova ? "Nova empresa" : `Empresa ${form.id}`)}
          </h2>
          <p className="text-sm text-slate-500">
            Estes dados e a logo aparecem no documento do orçamento.
          </p>
        </div>
        <div className="flex gap-2">
          {(podeRemover || nova) && (
            <button
              type="button"
              className="btn-danger"
              onClick={remover}
              disabled={removendo}
            >
              <IconTrash className="h-4 w-4" />
              {removendo ? "Excluindo..." : nova ? "Descartar" : "Excluir"}
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={salvando}>
            {salvando ? "Salvando..." : nova ? "Criar empresa" : "Salvar"}
          </button>
        </div>
      </div>

      {erro && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}
      {mensagem && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {mensagem}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Dados da empresa
          </h2>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Razão social</label>
                <input
                  className="field"
                  value={form.razaoSocial}
                  onChange={(e) => set("razaoSocial", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Nome fantasia</label>
                <input
                  className="field"
                  value={form.nomeFantasia}
                  onChange={(e) => set("nomeFantasia", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">CNPJ</label>
                <input
                  className="field"
                  value={form.cnpj}
                  onChange={(e) => set("cnpj", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Inscrição estadual</label>
                <input
                  className="field"
                  value={form.inscricaoEstadual}
                  onChange={(e) => set("inscricaoEstadual", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Endereço</label>
              <input
                className="field"
                value={form.endereco}
                onChange={(e) => set("endereco", e.target.value)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="label">
                  CEP
                  {buscandoCep && (
                    <span className="ml-1 font-normal text-slate-400">— buscando…</span>
                  )}
                </label>
                <input
                  className="field"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={(e) => set("cep", e.target.value)}
                  onBlur={preencherPorCep}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Cidade</label>
                <input
                  className="field"
                  value={form.cidade}
                  onChange={(e) => set("cidade", e.target.value)}
                />
              </div>
              <div>
                <label className="label">UF</label>
                <input
                  className="field"
                  maxLength={2}
                  value={form.uf}
                  onChange={(e) => set("uf", e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">E-mail</label>
                <input
                  className="field"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input
                  className="field"
                  value={form.telefone}
                  onChange={(e) => set("telefone", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Logo
            </h2>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              {form.logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logoPath}
                  alt="Logo da empresa"
                  className="max-h-28 max-w-full object-contain"
                />
              ) : (
                <span className="text-sm text-slate-400">Sem logo</span>
              )}
            </div>
            <label className="btn-secondary mt-3 w-full cursor-pointer">
              {enviandoLogo ? "Enviando..." : "Escolher imagem"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={enviarLogo}
                disabled={enviandoLogo}
              />
            </label>
            {form.logoPath && (
              <button
                type="button"
                className="mt-2 w-full text-sm text-red-600 hover:underline"
                onClick={() => set("logoPath", "")}
              >
                Remover logo
              </button>
            )}
            <p className="mt-2 text-xs text-slate-400">PNG, JPG, WEBP ou SVG (máx. 2 MB).</p>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <label className="label flex items-center justify-between">
                <span>Tamanho da logo no documento</span>
                <span className="font-normal text-slate-400">{form.logoAltura}</span>
              </label>
              <p className="mb-1 text-[10px] text-slate-400">
                Aumenta a logo na largura, sem esticar a faixa do cabeçalho.
              </p>
              <input
                type="range"
                min={40}
                max={200}
                step={2}
                value={form.logoAltura}
                onChange={(e) => set("logoAltura", Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>menor</span>
                <span>maior</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Padrões do orçamento
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Condição de pagamento padrão</label>
                <input
                  className="field"
                  placeholder="Ex.: 027 - 10 x"
                  value={form.condicaoPagamentoPadrao}
                  onChange={(e) => set("condicaoPagamentoPadrao", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Prazo de entrega padrão</label>
                <input
                  className="field"
                  value={form.prazoEntregaPadrao}
                  onChange={(e) => set("prazoEntregaPadrao", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Validade da proposta (dias)</label>
                <input
                  className="field"
                  type="number"
                  min={1}
                  value={form.validadeDiasPadrao}
                  onChange={(e) =>
                    set("validadeDiasPadrao", Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Prévia ao vivo — nota fictícia com a logo no tamanho escolhido */}
      <section className="card mt-6 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Prévia do documento
        </h2>
        <p className="mb-4 mt-0.5 text-sm text-slate-500">
          Exemplo fictício de orçamento. Arraste o controle de tamanho da logo e
          veja aqui, em tempo real, como ficará no documento.
        </p>

        <div className="mx-auto max-w-[680px] overflow-hidden rounded-md border-2 border-slate-700 bg-white text-slate-900">
          {/* Cabeçalho: logo à esquerda + dados ao lado */}
          <div className="flex items-center gap-4 px-4 py-3">
            {form.logoPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoPath}
                alt="Logo"
                style={estiloLogo(form.logoAltura)}
                className="block h-auto shrink-0 object-contain object-left"
              />
            ) : (
              <div
                style={{
                  height: tamanhoPlaceholder(form.logoAltura),
                  width: tamanhoPlaceholder(form.logoAltura),
                }}
                className="grid shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-center text-[9px] leading-tight text-slate-400"
              >
                BRASÃO
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold uppercase leading-tight tracking-wide text-slate-900">
                {form.razaoSocial || "SUA EMPRESA LTDA"}
              </p>
              {form.nomeFantasia && (
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  {form.nomeFantasia}
                </p>
              )}
              <p className="mt-0.5 text-[9px] leading-snug text-slate-600">
                {[
                  form.endereco,
                  [form.cep, [form.cidade, form.uf].filter(Boolean).join("/")]
                    .filter(Boolean)
                    .join(" - "),
                ]
                  .filter(Boolean)
                  .join(" · ") || "Endereço · CEP - Cidade/UF"}
              </p>
              <p className="text-[9px] leading-snug text-slate-600">
                {[
                  form.cnpj && `CNPJ: ${form.cnpj}`,
                  form.inscricaoEstadual && `IE: ${form.inscricaoEstadual}`,
                ]
                  .filter(Boolean)
                  .join("  ·  ") || "CNPJ · IE"}
              </p>
            </div>
          </div>

          {/* Título */}
          <div className="border-y-2 border-slate-700 bg-white py-1.5 text-center text-[12px] font-bold uppercase tracking-[0.25em]">
            Proposta Comercial / Orçamento
          </div>

          {/* Identificação (exemplo) */}
          <div className="grid grid-cols-4 divide-x divide-slate-300 border-b border-slate-400">
            <div className="px-2 py-[3px]">
              <div className="text-[7.5px] uppercase tracking-wide text-slate-400">Orçamento Nº</div>
              <div className="text-base font-extrabold tracking-tight">0001</div>
            </div>
            <div className="px-2 py-[3px]">
              <div className="text-[7.5px] uppercase tracking-wide text-slate-400">Emissão</div>
              <div className="text-[11px]">10/03/2026</div>
            </div>
            <div className="px-2 py-[3px]">
              <div className="text-[7.5px] uppercase tracking-wide text-slate-400">Validade</div>
              <div className="text-[11px] font-semibold">09/04/2026</div>
            </div>
            <div className="px-2 py-[3px]">
              <div className="text-[7.5px] uppercase tracking-wide text-slate-400">Situação</div>
              <div className="text-[11px] font-semibold uppercase">Aberto</div>
            </div>
          </div>

          {/* Produtos (exemplo) */}
          <div className="border-b border-slate-400 bg-slate-100 px-2 py-[3px] text-[8px] font-bold uppercase tracking-[0.15em] text-slate-700">
            Dados dos Produtos / Equipamentos
          </div>
          <div className="flex items-center justify-between px-2 py-1 text-[10px]">
            <span>
              <span className="text-slate-500">01</span> · LIKAWAVE VARIO 3I
              <span className="text-slate-400"> · ANVISA 82155249003</span>
            </span>
            <span className="tabular-nums">R$ 148.000,00</span>
          </div>

          {/* Total */}
          <div className="flex justify-end border-t border-slate-400">
            <div className="bg-slate-800 px-3 py-1.5 text-white">
              <span className="text-[7.5px] uppercase tracking-wide text-slate-300">
                Total geral{" "}
              </span>
              <span className="text-[13px] font-extrabold tabular-nums">R$ 148.000,00</span>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
