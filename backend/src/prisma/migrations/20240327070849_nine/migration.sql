/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `purchased_workouts_by_user` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `purchased_workouts_by_user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "purchased_workouts_by_user_balance_id_key";

-- AlterTable
ALTER TABLE "purchased_workouts_by_user" ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "purchased_workouts_by_user_id_key" ON "purchased_workouts_by_user"("id");
