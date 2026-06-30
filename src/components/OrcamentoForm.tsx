"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import { formatMoeda, parseValorBR } from "@/lib/format";
import { calcularTotais, STATUS_LABEL, STATUS_OPCOES } from "@/lib/orcamento";
import EstiloPicker from "./EstiloPicker";
import { normalizarEstilo, type EstiloId } from "@/lib/estilos";
import type { Cliente } from "./ClientesManager";
import type { Produto } from "./ProdutosManager";

type ItemForm = {
  uid: string;
  produtoId: number | null;
  codigo: string;
  descricao: string;
  regAnvisa: string;
  marca: string;
  unidade: string;
  quantidade: string;
  valorUnitario: string;
};

export type OrcamentoInicial = {
  id: number;
  clienteId: number;
  data: string;
  condicaoPagamento: string;
  prazoEntrega: string;
  validadeProposta: string;
  observacoes: string;
  status: string;
  template: string;
  itens: {
    produtoId: number | null;
    codigo: string;
    descricao: string;
    regAnvisa: string;
    marca: string;
    unidade: string;
    quantidade: number;
    valorUnitario: number;
  }[];
};

type Defaults = {
  condicaoPagamentoPadrao: string;
  prazoEntregaPadrao: string;
  validadeDiasPadrao: number;
};

let contador = 0;
const novoUid = () => `item-${Date.now()}-${contador++}`;

