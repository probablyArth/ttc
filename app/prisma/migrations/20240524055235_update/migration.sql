/*
  Warnings:

  - Made the column `user_id` on table `PlatformIntegrationInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PlatformIntegrationInfo" DROP CONSTRAINT "PlatformIntegrationInfo_user_id_fkey";

-- AlterTable
ALTER TABLE "PlatformIntegrationInfo" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PlatformIntegrationInfo" ADD CONSTRAINT "PlatformIntegrationInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
