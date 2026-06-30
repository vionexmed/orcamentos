// Helpers de formatação no padrão brasileiro (pt-BR).

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numero2 = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formata um valor como moeda: 148000 -> "R$ 148.000,00" */
export function formatMoeda(valor: number): string {
  return brl.format(Number.isFinite(valor) ? valor : 0);
}

/** Formata número com 2 casas, sem o símbolo de moeda: 148000 -> "148.000,00" */
export function formatNumero(valor: number): string {
  return numero2.format(Number.isFinite(valor) ? valor : 0);
}

/** Data curta: "10/03/2026" */
export function formatData(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

/** Data + hora: "10/03/2026 16:46" */
export function formatDataHora(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Número do orçamento com zero à esquerda: 113 -> "000113" */
export function formatNumeroOrcamento(numero: number): string {
  return String(numero).padStart(6, "0");
}

/**
 * Converte texto digitado no padrão BR ("1.234,56" ou "1234,56" ou "1234.56")
 * para número. Retorna 0 se inválido.
 */
export function parseValorBR(texto: string | number): number {
  if (typeof texto === "number") return texto;
  if (!texto) return 0;
  const limpo = texto
    .trim()
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(limpo);
  return Number.isFinite(n) ? n : 0;
}
