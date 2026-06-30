"use client";

import { ESTILOS, type EstiloId } from "@/lib/estilos";
import EstiloPreview from "./EstiloPreview";

export default function EstiloPicker({
  value,
  onChange,
  disabled,
}: {
  value: EstiloId;
  onChange: (id: EstiloId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {ESTILOS.map((e) => {
        const sel = value === e.id;
        return (
          <button
            type="button"
            key={e.id}
            onClick={() => onChange(e.id)}
            disabled={disabled}
            className={`rounded-lg border-2 p-2 text-left transition disabled:opacity-60 ${
              sel
                ? "border-brand-600 ring-2 ring-brand-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="aspect-[3/4] w-full overflow-hidden rounded border border-slate-200 bg-white">
              <EstiloPreview id={e.id} />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] ${
                  sel
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="text-sm font-semibold text-slate-800">{e.nome}</span>
            </div>
            <p className="mt-1 text-xs leading-snug text-slate-500">{e.descricao}</p>
          </button>
        );
      })}
    </div>
  );
}
