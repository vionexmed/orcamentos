import { prisma } from "./db";

/** Retorna a (única) linha de Empresa, criando-a vazia se ainda não existir. */
export async function getEmpresa() {
  const existente = await prisma.empresa.findUnique({ where: { id: 1 } });
  if (existente) return existente;
  return prisma.empresa.create({ data: { id: 1 } });
}
