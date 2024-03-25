/*
  Warnings:

  - You are about to drop the column `cpfCnpj` on the `VinculadosBDVCCS` table. All the data in the column will be lost.
  - Added the required column `idPessoa` to the `VinculadosBDVCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VinculadosBDVCCS" DROP COLUMN "cpfCnpj",
ADD COLUMN     "idPessoa" TEXT NOT NULL;
