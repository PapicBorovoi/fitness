-- DropForeignKey
ALTER TABLE "workouts" DROP CONSTRAINT "workouts_coach_id_fkey";

-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "coachRoleUserId" TEXT;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_coachRoleUserId_fkey" FOREIGN KEY ("coachRoleUserId") REFERENCES "coaches_role"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
