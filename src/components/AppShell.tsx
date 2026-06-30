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
        <header className="bg-gradient-to-b from-brand-800 to-brand-900 text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5">
            <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
            <div className="min-w-0 leading-tight">
              <h1 className="text-[17px] font-semibold tracking-tight">Orçamentos</h1>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-300">
                Gestão de Propostas
              </p>
            </div>
            <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-brand-100 ring-1 ring-inset ring-white/15 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>

          {/* Barra de menu */}
          <nav className="border-t border-white/10">
            <div className="mx-auto flex max-w-6xl flex-wrap items-stretch gap-1 px-2">
              {links.map(({ href, label, Icon, match }) => {
                const active = match(pathname);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative flex items-center gap-2 px-3.5 py-3 text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-brand-200 hover:text-white"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {label}
                    <span
                      className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors ${
                        active ? "bg-white" : "bg-transparent group-hover:bg-white/30"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>
        </header>

        {/* Breadcrumb */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2.5 text-xs text-slate-400">
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>

      {/* Rodapé institucional */}
      <footer className="no-print border-t border-brand-900/20 bg-brand-900 text-brand-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <span className="font-medium text-brand-100">Sistema de Orçamentos</span>
          </div>
          <p className="text-brand-400">
            © {ano} · Documento sem valor fiscal · Uso interno
          </p>
        </div>
      </footer>
    </div>
  );
}
