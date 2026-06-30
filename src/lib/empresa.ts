import { prisma } from "./db";

/** Lista todas as empresas emitentes cadastradas (mais recentes por último). */
export async function getEmpresas() {
  return prisma.empresa.findMany({ orderBy: { id: "asc" } });
}

/**
 * Retorna a empresa "padrão" (a primeira cadastrada). Se nenhuma existir,
 * cria uma vazia para que as telas de configuração tenham o que editar.
 */
export async function getEmpresaPadrao() {
  const primeira = await prisma.empresa.findFirst({ orderBy: { id: "asc" } });
  if (primeira) return primeira;
  return prisma.empresa.create({ data: {} });
}
