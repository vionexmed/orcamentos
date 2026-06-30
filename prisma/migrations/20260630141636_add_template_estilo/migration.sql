-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" INTEGER NOT NULL,
    "condicaoPagamento" TEXT NOT NULL DEFAULT '',
    "prazoEntrega" TEXT NOT NULL DEFAULT 'Imediato',
    "validadeProposta" DATETIME NOT NULL,
    "observacoes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    "template" TEXT NOT NULL DEFAULT 'CLASSICO',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Orcamento" ("atualizadoEm", "clienteId", "condicaoPagamento", "criadoEm", "data", "id", "numero", "observacoes", "prazoEntrega", "status", "validadeProposta") SELECT "atualizadoEm", "clienteId", "condicaoPagamento", "criadoEm", "data", "id", "numero", "observacoes", "prazoEntrega", "status", "validadeProposta" FROM "Orcamento";
DROP TABLE "Orcamento";
ALTER TABLE "new_Orcamento" RENAME TO "Orcamento";
CREATE UNIQUE INDEX "Orcamento_numero_key" ON "Orcamento"("numero");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
