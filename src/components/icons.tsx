/**
 * Ícones SVG (traço, estilo Lucide) — substituem emojis e dão cara de produto.
 * Todos herdam a cor via `currentColor` e aceitam className.
 */

type IconProps = { className?: string };

function base(children: React.ReactNode, className?: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Logo do sistema: documento com selo de aprovado. Autossuficiente (tile branco). */
export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <rect width="36" height="36" rx="9" fill="white" />
      <path
        d="M12 9h7.6l4.9 4.9V25.5A1.5 1.5 0 0 1 23 27H12a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 12 9Z"
        fill="#1b3866"
      />
      <path
        d="M19.3 9.2v4.2a1 1 0 0 0 1 1h4"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8 18h6.4M13.8 21h4.3"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="24.4" cy="24.4" r="4.6" fill="#385f9b" stroke="white" strokeWidth="1.4" />
      <path
        d="m22.4 24.5 1.4 1.4 2.5-2.8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const IconOrcamentos = ({ className }: IconProps) =>
  base(
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M9 9h1M9 13h6M9 17h6" />
    </>,
    className,
  );

export const IconClientes = ({ className }: IconProps) =>
  base(
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
    </>,
    className,
  );

export const IconProdutos = ({ className }: IconProps) =>
  base(
    <>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </>,
    className,
  );

export const IconConfig = ({ className }: IconProps) =>
  base(
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    className,
  );

export const IconPlus = ({ className }: IconProps) =>
  base(<path d="M5 12h14M12 5v14" />, className);

export const IconTrash = ({ className }: IconProps) =>
  base(
    <>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
    </>,
    className,
  );

export const IconEdit = ({ className }: IconProps) =>
  base(
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>,
    className,
  );

export const IconPrint = ({ className }: IconProps) =>
  base(
    <>
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6Z" />
    </>,
    className,
  );

export const IconDownload = ({ className }: IconProps) =>
  base(
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5M12 15V3" />
    </>,
    className,
  );

export const IconSearch = ({ className }: IconProps) =>
  base(
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>,
    className,
  );

export const IconClose = ({ className }: IconProps) =>
  base(<path d="M18 6 6 18M6 6l12 12" />, className);

export const IconChevron = ({ className }: IconProps) =>
  base(<path d="m9 18 6-6-6-6" />, className);

export const IconBuilding = ({ className }: IconProps) =>
  base(
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4" />
    </>,
    className,
  );

export const IconCheck = ({ className }: IconProps) =>
  base(<path d="M20 6 9 17l-5-5" />, className);

export const IconArrowLeft = ({ className }: IconProps) =>
  base(<path d="M19 12H5M12 19l-7-7 7-7" />, className);
