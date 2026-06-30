import { prisma } from "@/lib/db";
import ClientesManager from "@/components/ClientesManager";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { razaoSocial: "asc" },
  });
  return <ClientesManager inicial={clientes} />;
}
