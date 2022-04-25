-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_snd_id_fkey" FOREIGN KEY ("snd_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_rcv_id_fkey" FOREIGN KEY ("rcv_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
