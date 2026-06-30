import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dados de exemplo (baseados no modelo enviado) só para testar rapidamente.
// Você pode editar tudo em Configurações / Clientes / Produtos.
async function main() {
  // Empresa (emitente) de exemplo. Esses dados aparecem apenas no documento
  // do orçamento (o restante do sistema é neutro). Edite em Configurações.
  const empresa = await prisma.empresa.findUnique({ where: { id: 1 } });
  if (!empresa) {
    await prisma.empresa.create({
      data: {
        id: 1,
        razaoSocial: "EFFORT PRODUTOS PARA A SAÚDE LTDA",
        nomeFantasia: "EFFORT Produtos Hospitalares",
        cnpj: "37.323.224/0001-44",
        inscricaoEstadual: "636.418.000.112",
        endereco: "Rua Alegre, 470 - Conj. 504 A - Santa Paula",
        cep: "09550-250",
        cidade: "São Caetano do Sul",
        uf: "SP",
        condicaoPagamentoPadrao: "027 - 10 x",
        prazoEntregaPadrao: "Imediato",
        validadeDiasPadrao: 30,
      },
    });
    console.log("✓ Empresa de exemplo criada");
  }

  // Cliente de exemplo
  const cliente = await prisma.cliente.findFirst({
    where: { razaoSocial: "CLINICA ARD SERVICOS MEDICOS LTDA" },
  });
  const clienteId =
    cliente?.id ??
    (
      await prisma.cliente.create({
        data: {
          razaoSocial: "CLINICA ARD SERVICOS MEDICOS LTDA",
          cnpj: "",
          cidade: "",
          uf: "",
        },
      })
    ).id;
  console.log("✓ Cliente de exemplo pronto");

  // Produto de exemplo
  let produto = await prisma.produto.findFirst({ where: { codigo: "300121" } });
  if (!produto) {
    produto = await prisma.produto.create({
      data: {
        codigo: "300121",
        descricao: "LIKAWAVE VARIO 3I",
        regAnvisa: "82155249003",
        marca: "LIKAWAVE",
        unidade: "UN",
        precoUnitario: 148000,
      },
    });
    console.log("✓ Produto de exemplo criado");
  }

  // Orçamento de exemplo, apenas se ainda não houver nenhum.
  const totalOrcamentos = await prisma.orcamento.count();
  if (totalOrcamentos === 0) {
    const validade = new Date();
    validade.setDate(validade.getDate() + 30);
    await prisma.orcamento.create({
      data: {
        numero: 113,
        clienteId,
        condicaoPagamento: "027 - 10 x",
        prazoEntrega: "Imediato",
        validadeProposta: validade,
        status: "ABERTO",
        itens: {
          create: [
            {
              produtoId: produto.id,
              codigo: "300121",
              descricao: "LIKAWAVE VARIO 3I",
              regAnvisa: "82155249003",
              marca: "LIKAWAVE",
              unidade: "UN",
              quantidade: 1,
              valorUnitario: 148000,
              ordem: 0,
            },
          ],
        },
      },
    });
    console.log("✓ Orçamento de exemplo Nº 113 criado");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
