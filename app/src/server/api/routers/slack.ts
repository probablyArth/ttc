import { z } from "zod";
import { env } from "~/env";
import { sign, verify } from "jsonwebtoken";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { SLACK_BOT_SCOPES } from "~/server/config/slack";
import { slackClient } from "~/server/utils/slack";
import { TRPCError } from "@trpc/server";
import { $Enums, type Prisma } from "@prisma/client";
import { type OauthV2AccessResponse } from "@slack/web-api";

type StatePayload = { userId: string };

export const slackRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const slackOauthBaseUrl = "https://slack.com/oauth/v2/authorize";
    const token = sign({ userId: ctx.session.user.id }, env.STATE_SECRET, {
      expiresIn: "5m",
    });
    const params = new URLSearchParams({
      scope: SLACK_BOT_SCOPES.join(","),
      redirect_uri: env.SLACK_REDIRECT_URI,
      client_id: env.SLACK_CLIENT_ID,
      state: token,
    });
    return `${slackOauthBaseUrl}?${params.toString()}`;
  }),
  post: protectedProcedure
    .input(z.object({ code: z.string(), state: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let payload: StatePayload;
      try {
        payload = verify(input.state, env.STATE_SECRET) as StatePayload;
      } catch (e) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (payload.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const tokens = await slackClient.oauth.v2
        .access({
          client_id: env.SLACK_CLIENT_ID,
          client_secret: env.SLACK_CLIENT_SECRET,
          code: input.code,
          grant_type: "authorization_code",
        })
        .catch((error) => {
          const e = error as unknown as { message: string };
          return { ok: false, error: e.message };
        });
      console.log({ slackResponse: tokens });
      if (!tokens.ok)
        throw new TRPCError({ code: "BAD_REQUEST", message: tokens.error });

      const successTokens = tokens as OauthV2AccessResponse;

      const where = {
        platform_id: successTokens.team!.id,
        platform: $Enums.Platform.SLACK,
        user_id: ctx.session.user.id,
      };

      const existing = await ctx.db.platformIntegrationInfo.findFirst({
        where,
      });

      if (existing == null) {
        await ctx.db.platformIntegrationInfo.create({
          data: {
            auth_details: {
              access_token: successTokens.access_token,
              team: successTokens.team,
            } as unknown as Prisma.JsonObject,
            platform: "SLACK",
            platform_id: successTokens.team!.id!,
            user_id: ctx.session.user.id,
          },
        });
      } else {
        await ctx.db.platformIntegrationInfo.update({
          where: {
            id: existing.id,
          },
          data: {
            auth_details: {
              access_token: successTokens.access_token!,
              team: successTokens.team,
            } as unknown as Prisma.JsonObject,
            auth_status: "WORKING",
          },
        });
      }
      return { team: successTokens.team! };
    }),
});
