-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "profileUrl" TEXT,
    "imageUrl" TEXT NOT NULL,
    "refresh_token" TEXT,
    "isTfaEnabled" BOOLEAN DEFAULT false,
    "tfaSecret" TEXT,
    "score" INTEGER DEFAULT 0,
    "status" TEXT,
    "wins" INTEGER DEFAULT 0,
    "loses" INTEGER DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_requests" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "snd_id" TEXT NOT NULL,
    "rcv_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("snd_id","rcv_id")
);

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
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "rid" TEXT NOT NULL,
    "msg" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
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
    "unmute_at" TIMESTAMP(3),

    CONSTRAINT "user_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "map" TEXT NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_games" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "gid" TEXT NOT NULL,
    "is_player" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "user_games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_rooms_uid_rid_key" ON "user_rooms"("uid", "rid");

-- CreateIndex
CREATE UNIQUE INDEX "user_games_uid_gid_key" ON "user_games"("uid", "gid");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_snd_id_fkey" FOREIGN KEY ("snd_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_rcv_id_fkey" FOREIGN KEY ("rcv_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_rid_fkey" FOREIGN KEY ("rid") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_rid_fkey" FOREIGN KEY ("rid") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_games" ADD CONSTRAINT "user_games_gid_fkey" FOREIGN KEY ("gid") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
