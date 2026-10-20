-- CreateEnum
CREATE TYPE "AlbumCategory" AS ENUM ('Faith', 'Campus', 'Academics', 'Sports', 'Arts');

-- CreateEnum
CREATE TYPE "AlbumStatus" AS ENUM ('Published', 'Review', 'Archived');

-- CreateEnum
CREATE TYPE "InboxStatus" AS ENUM ('new', 'read', 'handled');

-- CreateTable
CREATE TABLE "albums" (
    "id" VARCHAR(32) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "category" "AlbumCategory" NOT NULL,
    "status" "AlbumStatus" NOT NULL DEFAULT 'Review',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_date" DATE NOT NULL,
    "location" VARCHAR(160) NOT NULL DEFAULT '',
    "description" VARCHAR(5000) NOT NULL DEFAULT '',
    "cover_src" TEXT,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "photos" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" VARCHAR(32) NOT NULL,
    "first_name" VARCHAR(80) NOT NULL,
    "last_name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40) NOT NULL DEFAULT '',
    "grade_level" VARCHAR(80) NOT NULL DEFAULT '',
    "message" VARCHAR(2000) NOT NULL DEFAULT '',
    "status" "InboxStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" VARCHAR(32) NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40) NOT NULL DEFAULT '',
    "subject" VARCHAR(120) NOT NULL DEFAULT '',
    "message" VARCHAR(4000) NOT NULL,
    "status" "InboxStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" VARCHAR(32) NOT NULL,
    "question" VARCHAR(240) NOT NULL,
    "answer" VARCHAR(2000) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phone_primary" VARCHAR(200) NOT NULL DEFAULT '',
    "phone_secondary" VARCHAR(200) NOT NULL DEFAULT '',
    "email_general" VARCHAR(160) NOT NULL DEFAULT '',
    "email_admissions" VARCHAR(160) NOT NULL DEFAULT '',
    "address_line1" VARCHAR(200) NOT NULL DEFAULT '',
    "address_line2" VARCHAR(200) NOT NULL DEFAULT '',
    "office_hours" VARCHAR(200) NOT NULL DEFAULT '',
    "map_url" VARCHAR(500) NOT NULL DEFAULT '',
    "socials" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" VARCHAR(32) NOT NULL,
    "username" VARCHAR(80) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "albums_status_created_at_idx" ON "albums"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "albums_category_status_created_at_idx" ON "albums"("category", "status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "inquiries_created_at_idx" ON "inquiries"("created_at" DESC);

-- CreateIndex
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages"("created_at" DESC);

-- CreateIndex
CREATE INDEX "faqs_position_idx" ON "faqs"("position");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
