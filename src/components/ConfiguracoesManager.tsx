"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";
import ConfiguracoesForm, { type Empresa } from "./ConfiguracoesForm";

function empresaEmBranco(): Empresa {
  return {
    id: 0,
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    inscricaoEstadual: "",
    endereco: "",
    cep: "",
    cidade: "",
    uf: "",
    email: "",
    telefone: "",
    logoPath: "",
    logoAltura: 90,
    condicaoPagamentoPadrao: "",
    prazoEntregaPadrao: "Imediato",
    validadeDiasPadrao: 30,
  };
}

export default function ConfiguracoesManager({
  empresasIniciais,
}: {
  empresasIniciais: Empresa[];
}) {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasIniciais);
  // Empresa nova em edição (ainda não salva). id = 0.
  const [nova, setNova] = useState<Empresa | null>(
    empresasIniciais.length === 0 ? empresaEmBranco() : null,
  );
  const [selId, setSelId] = useState<number>(
    empresasIniciais.length > 0 ? empresasIniciais[0].id : 0,
  );

  const selecionada =
    selId === 0 ? nova : empresas.find((e) => e.id === selId) ?? null;

  function novaEmpresa() {
    setNova(empresaEmBranco());
    setSelId(0);
  }

  function aoSalvar(salva: Empresa) {
    setEmpresas((prev) => {
      const existe = prev.some((e) => e.id === salva.id);
      return existe
        ? prev.map((e) => (e.id === salva.id ? salva : e))
        : [...prev, salva];
    });
    setNova(null);
    setSelId(salva.id);
    router.refresh();
  }

  function aoRemover(id: number) {
    if (id === 0) {
      // Descartou a nova empresa não salva.
      setNova(null);
      setSelId(empresas[0]?.id ?? 0);
      if (empresas.length === 0) {
        setNova(empresaEmBranco());
      }
      return;
    }
    const restantes = empresas.filter((e) => e.id !== id);
    setEmpresas(restantes);
    if (restantes.length > 0) {
      setSelId(restantes[0].id);
    } else {
      setNova(empresaEmBranco());
      setSelId(0);
    }
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Configurações da empresa"
        subtitle="Cadastre uma ou mais empresas emitentes — escolha qual usar ao gerar cada orçamento"
      >
        <button type="button" className="btn-primary" onClick={novaEmpresa}>
          + Nova empresa
        </button>
      </PageHeader>

      {/* Abas das empresas */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {empresas.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setSelId(e.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selId === e.id
                ? "bg-brand-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {e.razaoSocial || `Empresa ${i + 1}`}
          </button>
        ))}
        {nova && (
          <button
            type="button"
            onClick={() => setSelId(0)}
            className={`rounded-md border border-dashed px-3 py-1.5 text-sm font-medium transition-colors ${
              selId === 0
                ? "border-brand-400 bg-brand-50 text-brand-700"
                : "border-slate-300 text-slate-500 hover:bg-slate-50"
            }`}
          >
            • Nova empresa
          </button>
        )}
        <button
          type="button"
          onClick={novaEmpresa}
          title="Adicionar empresa"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-500 hover:bg-slate-100"
        >
          +
        </button>
      </div>

      {selecionada ? (
        <ConfiguracoesForm
          key={selecionada.id}
          inicial={selecionada}
          onSaved={aoSalvar}
          onRemoved={aoRemover}
          podeRemover={empresas.length > 1 || selId === 0}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Nenhuma empresa selecionada. Clique em “+ Nova empresa”.
        </p>
      )}
    </div>
  );
}
