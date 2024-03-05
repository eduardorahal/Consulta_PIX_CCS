/*
  Warnings:

  - Added the required column `responsavelAtivo` to the `RelacionamentoCCS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelacionamentoCCS" ADD COLUMN     "responsavelAtivo" TEXT NOT NULL;
