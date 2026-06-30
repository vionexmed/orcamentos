import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const TAMANHO_MAX = 4 * 1024 * 1024; // 4 MB

const EXTENSAO: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado." },
      { status: 400 },
    );
  }
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato inválido. Use PNG, JPG, WEBP ou SVG." },
      { status: 400 },
    );
  }
  if (file.size > TAMANHO_MAX) {
    return NextResponse.json(
      { error: "Arquivo muito grande (máx. 4 MB)." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const nome = `logo-${Date.now()}.${EXTENSAO[file.type] ?? "png"}`;
  await writeFile(path.join(dir, nome), buffer);

  // Caminho público servido pelo Next a partir de /public
  const url = `/uploads/${nome}`;
  return NextResponse.json({ url });
}
