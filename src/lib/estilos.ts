import type { Cliente, Empresa, Orcamento, OrcamentoItem } from "@prisma/client";

/** Estilos (templates) disponíveis para o documento do orçamento. */
export type EstiloId = "CLASSICO" | "FISCAL" | "MODERNO";

export type EstiloInfo = {
  id: EstiloId;
  nome: string;
  descricao: string;
};

export const ESTILOS: EstiloInfo[] = [
  {
    id: "CLASSICO",
    nome: "Clássico",
    descricao: "Modelo tradicional monoespaçado, igual ao do sistema antigo.",
  },
  {
    id: "FISCAL",
    nome: "Nota Fiscal",
    descricao: "Documento sóbrio em preto e branco, com caixas e grade.",
  },
  {
    id: "MODERNO",
    nome: "Moderno",
    descricao: "Layout limpo com faixas em azul-escuro institucional.",
  },
];

export const ESTILO_PADRAO: EstiloId = "CLASSICO";

export function isEstiloValido(v: unknown): v is EstiloId {
  return v === "CLASSICO" || v === "FISCAL" || v === "MODERNO";
}

export function normalizarEstilo(v: unknown): EstiloId {
  return isEstiloValido(v) ? v : ESTILO_PADRAO;
}

/** Dados completos necessários para renderizar o documento. */
export type OrcamentoCompleto = Orcamento & {
  cliente: Cliente;
  itens: OrcamentoItem[];
};

export type DocumentoProps = {
  orcamento: OrcamentoCompleto;
  empresa: Empresa;
};
