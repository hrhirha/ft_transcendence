-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "imageUrl" TEXT NOT NULL,
    "isTfaEnabled" BOOLEAN DEFAULT false,
    "tfaSecret" TEXT DEFAULT E'',
    "score" INTEGER DEFAULT 0,
    "status" TEXT DEFAULT E'OFFLINE',
    "wins" INTEGER DEFAULT 0,
    "loses" INTEGER DEFAULT 0,
    "rank_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ranks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT E'Wood',
    "icon" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "require" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
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
    "lst_msg" TEXT DEFAULT E'',
    "lst_msg_ts" TIMESTAMP(3),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "rid" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rooms" (
    "id" TEXT NOT NULL,
    "joined_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "rid" TEXT NOT NULL,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "unmute_at" TIMESTAMP(3),
    "unread" INTEGER DEFAULT 0,

    CONSTRAINT "user_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "map" TEXT NOT NULL,
    "is_ultimate" BOOLEAN NOT NULL DEFAULT false,
    "ongoing" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_games" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uid" TEXT NOT NULL,
    "gid" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_bans" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "rid" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),

    CONSTRAINT "user_bans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_isTfaEnabled_key" ON "users"("id", "isTfaEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_title_key" ON "ranks"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_icon_key" ON "ranks"("icon");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_field_key" ON "ranks"("field");

-- CreateIndex
CREATE UNIQUE INDEX "user_rooms_uid_rid_key" ON "user_rooms"("uid", "rid");

-- CreateIndex
CREATE UNIQUE INDEX "user_games_uid_gid_key" ON "user_games"("uid", "gid");

-- CreateIndex
CREATE UNIQUE INDEX "user_bans_id_uid_rid_key" ON "user_bans"("id", "uid", "rid");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "ranks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "user_bans" ADD CONSTRAINT "user_bans_uid_rid_fkey" FOREIGN KEY ("uid", "rid") REFERENCES "user_rooms"("uid", "rid") ON DELETE CASCADE ON UPDATE CASCADE;
