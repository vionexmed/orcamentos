import {
  formatData,
  formatDataHora,
  formatMoeda,
  formatNumero,
  formatNumeroOrcamento,
} from "@/lib/format";
import { calcularTotais, STATUS_LABEL } from "@/lib/orcamento";
import type { DocumentoProps } from "@/lib/estilos";
import { estiloLogo, tamanhoPlaceholder } from "@/lib/logo";

type Variante = "FISCAL" | "MODERNO";

function paleta(variante: Variante) {
  if (variante === "MODERNO") {
    return {
      sheet: "border-t-4 border-t-brand-700 border border-slate-300",
      titulo: "bg-brand-700 text-white",
      secao: "bg-brand-600 text-white",
      tableHead: "bg-brand-50 text-brand-700",
      totalBox: "bg-brand-700 text-white",
      totalLabel: "text-brand-100",
      nome: "text-brand-900",
    };
  }
  return {
    sheet: "border-2 border-slate-700",
    titulo: "border-y-2 border-slate-700 bg-white text-slate-900",
    secao: "border-y border-slate-400 bg-slate-100 text-slate-700",
    tableHead: "bg-slate-100 text-slate-600",
    totalBox: "bg-slate-800 text-white",
    totalLabel: "text-slate-300",
    nome: "text-slate-900",
  };
}

