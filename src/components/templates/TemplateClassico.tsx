import {
  formatData,
  formatDataHora,
  formatNumero,
  formatNumeroOrcamento,
} from "@/lib/format";
import { calcularTotais } from "@/lib/orcamento";
import type { DocumentoProps } from "@/lib/estilos";
import { estiloLogo } from "@/lib/logo";

const pad = (n: number) => String(n).padStart(2, "0");

function emissaoCurta(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(
    d.getFullYear(),
  ).slice(-2)} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Estilo CLÁSSICO — réplica do modelo tradicional (monoespaçado),
 * fiel ao orçamento enviado pelo cliente.
 */
export default function TemplateClassico({ orcamento, empresa }: DocumentoProps) {
  const totais = calcularTotais(orcamento.itens);
  const cliente = orcamento.cliente;
  const cidadeUf = [empresa.cidade, empresa.uf].filter(Boolean).join("/");

  return (
    <div className="print-sheet mx-auto bg-white p-6 font-mono text-[12px] leading-[1.45] text-black shadow-sm">
      {/* Topo: data de emissão do documento + paginação */}
      <div className="mb-2 flex justify-between">
        <span>Data: {formatDataHora(new Date())}</span>
        <span>Pág:1 de 1</span>
      </div>

      {/* Cabeçalho da empresa */}
      <div className="flex items-stretch border border-black">
        <div className="flex w-56 shrink-0 items-center justify-center border-r border-black p-3">
          {empresa.logoPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={empresa.logoPath}
              alt="Logo"
              style={estiloLogo(empresa.logoAltura, { maxWidth: "100%" })}
              className="block object-contain"
            />
          ) : (
            <span className="text-[10px] text-gray-400">[LOGO]</span>
          )}
        </div>
        <div className="flex-1 p-2 text-right">
          <p className="font-bold">
            {empresa.razaoSocial || "Configure sua empresa em Configurações"}
          </p>
          {empresa.endereco && <p>{empresa.endereco}</p>}
          <p>{["CEP " + empresa.cep, cidadeUf].filter((x) => x && x !== "CEP ").join(" - ")}</p>
          {empresa.cnpj && <p>CNPJ: {empresa.cnpj}</p>}
          {empresa.inscricaoEstadual && <p>IE: {empresa.inscricaoEstadual}</p>}
        </div>
      </div>

      {/* Número do orçamento */}
      <div className="flex items-center justify-center border-x border-b border-black px-2 py-1 font-bold">
        Orçamento Nº:&nbsp;&nbsp;&nbsp;&nbsp;{formatNumeroOrcamento(orcamento.numero)} de {emissaoCurta(new Date(orcamento.data))}
      </div>

      {/* Cliente */}
      <div className="border-x border-b border-black px-2 py-1">
        <p>Cliente......: {cliente.razaoSocial}</p>
        <p className="h-3">&nbsp;</p>
        <p>E-mail.......: {cliente.email}</p>
        <p>Telefone.....: {cliente.telefone}</p>
      </div>

      {/* Itens */}
      <table className="mt-4 w-full border-collapse text-[11px]">
        <thead>
          <tr className="border-b border-black text-left">
            <th className="pb-1 pr-2 font-bold">Item</th>
            <th className="pb-1 pr-2 font-bold">Código</th>
            <th className="pb-1 pr-2 font-bold">Descrição do produto</th>
            <th className="pb-1 pr-2 font-bold">Reg.ANVISA</th>
            <th className="pb-1 pr-2 font-bold">Marca</th>
            <th className="pb-1 pr-2 text-right font-bold">Qtde</th>
            <th className="pb-1 pr-2 text-right font-bold">Vr.unit.</th>
            <th className="pb-1 text-right font-bold">Vr.total</th>
          </tr>
        </thead>
        <tbody>
          {orcamento.itens.map((it, i) => (
            <tr key={it.id} className="align-top">
              <td className="py-0.5 pr-2">{pad(i + 1)}</td>
              <td className="py-0.5 pr-2">{it.codigo}</td>
              <td className="py-0.5 pr-2">{it.descricao}</td>
              <td className="py-0.5 pr-2">{it.regAnvisa}</td>
              <td className="py-0.5 pr-2">{it.marca}</td>
              <td className="py-0.5 pr-2 text-right">
                {formatNumero(it.quantidade).replace(",00", "")}
              </td>
              <td className="py-0.5 pr-2 text-right">{formatNumero(it.valorUnitario)}</td>
              <td className="py-0.5 text-right">
                {formatNumero(it.quantidade * it.valorUnitario)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Subtotal com linha pontilhada */}
      <div className="mt-1 flex items-end font-bold">
        <span>Subtotal</span>
        <span className="mx-1 mb-1 flex-1 border-b border-dotted border-black" />
        <span>{formatNumero(totais.subtotal)}</span>
      </div>

      {/* Totais */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 border border-black px-2 py-1">
        <p>Itens orçados....: {totais.totalItens}</p>
        <p>
          Total produtos:{" "}
          {formatNumero(totais.subtotal)}
        </p>
        <p>
          Total de unidades: {formatNumero(totais.totalUnidades).replace(",00", "")}
        </p>
        <p className="font-bold">TOTAL GERAL...: {formatNumero(totais.totalGeral)}</p>
      </div>

      {/* Condições */}
      <div className="border-x border-b border-black px-2 py-2">
        <p>Condicao de Pagamento..: {orcamento.condicaoPagamento}</p>
        <p className="mt-1">Prazo de Entrega.......: {orcamento.prazoEntrega}</p>
        <p className="mt-1 font-bold">
          Validade da Proposta...: {formatData(orcamento.validadeProposta)}
        </p>
      </div>

      {orcamento.observacoes && (
        <div className="mt-3 whitespace-pre-wrap text-[11px]">
          Obs.: {orcamento.observacoes}
        </div>
      )}
    </div>
  );
}
