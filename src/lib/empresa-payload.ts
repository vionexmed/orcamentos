/** Campos editáveis de uma empresa, normalizados a partir do corpo recebido. */
export function dadosEmpresa(body: Record<string, unknown>) {
  return {
    razaoSocial: String(body.razaoSocial ?? ""),
    nomeFantasia: String(body.nomeFantasia ?? ""),
    cnpj: String(body.cnpj ?? ""),
    inscricaoEstadual: String(body.inscricaoEstadual ?? ""),
    endereco: String(body.endereco ?? ""),
    cep: String(body.cep ?? ""),
    cidade: String(body.cidade ?? ""),
    uf: String(body.uf ?? ""),
    email: String(body.email ?? ""),
    telefone: String(body.telefone ?? ""),
    logoPath: String(body.logoPath ?? ""),
    logoAltura: Math.min(240, Math.max(40, Number(body.logoAltura) || 90)),
    condicaoPagamentoPadrao: String(body.condicaoPagamentoPadrao ?? ""),
    prazoEntregaPadrao: String(body.prazoEntregaPadrao ?? "Imediato"),
    validadeDiasPadrao: Number(body.validadeDiasPadrao) || 30,
  };
}
