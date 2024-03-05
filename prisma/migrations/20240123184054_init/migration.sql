/*
  Warnings:

  - You are about to drop the `Vinculo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vinculo" DROP CONSTRAINT "Vinculo_requisicaoId_fkey";

-- AlterTable
ALTER TABLE "RequisicaoPix" ADD COLUMN     "vinculos" JSONB;

-- DropTable
DROP TABLE "Vinculo";