export default function TemplateBoxed({
  orcamento,
  empresa,
  variante,
}: DocumentoProps & { variante: Variante }) {
  const c = paleta(variante);
  const totais = calcularTotais(orcamento.itens);
  const cliente = orcamento.cliente;
  const cidadeUf = [empresa.cidade, empresa.uf].filter(Boolean).join("/");
  const clienteCidadeUf = [cliente.cidade, cliente.uf].filter(Boolean).join("/");

  const Secao = ({ children }: { children: React.ReactNode }) => (
    <div className={`px-2 py-[3px] text-[8px] font-bold uppercase tracking-[0.15em] ${c.secao}`}>
      {children}
    </div>
  );

  const Campo = ({
    label,
    children,
    valorClassName = "",
  }: {
    label: string;
    children?: React.ReactNode;
    valorClassName?: string;
  }) => (
    <div className="px-2 py-[3px]">
      <div className="text-[7.5px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className={`text-[11px] leading-tight text-slate-900 ${valorClassName}`}>
        {children !== undefined && children !== null && children !== "" ? children : "—"}
      </div>
    </div>
  );

  return (
    <div className={`print-sheet mx-auto bg-white text-slate-900 shadow-sm ${c.sheet}`}>
      {/* Timbre / cabeçalho oficial — logo à esquerda, dados ao lado.
          A logo se adapta a qualquer proporção (object-contain): nunca é
          cortada nem distorcida, apenas encaixa dentro da área reservada. */}
      <div className="flex items-center gap-4 px-4 py-3">
        {empresa.logoPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={empresa.logoPath}
            alt="Logo"
            style={estiloLogo(empresa.logoAltura)}
            className="block h-auto shrink-0 object-contain object-left"
          />
        ) : (
          <div
            style={{
              height: tamanhoPlaceholder(empresa.logoAltura),
              width: tamanhoPlaceholder(empresa.logoAltura),
            }}
            className="grid shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-center text-[9px] leading-tight text-slate-400"
          >
            BRASÃO
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-[14px] font-bold uppercase leading-tight tracking-wide ${c.nome}`}>
            {empresa.razaoSocial || "Configure sua empresa em Configurações"}
          </p>
          {empresa.nomeFantasia && (
            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              {empresa.nomeFantasia}
            </p>
          )}
          <p className="mt-0.5 text-[9px] leading-snug text-slate-600">
            {[empresa.endereco, [empresa.cep, cidadeUf].filter(Boolean).join(" - ")]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="text-[9px] leading-snug text-slate-600">
            {[
              empresa.cnpj && `CNPJ: ${empresa.cnpj}`,
              empresa.inscricaoEstadual && `IE: ${empresa.inscricaoEstadual}`,
              empresa.telefone,
              empresa.email,
            ]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        </div>
      </div>

      {/* Faixa de título */}
      <div className={`flex items-center justify-center px-3 py-1.5 text-center ${c.titulo}`}>
        <span className="text-[12px] font-bold uppercase tracking-[0.25em]">
          Proposta Comercial / Orçamento
        </span>
      </div>

      {/* Identificação */}
      <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] divide-x divide-slate-300 border-b border-slate-400">
        <Campo label="Orçamento Nº" valorClassName="text-base font-extrabold tracking-tight">
          {formatNumeroOrcamento(orcamento.numero)}
        </Campo>
        <Campo label="Emissão">{formatData(orcamento.data)}</Campo>
        <Campo label="Validade" valorClassName="font-semibold">
          {formatData(orcamento.validadeProposta)}
        </Campo>
        <Campo label="Situação" valorClassName="font-semibold uppercase">
          {STATUS_LABEL[orcamento.status] ?? orcamento.status}
        </Campo>
      </div>

      {/* Cliente */}
      <Secao>Destinatário / Cliente</Secao>
      <div>
        <div className="grid grid-cols-[1fr_220px] divide-x divide-slate-300 border-b border-slate-300">
          <Campo label="Razão social / Nome" valorClassName="font-semibold">
            {cliente.razaoSocial}
          </Campo>
          <Campo label="CNPJ / CPF">{cliente.cnpj}</Campo>
        </div>
        <div className="grid grid-cols-[1fr_180px_120px] divide-x divide-slate-300 border-b border-slate-300">
          <Campo label="Endereço">{cliente.endereco}</Campo>
          <Campo label="Cidade / UF">{clienteCidadeUf}</Campo>
          <Campo label="CEP">{cliente.cep}</Campo>
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-300">
          <Campo label="Telefone">{cliente.telefone}</Campo>
          <Campo label="E-mail">{cliente.email}</Campo>
        </div>
      </div>

      {/* Produtos */}
      <Secao>Dados dos Produtos / Equipamentos</Secao>
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr className={`text-left uppercase tracking-wide ${c.tableHead}`}>
            <th className="border-b border-slate-300 px-2 py-1 text-[8px] font-bold">Item</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-[8px] font-bold">Código</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-[8px] font-bold">Descrição do produto</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-[8px] font-bold">Reg. ANVISA</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-[8px] font-bold">Marca</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-right text-[8px] font-bold">Qtd</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-right text-[8px] font-bold">Vl. unit.</th>
            <th className="border-b border-l border-slate-300 px-2 py-1 text-right text-[8px] font-bold">Vl. total</th>
          </tr>
        </thead>
        <tbody>
          {orcamento.itens.map((it, i) => (
            <tr key={it.id} className="align-top">
              <td className="border-b border-slate-200 px-2 py-1 text-center tabular-nums text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </td>
              <td className="border-b border-l border-slate-200 px-2 py-1 tabular-nums">{it.codigo || "—"}</td>
              <td className="border-b border-l border-slate-200 px-2 py-1 font-medium">{it.descricao}</td>
              <td className="border-b border-l border-slate-200 px-2 py-1 tabular-nums">{it.regAnvisa || "—"}</td>
              <td className="border-b border-l border-slate-200 px-2 py-1">{it.marca || "—"}</td>
              <td className="border-b border-l border-slate-200 px-2 py-1 text-right tabular-nums">
                {formatNumero(it.quantidade).replace(",00", "")} {it.unidade}
              </td>
              <td className="border-b border-l border-slate-200 px-2 py-1 text-right tabular-nums">
                {formatMoeda(it.valorUnitario)}
              </td>
              <td className="border-b border-l border-slate-200 px-2 py-1 text-right tabular-nums">
                {formatMoeda(it.quantidade * it.valorUnitario)}
              </td>
            </tr>
          ))}
          {orcamento.itens.length < 6 &&
            Array.from({ length: 6 - orcamento.itens.length }).map((_, k) => (
              <tr key={`vazia-${k}`} className="h-5">
                <td className="border-b border-slate-100" />
                <td className="border-b border-l border-slate-100" />
                <td className="border-b border-l border-slate-100" />
                <td className="border-b border-l border-slate-100" />
                <td className="border-b border-l border-slate-100" />
                <td className="border-b border-l border-slate-100" />
                <td className="border-b border-l border-slate-100" />
                <td className="border-b border-l border-slate-100" />
              </tr>
            ))}
        </tbody>
      </table>

      {/* Totais */}
      <Secao>Totais</Secao>
      <div className="grid grid-cols-[1fr_1fr_1fr_1.4fr] divide-x divide-slate-300 border-b border-slate-400">
        <Campo label="Itens orçados" valorClassName="tabular-nums">
          {totais.totalItens}
        </Campo>
        <Campo label="Total de unidades" valorClassName="tabular-nums">
          {formatNumero(totais.totalUnidades).replace(",00", "")}
        </Campo>
        <Campo label="Total dos produtos" valorClassName="tabular-nums">
          {formatMoeda(totais.subtotal)}
        </Campo>
        <div className={`flex flex-col justify-center px-2 py-1 ${c.totalBox}`}>
          <div className={`text-[7.5px] font-semibold uppercase tracking-wide ${c.totalLabel}`}>
            Total geral
          </div>
          <div className="text-[15px] font-extrabold leading-tight tabular-nums">
            {formatMoeda(totais.totalGeral)}
          </div>
        </div>
      </div>

      {/* Condições */}
      <Secao>Condições Comerciais</Secao>
      <div className="grid grid-cols-3 divide-x divide-slate-300 border-b border-slate-400">
        <Campo label="Condição de pagamento" valorClassName="font-medium">
          {orcamento.condicaoPagamento}
        </Campo>
        <Campo label="Prazo de entrega" valorClassName="font-medium">
          {orcamento.prazoEntrega}
        </Campo>
        <Campo label="Validade da proposta" valorClassName="font-medium">
          {formatData(orcamento.validadeProposta)}
        </Campo>
      </div>

      {/* Observações */}
      {orcamento.observacoes && (
        <>
          <Secao>Dados adicionais / Observações</Secao>
          <div className="border-b border-slate-400 px-2 py-1 text-[10px] leading-snug text-slate-700 whitespace-pre-wrap">
            {orcamento.observacoes}
          </div>
        </>
      )}

      {/* Assinaturas */}
      <div className="grid grid-cols-2 gap-10 px-8 pb-5 pt-10 text-center text-[9px] text-slate-600">
        <div className="mx-auto w-full border-t border-slate-500 pt-1">Responsável / Emitente</div>
        <div className="mx-auto w-full border-t border-slate-500 pt-1">Aceite do Cliente</div>
      </div>

      {/* Rodapé */}
      <div className="border-t border-slate-400 bg-slate-50 px-3 py-1.5 text-center text-[8px] text-slate-400">
        {empresa.razaoSocial || "Sua empresa"}
        {empresa.cnpj ? ` — CNPJ ${empresa.cnpj}` : ""} · Documento gerado em{" "}
        {formatDataHora(new Date())} · Este orçamento não possui valor fiscal.
      </div>
    </div>
  );
}
