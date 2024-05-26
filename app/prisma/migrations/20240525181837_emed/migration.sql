-- CreateEnum
CREATE TYPE "AuthStatus" AS ENUM ('WORKING', 'EXPIRED');

-- AlterTable
ALTER TABLE "PlatformIntegrationInfo" ADD COLUMN     "auth_status" "AuthStatus" NOT NULL DEFAULT 'WORKING';

-- CreateTable
CREATE TABLE "SeedHistory" (
    "id" TEXT NOT NULL,
    "last_message_ts" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedHistory_pkey" PRIMARY KEY ("id")
);
