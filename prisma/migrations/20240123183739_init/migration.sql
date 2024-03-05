/*
  Warnings:

  - You are about to drop the column `vinculos` on the `RequisicaoPix` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RequisicaoPix" DROP COLUMN "vinculos";

-- CreateTable
CREATE TABLE "Vinculo" (
    "id" SERIAL NOT NULL,
    "vinculo" JSONB,
    "requisicaoId" INTEGER NOT NULL,

    CONSTRAINT "Vinculo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vinculo" ADD CONSTRAINT "Vinculo_requisicaoId_fkey" FOREIGN KEY ("requisicaoId") REFERENCES "RequisicaoPix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
