import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getEmpresa } from "@/lib/empresa";

export async function GET() {
  const empresa = await getEmpresa();
  return NextResponse.json(empresa);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  await getEmpresa(); // garante que a linha exista

  const empresa = await prisma.empresa.update({
    where: { id: 1 },
    data: {
      razaoSocial: String(body.razaoSocial ?? ""),
      nomeFantasia: String(body.nomeFantasia ?? ""),
      cnpj: String(body.cnpj ?? ""),
      inscricaoEstadual: String(body.inscricaoEstadual ?? ""),
      endereco: String(body.endereco ?? ""),
      cep: String(body.cep ?? ""),
      cidade: String(body.cidade ?? ""),
      uf: String(body.uf ?? ""),
      email: String(body.email ?? ""),
      telefone: String(body.telefone ?? ""),
      logoPath: String(body.logoPath ?? ""),
      logoAltura: Math.min(240, Math.max(40, Number(body.logoAltura) || 90)),
      condicaoPagamentoPadrao: String(body.condicaoPagamentoPadrao ?? ""),
      prazoEntregaPadrao: String(body.prazoEntregaPadrao ?? "Imediato"),
      validadeDiasPadrao: Number(body.validadeDiasPadrao) || 30,
    },
  });
  return NextResponse.json(empresa);
}
