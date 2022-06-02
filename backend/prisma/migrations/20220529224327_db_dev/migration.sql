/*
  Warnings:

  - You are about to drop the column `chat_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_chats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rid` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_chats" DROP CONSTRAINT "user_chats_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "user_chats" DROP CONSTRAINT "user_chats_user_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "chat_id",
DROP COLUMN "user_id",
ADD COLUMN     "rid" TEXT NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL;

-- DropTable
DROP TABLE "chats";

-- DropTable
DROP TABLE "user_chats";

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "is_channel" BOOLEAN NOT NULL,
    "type" TEXT DEFAULT E'PUBLIC',
    "password" TEXT,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rooms" (
    "id" TEXT NOT NULL,
    "joined_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "rid" TEXT NOT NULL,
    "is_owner" BOOLEAN NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "is_banned" BOOLEAN NOT NULL,
    "is_muted" BOOLEAN NOT NULL,

    CONSTRAINT "user_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_rooms_uid_rid_key" ON "user_rooms"("uid", "rid");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_rid_fkey" FOREIGN KEY ("rid") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_rid_fkey" FOREIGN KEY ("rid") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
