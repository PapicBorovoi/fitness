-- CreateEnum
CREATE TYPE "Status" AS ENUM ('accepted', 'refected', 'for_consideration');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('visa', 'mir', 'umoney');

-- CreateEnum
CREATE TYPE "WorkoutTime" AS ENUM ('extra_fast', 'fast', 'medium', 'long');

-- CreateEnum
CREATE TYPE "TargetGender" AS ENUM ('for_male', 'for_female', 'for_both');

-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('yoga', 'running', 'boxing', 'stretching', 'crossfit', 'aerobics', 'pilates');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('newbie', 'average', 'professional');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'not_specified');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'coach');

-- CreateEnum
CREATE TYPE "MetroStation" AS ENUM ('pionerskaya', 'petrogradskaya', 'udelnaya', 'zvezdnaya', 'sportivnaya');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar_uri" TEXT NOT NULL DEFAULT 'no-avatar.png',
    "password_hash" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'not_specified',
    "birthday" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "description" TEXT NOT NULL,
    "location" "MetroStation" NOT NULL,
    "background_uri" TEXT NOT NULL DEFAULT 'default-background.png',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_role" (
    "user_id" TEXT NOT NULL,
    "skill" "Skill" NOT NULL DEFAULT 'newbie',
    "workout_type" "WorkoutType" NOT NULL,
    "workout_time" "WorkoutTime" NOT NULL,
    "calories_to_burn" INTEGER NOT NULL,
    "calories_to_spend" INTEGER NOT NULL,
    "is_ready_for_workout" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_role_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "coaches_role" (
    "user_id" TEXT NOT NULL,
    "skill" "Skill" NOT NULL DEFAULT 'professional',
    "workout_type" "WorkoutType" NOT NULL,
    "sertifikat_uri" TEXT NOT NULL,
    "merits" TEXT NOT NULL,
    "is_ready_to_coach" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "background_uri" TEXT NOT NULL DEFAULT 'default_background.png',
    "skill" "Skill" NOT NULL,
    "workout_type" "WorkoutType" NOT NULL,
    "workout_time" "WorkoutTime" NOT NULL,
    "price" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "gender" "TargetGender" NOT NULL DEFAULT 'for_both',
    "video_uri" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "coach_id" TEXT NOT NULL,
    "is_special_offer" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "workout_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_id" TEXT NOT NULL,
    "price_per_workout" INTEGER NOT NULL,
    "full_price" INTEGER NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL
);

-- CreateTable
CREATE TABLE "personal_workouts" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'for_consideration'
);

-- CreateTable
CREATE TABLE "notifies" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "users_balances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "purchased_workouts" (
    "workout_id" TEXT NOT NULL,
    "balance_id" TEXT NOT NULL,
    "num" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFriends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_role_user_id_key" ON "users_role"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_role_user_id_key" ON "coaches_role"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workouts_id_key" ON "workouts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_id_key" ON "reviews"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_workouts_id_key" ON "personal_workouts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "notifies_id_key" ON "notifies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_balances_id_key" ON "users_balances"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_balances_user_id_key" ON "users_balances"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchased_workouts_balance_id_key" ON "purchased_workouts"("balance_id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON "_UserFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriends_B_index" ON "_UserFriends"("B");

-- AddForeignKey
ALTER TABLE "users_role" ADD CONSTRAINT "users_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches_role" ADD CONSTRAINT "coaches_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches_role"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_workouts" ADD CONSTRAINT "personal_workouts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_workouts" ADD CONSTRAINT "personal_workouts_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifies" ADD CONSTRAINT "notifies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_balances" ADD CONSTRAINT "users_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_role"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_workouts" ADD CONSTRAINT "purchased_workouts_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_workouts" ADD CONSTRAINT "purchased_workouts_balance_id_fkey" FOREIGN KEY ("balance_id") REFERENCES "users_balances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "users_role"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriends" ADD CONSTRAINT "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "users_role"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
