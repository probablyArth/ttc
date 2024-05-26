import { $Enums } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const integrationsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ platform: z.nativeEnum($Enums.Platform) }))
    .query(({ ctx, input }) => {
      return ctx.db.platformIntegrationInfo.findFirst({
        where: {
          user_id: ctx.session.user.id,
          platform: input.platform,
        },
      });
    }),
});
