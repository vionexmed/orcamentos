import { prisma } from "@/lib/db";
import ProdutosManager from "@/components/ProdutosManager";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { descricao: "asc" },
  });
  return <ProdutosManager inicial={produtos} />;
}
