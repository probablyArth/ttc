-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('SLACK');

-- CreateTable
CREATE TABLE "PlatformIntegrationInfo" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "platform_id" TEXT NOT NULL,
    "auth_details" JSONB NOT NULL,

    CONSTRAINT "PlatformIntegrationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformIntegrationInfo_platform_platform_id_key" ON "PlatformIntegrationInfo"("platform", "platform_id");
