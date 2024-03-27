-- DropForeignKey
ALTER TABLE "users_balances" DROP CONSTRAINT "users_balances_user_id_fkey";

-- AddForeignKey
ALTER TABLE "users_balances" ADD CONSTRAINT "users_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
