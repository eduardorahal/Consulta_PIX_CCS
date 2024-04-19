/*
  Warnings:

  - Added the required column `nomePessoa` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoPessoa` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelacionamentoCCS" ADD COLUMN     "nomePessoa" TEXT NOT NULL,
ADD COLUMN     "tipoPessoa" TEXT NOT NULL;
