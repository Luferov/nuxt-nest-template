-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('UNKNOWN', 'MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "avatar" TEXT,
    "last_name" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "sir_name" VARCHAR(50),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "birthday" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "key" VARCHAR(512) NOT NULL,
    "bucket" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_email_idx" ON "users"("username", "email");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
