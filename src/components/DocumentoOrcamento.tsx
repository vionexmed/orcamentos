import TemplateClassico from "./templates/TemplateClassico";
import TemplateBoxed from "./templates/TemplateBoxed";
import { normalizarEstilo, type DocumentoProps } from "@/lib/estilos";

/** Renderiza o documento do orçamento no estilo (template) escolhido. */
export default function DocumentoOrcamento({ orcamento, empresa }: DocumentoProps) {
  const estilo = normalizarEstilo(orcamento.template);

  if (estilo === "CLASSICO") {
    return <TemplateClassico orcamento={orcamento} empresa={empresa} />;
  }
  if (estilo === "MODERNO") {
    return <TemplateBoxed orcamento={orcamento} empresa={empresa} variante="MODERNO" />;
  }
  return <TemplateBoxed orcamento={orcamento} empresa={empresa} variante="FISCAL" />;
}
