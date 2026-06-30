import { NextRequest, NextResponse } from "next/server";

const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const TAMANHO_MAX = 2 * 1024 * 1024; // 2 MB

/**
 * Recebe a logo e devolve um data URI (base64) para ser salvo no banco
 * (campo logoPath). Não grava em disco — ambientes serverless como o Vercel
 * têm filesystem somente leitura, então persistir arquivos em /public falha.
 * Como a logo é pequena e fica embutida no próprio documento, o data URI é a
 * forma mais simples e portátil de armazená-la.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato inválido. Use PNG, JPG, WEBP ou SVG." },
      { status: 400 },
    );
  }
  if (file.size > TAMANHO_MAX) {
    return NextResponse.json(
      { error: "Arquivo muito grande (máx. 2 MB)." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const url = `data:${file.type};base64,${base64}`;

  return NextResponse.json({ url });
}
