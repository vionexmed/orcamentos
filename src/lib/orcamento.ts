// Tipos e cálculos de domínio compartilhados (cliente e servidor).

export type ItemCalculavel = {
  quantidade: number;
  valorUnitario: number;
};

export type TotaisOrcamento = {
  /** Quantidade de itens (linhas) orçados */
  totalItens: number;
  /** Soma das quantidades de todas as linhas */
  totalUnidades: number;
  /** Soma de quantidade * valorUnitario de todas as linhas */
  subtotal: number;
  /** Total geral (hoje = subtotal; ponto único para futuros descontos/frete) */
  totalGeral: number;
};

/** Total de uma única linha. */
export function totalItem(item: ItemCalculavel): number {
  return (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0);
}

/** Calcula todos os totais de um orçamento a partir dos seus itens. */
export function calcularTotais(itens: ItemCalculavel[]): TotaisOrcamento {
  const subtotal = itens.reduce((acc, item) => acc + totalItem(item), 0);
  const totalUnidades = itens.reduce(
    (acc, item) => acc + (Number(item.quantidade) || 0),
    0,
  );
  return {
    totalItens: itens.length,
    totalUnidades,
    subtotal,
    totalGeral: subtotal,
  };
}

export const STATUS_LABEL: Record<string, string> = {
  ABERTO: "Aberto",
  ENVIADO: "Enviado",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
};

export const STATUS_OPCOES = Object.keys(STATUS_LABEL);

/** Soma `dias` a partir de hoje e devolve a data resultante. */
export function dataValidade(dias: number, base: Date = new Date()): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + (Number.isFinite(dias) ? dias : 30));
  return d;
}
