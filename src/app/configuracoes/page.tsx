import { getEmpresa } from "@/lib/empresa";
import ConfiguracoesForm from "@/components/ConfiguracoesForm";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const empresa = await getEmpresa();
  return <ConfiguracoesForm inicial={empresa} />;
}
