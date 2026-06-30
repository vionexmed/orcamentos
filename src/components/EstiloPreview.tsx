import type { EstiloId } from "@/lib/estilos";

/**
 * Miniatura esquemática de cada estilo de documento — uma "prévia" visual
 * para o usuário reconhecer o layout antes de escolher.
 */
export default function EstiloPreview({ id }: { id: EstiloId }) {
  if (id === "CLASSICO") return <PreviewClassico />;
  return <PreviewBoxed variante={id} />;
}

function PreviewClassico() {
  return (
    <div className="h-full w-full bg-white p-1.5 font-mono text-[4px] leading-[1.5] text-black">
      <div className="flex justify-between text-gray-500">
        <span>Data:</span>
        <span>Pág:1</span>
      </div>
      <div className="mt-0.5 flex border border-black">
        <div className="grid w-1/3 place-items-center border-r border-black py-1 text-[3px] text-gray-400">
          LOGO
        </div>
        <div className="flex-1 p-0.5 text-right">
          <div className="font-bold">EMPRESA LTDA</div>
          <div className="text-gray-500">Endereço · CNPJ</div>
        </div>
      </div>
      <div className="border-x border-b border-black text-center font-bold">
        Orçamento Nº: 113
      </div>
      <div className="border-x border-b border-black px-0.5 text-gray-600">
        Cliente……:
      </div>
      <div className="mt-1 flex gap-1 border-b border-black font-bold">
        <span>Item</span>
        <span>Descrição</span>
        <span className="ml-auto">Vr.total</span>
      </div>
      <div className="flex gap-1 text-gray-700">
        <span>01</span>
        <span>Produto…</span>
        <span className="ml-auto">148.000,00</span>
      </div>
      <div className="flex items-end font-bold">
        <span>Subtotal</span>
        <span className="mx-0.5 mb-0.5 flex-1 border-b border-dotted border-black" />
        <span>148.000,00</span>
      </div>
      <div className="mt-1 border border-black px-0.5 font-bold">
        TOTAL GERAL…: 148.000,00
      </div>
    </div>
  );
}

function PreviewBoxed({ variante }: { variante: "FISCAL" | "MODERNO" }) {
  const moderno = variante === "MODERNO";
  const titulo = moderno ? "bg-brand-700 text-white" : "border-y border-slate-700 bg-white text-slate-900";
  const secao = moderno ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600";
  const total = moderno ? "bg-brand-700 text-white" : "bg-slate-800 text-white";
  const borda = moderno ? "border-t-2 border-t-brand-700 border border-slate-300" : "border-2 border-slate-700";

  return (
    <div className={`h-full w-full bg-white p-1.5 text-[4px] leading-[1.5] text-slate-700 ${borda}`}>
      <div className="text-center">
        <div className="mx-auto mb-0.5 h-2 w-2 rounded-full border border-slate-400" />
        <div className="font-bold text-slate-900">EMPRESA LTDA</div>
        <div className="text-slate-400">CNPJ · IE</div>
      </div>
      <div className={`my-0.5 text-center text-[3.5px] font-bold uppercase tracking-widest ${titulo}`}>
        Orçamento
      </div>
      <div className={`px-0.5 font-bold uppercase ${secao}`}>Cliente</div>
      <div className="border-b border-slate-200 text-slate-600">Razão social…</div>
      <div className={`mt-0.5 px-0.5 font-bold uppercase ${secao}`}>Produtos</div>
      <div className="flex gap-1 border-b border-slate-100">
        <span>01</span>
        <span>Produto</span>
        <span className="ml-auto">148.000</span>
      </div>
      <div className="mt-0.5 flex justify-end">
        <span className={`px-1 font-bold ${total}`}>TOTAL 148.000</span>
      </div>
    </div>
  );
}
