export type EnderecoCep = {
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
};

/**
 * Busca o endereço a partir do CEP usando a API pública ViaCEP.
 * Roda no navegador (client-side). Retorna null se o CEP for inválido,
 * não encontrado ou se a consulta falhar.
 */
export async function buscarCep(cepRaw: string): Promise<EnderecoCep | null> {
  const cep = (cepRaw || "").replace(/\D/g, "");
  if (cep.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.erro) return null;
    return {
      endereco: data.logradouro ?? "",
      bairro: data.bairro ?? "",
      cidade: data.localidade ?? "",
      uf: data.uf ?? "",
    };
  } catch {
    return null;
  }
}
