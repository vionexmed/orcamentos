"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogoMark,
  IconOrcamentos,
  IconClientes,
  IconProdutos,
  IconConfig,
  IconChevron,
} from "./icons";

const links = [
  {
    href: "/",
    label: "Orçamentos",
    Icon: IconOrcamentos,
    match: (p: string) => p === "/" || p.startsWith("/orcamentos"),
  },
  {
    href: "/clientes",
    label: "Clientes",
    Icon: IconClientes,
    match: (p: string) => p.startsWith("/clientes"),
  },
  {
    href: "/produtos",
    label: "Produtos",
    Icon: IconProdutos,
    match: (p: string) => p.startsWith("/produtos"),
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    Icon: IconConfig,
    match: (p: string) => p.startsWith("/configuracoes"),
  },
];

function breadcrumb(pathname: string): string[] {
  if (pathname === "/") return ["Início", "Orçamentos"];
  if (pathname.startsWith("/orcamentos/novo")) return ["Início", "Orçamentos", "Novo"];
  if (pathname.includes("/editar")) return ["Início", "Orçamentos", "Editar"];
  if (pathname.includes("/imprimir")) return ["Início", "Orçamentos", "Documento"];
  if (pathname.startsWith("/clientes")) return ["Início", "Clientes"];
  if (pathname.startsWith("/produtos")) return ["Início", "Produtos"];
  if (pathname.startsWith("/configuracoes")) return ["Início", "Configurações"];
  return ["Início"];
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const trilha = breadcrumb(pathname);
  const ano = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="no-print">
        {/* Masthead institucional */}
        <header className="bg-brand-700 text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <LogoMark className="h-9 w-9 shrink-0" />
            <div className="min-w-0 leading-tight">
              <h1 className="text-[16px] font-semibold tracking-tight">
                Sistema de Orçamentos
              </h1>
              <p className="text-[11px] uppercase tracking-[0.18em] text-brand-200">
                Gestão de Propostas
              </p>
            </div>
          </div>
        </header>

        {/* Barra de menu */}
        <nav className="bg-brand-800 shadow-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-stretch px-2">
            {links.map(({ href, label, Icon, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 border-b-[3px] px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand-300 bg-white/10 text-white"
                      : "border-transparent text-brand-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Breadcrumb */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2 text-xs text-slate-400">
            {trilha.map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <IconChevron className="h-3 w-3 text-slate-300" />}
                {i === 0 ? (
                  <Link href="/" className="transition-colors hover:text-brand-700">
                    {t}
                  </Link>
                ) : (
                  <span
                    className={i === trilha.length - 1 ? "font-medium text-slate-600" : ""}
                  >
                    {t}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>

      {/* Rodapé institucional */}
      <footer className="no-print bg-brand-900 text-brand-200">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed">
          <p className="text-sm font-semibold text-white">Sistema de Orçamentos</p>
          <p className="mt-1">Produtos e equipamentos médicos · Documento sem valor fiscal.</p>
          <p className="mt-2 text-brand-300">© {ano} · Uso interno.</p>
        </div>
      </footer>
    </div>
  );
}