function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function OrcamentoForm({
  clientes,
  produtos,
  defaults,
  inicial,
}: {
  clientes: Cliente[];
  produtos: Produto[];
  defaults: Defaults;
  inicial?: OrcamentoInicial;
}) {
  const router = useRouter();
  const editando = Boolean(inicial);

  const hoje = toDateInput(new Date());
  const validadePadrao = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (defaults.validadeDiasPadrao || 30));
    return toDateInput(d);
  }, [defaults.validadeDiasPadrao]);

  const [clienteId, setClienteId] = useState<string>(
    inicial ? String(inicial.clienteId) : "",
  );
  const [data, setData] = useState<string>(
    inicial ? inicial.data.slice(0, 10) : hoje,
  );
  const [validade, setValidade] = useState<string>(
    inicial ? inicial.validadeProposta.slice(0, 10) : validadePadrao,
  );
  const [condicaoPagamento, setCondicaoPagamento] = useState<string>(
    inicial ? inicial.condicaoPagamento : defaults.condicaoPagamentoPadrao,
  );
  const [prazoEntrega, setPrazoEntrega] = useState<string>(
    inicial ? inicial.prazoEntrega : defaults.prazoEntregaPadrao,
  );
  const [status, setStatus] = useState<string>(inicial?.status ?? "ABERTO");
  const [observacoes, setObservacoes] = useState<string>(
    inicial?.observacoes ?? "",
  );
  const [template, setTemplate] = useState<EstiloId>(
    normalizarEstilo(inicial?.template),
  );
  const [itens, setItens] = useState<ItemForm[]>(
    inicial
      ? inicial.itens.map((it) => ({
          uid: novoUid(),
          produtoId: it.produtoId,
          codigo: it.codigo,
          descricao: it.descricao,
          regAnvisa: it.regAnvisa,
          marca: it.marca,
          unidade: it.unidade,
          quantidade: String(it.quantidade),
          valorUnitario: String(it.valorUnitario).replace(".", ","),
        }))
      : [],
  );
  const [produtoSel, setProdutoSel] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const totais = useMemo(
    () =>
      calcularTotais(
        itens.map((it) => ({
          quantidade: parseValorBR(it.quantidade),
          valorUnitario: parseValorBR(it.valorUnitario),
        })),
      ),
    [itens],
  );

  function adicionarProduto(idStr: string) {
    setProdutoSel("");
    const p = produtos.find((x) => String(x.id) === idStr);
    if (!p) return;
    setItens((prev) => [
      ...prev,
      {
        uid: novoUid(),
        produtoId: p.id,
        codigo: p.codigo,
        descricao: p.descricao,
        regAnvisa: p.regAnvisa,
        marca: p.marca,
        unidade: p.unidade,
        quantidade: "1",
        valorUnitario: String(p.precoUnitario).replace(".", ","),
      },
    ]);
  }

  function adicionarAvulso() {
    setItens((prev) => [
      ...prev,
      {
        uid: novoUid(),
        produtoId: null,
        codigo: "",
        descricao: "",
        regAnvisa: "",
        marca: "",
        unidade: "UN",
        quantidade: "1",
        valorUnitario: "",
      },
    ]);
  }

  function atualizarItem(uid: string, campo: keyof ItemForm, valor: string) {
    setItens((prev) =>
      prev.map((it) => (it.uid === uid ? { ...it, [campo]: valor } : it)),
    );
  }

  function removerItem(uid: string) {
    setItens((prev) => prev.filter((it) => it.uid !== uid));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!clienteId) {
      setErro("Selecione um cliente.");
      return;
    }
    if (itens.length === 0) {
      setErro("Adicione ao menos um item ao orçamento.");
      return;
    }
    setSalvando(true);

    const payload = {
      clienteId: Number(clienteId),
      data,
      validadeProposta: validade,
      condicaoPagamento,
      prazoEntrega,
      status,
      observacoes,
      template,
      itens: itens.map((it) => ({
        produtoId: it.produtoId,
        codigo: it.codigo,
        descricao: it.descricao,
        regAnvisa: it.regAnvisa,
        marca: it.marca,
        unidade: it.unidade,
        quantidade: it.quantidade,
        valorUnitario: it.valorUnitario,
      })),
    };

    const url = editando ? `/api/orcamentos/${inicial!.id}` : "/api/orcamentos";
    const method = editando ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSalvando(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErro(d.error ?? "Erro ao salvar o orçamento.");
      return;
    }
    const orc = await res.json();
    router.push(`/orcamentos/${orc.id}/imprimir`);
    router.refresh();
  }

  return (
    <form onSubmit={salvar}>
      <PageHeader
        title={editando ? `Editar orçamento` : "Novo orçamento"}
        subtitle="Preencha os dados, adicione os itens e salve para gerar o PDF"
      >
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.push("/")}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar orçamento"}
        </button>
      </PageHeader>

      {erro && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Dados gerais */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Dados do orçamento
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Cliente *</label>
              <div className="flex gap-2">
                <select
                  className="field"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.razaoSocial}
                      {c.cnpj ? ` — ${c.cnpj}` : ""}
                    </option>
                  ))}
                </select>
                <a href="/clientes" target="_blank" className="btn-secondary whitespace-nowrap">
                  + Cadastrar
                </a>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="label">Data</label>
                <input
                  type="date"
                  className="field"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Validade da proposta</label>
                <input
                  type="date"
                  className="field"
                  value={validade}
                  onChange={(e) => setValidade(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="field"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPCOES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Condição de pagamento</label>
                <input
                  className="field"
                  placeholder="Ex.: 027 - 10 x"
                  value={condicaoPagamento}
                  onChange={(e) => setCondicaoPagamento(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Prazo de entrega</label>
                <input
                  className="field"
                  value={prazoEntrega}
                  onChange={(e) => setPrazoEntrega(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Observações</label>
              <textarea
                className="field min-h-20"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Totais */}
        <section className="card h-fit p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Totais
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Itens orçados</dt>
              <dd className="tabular-nums">{totais.totalItens}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Total de unidades</dt>
              <dd className="tabular-nums">{totais.totalUnidades}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="tabular-nums">{formatMoeda(totais.subtotal)}</dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-semibold">
              <dt>Total geral</dt>
              <dd className="tabular-nums text-brand-700">
                {formatMoeda(totais.totalGeral)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Estilo do documento */}
      <section className="card mt-6 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Estilo do documento
        </h2>
        <p className="mt-0.5 mb-4 text-sm text-slate-500">
          Escolha o modelo do orçamento. Você pode trocar depois, na visualização.
        </p>
        <EstiloPicker value={template} onChange={setTemplate} />
      </section>

      {/* Itens */}
      <section className="card mt-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Itens
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="field w-64"
              value={produtoSel}
              onChange={(e) => adicionarProduto(e.target.value)}
            >
              <option value="">+ Adicionar do catálogo...</option>
              {produtos
                .filter((p) => p.ativo)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigo ? `${p.codigo} — ` : ""}
                    {p.descricao}
                  </option>
                ))}
            </select>
            <button type="button" className="btn-secondary" onClick={adicionarAvulso}>
              + Item avulso
            </button>
          </div>
        </div>

        {itens.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Nenhum item adicionado. Use o catálogo ou adicione um item avulso.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2 py-2">Código</th>
                  <th className="px-2 py-2 min-w-56">Descrição</th>
                  <th className="px-2 py-2">Reg. ANVISA</th>
                  <th className="px-2 py-2">Marca</th>
                  <th className="px-2 py-2 w-20">Qtde</th>
                  <th className="px-2 py-2 w-32 text-right">Vr. unit.</th>
                  <th className="px-2 py-2 w-32 text-right">Vr. total</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it) => {
                  const total =
                    parseValorBR(it.quantidade) * parseValorBR(it.valorUnitario);
                  return (
                    <tr key={it.uid} className="border-t border-slate-100 align-top">
                      <td className="px-1 py-1">
                        <input
                          className="field"
                          value={it.codigo}
                          onChange={(e) =>
                            atualizarItem(it.uid, "codigo", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          className="field"
                          value={it.descricao}
                          onChange={(e) =>
                            atualizarItem(it.uid, "descricao", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          className="field"
                          value={it.regAnvisa}
                          onChange={(e) =>
                            atualizarItem(it.uid, "regAnvisa", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          className="field"
                          value={it.marca}
                          onChange={(e) =>
                            atualizarItem(it.uid, "marca", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          className="field text-right"
                          inputMode="decimal"
                          value={it.quantidade}
                          onChange={(e) =>
                            atualizarItem(it.uid, "quantidade", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          className="field text-right"
                          inputMode="decimal"
                          placeholder="0,00"
                          value={it.valorUnitario}
                          onChange={(e) =>
                            atualizarItem(it.uid, "valorUnitario", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums text-slate-700">
                        {formatMoeda(total)}
                      </td>
                      <td className="px-1 py-3 text-right">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removerItem(it.uid)}
                          title="Remover item"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </form>
  );
}
