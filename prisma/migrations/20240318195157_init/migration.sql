/*
  Warnings:

  - You are about to drop the column `idRequisicao` on the `BemDireitoValorCCS` table. All the data in the column will be lost.
  - Added the required column `idRelacionamento` to the `BemDireitoValorCCS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BemDireitoValorCCS" DROP CONSTRAINT "BemDireitoValorCCS_idRequisicao_fkey";

-- AlterTable
ALTER TABLE "BemDireitoValorCCS" DROP COLUMN "idRequisicao",
ADD COLUMN     "idRelacionamento" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BemDireitoValorCCS" ADD CONSTRAINT "BemDireitoValorCCS_idRelacionamento_fkey" FOREIGN KEY ("idRelacionamento") REFERENCES "RelacionamentoCCS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
