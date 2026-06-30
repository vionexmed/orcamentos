import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getEmpresas } from "@/lib/empresa";
import { dadosEmpresa } from "@/lib/empresa-payload";

export async function GET() {
  const empresas = await getEmpresas();
  return NextResponse.json(empresas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const empresa = await prisma.empresa.create({ data: dadosEmpresa(body) });
  return NextResponse.json(empresa, { status: 201 });
}
