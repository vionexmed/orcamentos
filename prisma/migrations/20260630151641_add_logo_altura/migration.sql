-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "razaoSocial" TEXT NOT NULL DEFAULT '',
    "nomeFantasia" TEXT NOT NULL DEFAULT '',
    "cnpj" TEXT NOT NULL DEFAULT '',
    "inscricaoEstadual" TEXT NOT NULL DEFAULT '',
    "endereco" TEXT NOT NULL DEFAULT '',
    "cep" TEXT NOT NULL DEFAULT '',
    "cidade" TEXT NOT NULL DEFAULT '',
    "uf" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "telefone" TEXT NOT NULL DEFAULT '',
    "logoPath" TEXT NOT NULL DEFAULT '',
    "logoAltura" INTEGER NOT NULL DEFAULT 90,
    "condicaoPagamentoPadrao" TEXT NOT NULL DEFAULT '',
    "prazoEntregaPadrao" TEXT NOT NULL DEFAULT 'Imediato',
    "validadeDiasPadrao" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Empresa" ("cep", "cidade", "cnpj", "condicaoPagamentoPadrao", "email", "endereco", "id", "inscricaoEstadual", "logoPath", "nomeFantasia", "prazoEntregaPadrao", "razaoSocial", "telefone", "uf", "updatedAt", "validadeDiasPadrao") SELECT "cep", "cidade", "cnpj", "condicaoPagamentoPadrao", "email", "endereco", "id", "inscricaoEstadual", "logoPath", "nomeFantasia", "prazoEntregaPadrao", "razaoSocial", "telefone", "uf", "updatedAt", "validadeDiasPadrao" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
