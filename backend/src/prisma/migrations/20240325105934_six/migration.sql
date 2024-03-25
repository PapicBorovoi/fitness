/*
  Warnings:

  - You are about to drop the column `balance_id` on the `purchased_workouts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workout_id]` on the table `purchased_workouts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "purchased_workouts" DROP CONSTRAINT "purchased_workouts_balance_id_fkey";

-- DropIndex
DROP INDEX "purchased_workouts_balance_id_key";

-- AlterTable
ALTER TABLE "purchased_workouts" DROP COLUMN "balance_id";

-- CreateTable
CREATE TABLE "purchased_workouts_by_user" (
    "workout_id" TEXT NOT NULL,
    "balance_id" TEXT NOT NULL,
    "num" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "purchased_workouts_by_user_balance_id_key" ON "purchased_workouts_by_user"("balance_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchased_workouts_workout_id_key" ON "purchased_workouts"("workout_id");

-- AddForeignKey
ALTER TABLE "purchased_workouts_by_user" ADD CONSTRAINT "purchased_workouts_by_user_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_workouts_by_user" ADD CONSTRAINT "purchased_workouts_by_user_balance_id_fkey" FOREIGN KEY ("balance_id") REFERENCES "users_balances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
