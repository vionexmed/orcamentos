import type { CSSProperties } from "react";

/** Altura máxima da logo no cabeçalho — impede que aumentar a logo estique
 * a faixa verticalmente. A logo cresce na largura, não na altura. */
const ALTURA_MAX_FAIXA = 130;

/**
 * Estilo da logo no documento. O controle "tamanho" (logoAltura) define a
 * LARGURA da logo; a altura é limitada para que aumentar a logo deixe-a
 * maior (mais larga) sem esticar a faixa do cabeçalho para cima e para baixo.
 */
export function estiloLogo(
  logoAltura: number,
  opts?: { maxWidth?: string },
): CSSProperties {
  const v = Math.min(Math.max(Number(logoAltura) || 90, 40), 240);
  return {
    width: v * 2.5,
    maxWidth: opts?.maxWidth ?? "58%",
    maxHeight: ALTURA_MAX_FAIXA,
  };
}

/** Tamanho do placeholder "BRASÃO" (quando não há logo), também limitado. */
export function tamanhoPlaceholder(logoAltura: number): number {
  return Math.min(Math.max(Number(logoAltura) || 90, 40), ALTURA_MAX_FAIXA);
}
