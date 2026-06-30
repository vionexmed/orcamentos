import { getEmpresas } from "@/lib/empresa";
import ConfiguracoesManager from "@/components/ConfiguracoesManager";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const empresas = await getEmpresas();
  return <ConfiguracoesManager empresasIniciais={empresas} />;
}
