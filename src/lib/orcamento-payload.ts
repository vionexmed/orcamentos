import { parseValorBR } from "./format";
import { normalizarEstilo, type EstiloId } from "./estilos";

export type ItemPayload = {
  produtoId: number | null;
  codigo: string;
  descricao: string;
  regAnvisa: string;
  marca: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  ordem: number;
};

/** Normaliza e valida os itens recebidos do cliente. */
export function normalizarItens(itensRaw: unknown): ItemPayload[] {
  if (!Array.isArray(itensRaw)) return [];
  return itensRaw
    .map((raw, index): ItemPayload => {
      const it = raw as Record<string, unknown>;
      const produtoId =
        it.produtoId === null || it.produtoId === undefined || it.produtoId === ""
          ? null
          : Number(it.produtoId);
      return {
        produtoId: produtoId && Number.isFinite(produtoId) ? produtoId : null,
        codigo: String(it.codigo ?? ""),
        descricao: String(it.descricao ?? "").trim(),
        regAnvisa: String(it.regAnvisa ?? ""),
        marca: String(it.marca ?? ""),
        unidade: String(it.unidade ?? "UN") || "UN",
        quantidade: parseValorBR(it.quantidade as string | number),
        valorUnitario: parseValorBR(it.valorUnitario as string | number),
        ordem: index,
      };
    })
    .filter((it) => it.descricao.length > 0);
}

export type OrcamentoPayload = {
  clienteId: number;
  empresaId: number | null;
  data?: Date;
  condicaoPagamento: string;
  prazoEntrega: string;
  validadeProposta: Date;
  observacoes: string;
  status: string;
  template: EstiloId;
  itens: ItemPayload[];
};

export type ValidacaoResultado =
  | { ok: true; dados: OrcamentoPayload }
  | { ok: false; erro: string };

/** Valida o corpo de criação/edição de orçamento. */
export function validarOrcamento(body: Record<string, unknown>): ValidacaoResultado {
  const clienteId = Number(body.clienteId);
  if (!clienteId || !Number.isFinite(clienteId)) {
    return { ok: false, erro: "Selecione um cliente." };
  }

  const empresaIdRaw = Number(body.empresaId);
  const empresaId =
    empresaIdRaw && Number.isFinite(empresaIdRaw) ? empresaIdRaw : null;

  const itens = normalizarItens(body.itens);
  if (itens.length === 0) {
    return { ok: false, erro: "Adicione ao menos um item ao orçamento." };
  }

  const validadeStr = String(body.validadeProposta ?? "");
  const validadeProposta = validadeStr ? new Date(validadeStr) : new Date();
  if (Number.isNaN(validadeProposta.getTime())) {
    return { ok: false, erro: "Data de validade inválida." };
  }

  const data = body.data ? new Date(String(body.data)) : undefined;

  return {
    ok: true,
    dados: {
      clienteId,
      empresaId,
      data: data && !Number.isNaN(data.getTime()) ? data : undefined,
      condicaoPagamento: String(body.condicaoPagamento ?? ""),
      prazoEntrega: String(body.prazoEntrega ?? "Imediato"),
      validadeProposta,
      observacoes: String(body.observacoes ?? ""),
      status: String(body.status ?? "ABERTO"),
      template: normalizarEstilo(body.template),
      itens,
    },
  };
}
