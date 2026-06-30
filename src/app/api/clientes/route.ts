import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { razaoSocial: "asc" },
  });
  return NextResponse.json(clientes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const razaoSocial = String(body.razaoSocial ?? "").trim();
  if (!razaoSocial) {
    return NextResponse.json(
      { error: "Razão social é obrigatória." },
      { status: 400 },
    );
  }
  const cliente = await prisma.cliente.create({
    data: {
      razaoSocial,
      cnpj: String(body.cnpj ?? ""),
      email: String(body.email ?? ""),
      telefone: String(body.telefone ?? ""),
      endereco: String(body.endereco ?? ""),
      cidade: String(body.cidade ?? ""),
      uf: String(body.uf ?? ""),
      cep: String(body.cep ?? ""),
      observacao: String(body.observacao ?? ""),
    },
  });
  return NextResponse.json(cliente, { status: 201 });
}
