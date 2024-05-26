-- AlterTable
ALTER TABLE "PlatformIntegrationInfo" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "PlatformIntegrationInfo" ADD CONSTRAINT "PlatformIntegrationInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
