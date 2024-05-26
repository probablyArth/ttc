import axios from "axios";
import { Job } from "bullmq";
import { IContext } from "interfaces/index";
import { CommandPayload } from "types/slack";
import { createEmbedding } from "utils/openai";

const seedProcessor = (context: IContext) => {
  return async (job: Job<CommandPayload>) => {
    const { channel_id, response_url, team_id } = job.data;
    try {
      const integration = await context.db.platformIntegrationInfo.findFirst({
        where: {
          platform: "SLACK",
          platform_id: team_id,
        },
      });
      if (!integration) {
        await axios.post(response_url, {
          text: "Workspace not registered on Talk To Channel!",
        });
        return;
      }

      const auth_details = integration.auth_details as { access_token: string };

      const latest = await context.slack.conversations.history({
        channel: channel_id,
        limit: 1,
        token: auth_details["access_token"],
      });
      if (!latest.ok) {
        console.log(latest);
        return;
      }
      if (latest.messages!.length < 1) {
        await axios.post(response_url, {
          text: "Nothing to seed!",
        });
        return;
      }
      const latestSlackMessageTs = latest.messages![0].ts!;
      const latestRecord = await context.db.seedHistory.findMany({
        select: {
          last_message_ts: true,
        },
        where: {
          channel_id,
          team_id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });
      if (
        latestRecord.length > 0 &&
        latestRecord[0].last_message_ts === latestSlackMessageTs
      ) {
        await axios.post(response_url, {
          text: "Channel already seeded!",
        });
        return;
      }
      let cursor = undefined;
      const messages: {
        text: string;
        ts: string;
        user_id: string;
        username: string;
      }[] = [];

      do {
        const res = await context.slack.conversations.history({
          channel: channel_id,
          cursor,
          oldest:
            latestRecord.length > 0
              ? latestRecord[0].last_message_ts
              : undefined,
          token: auth_details["access_token"],
        });
        cursor = res.response_metadata?.next_cursor;
        res.messages?.forEach((m) => {
          if (!m.subtype) {
            messages.push({
              text: m.text as string,
              ts: m.ts as string,
              user_id: m.user as string,
              username: m.username as string,
            });
          }
        });
      } while (cursor != null);

      const embeddings = await createEmbedding(messages.map((a) => a.text));
      const toUpsert: { values: number[]; id: string; metadata: any }[] = [];

      embeddings.data.forEach((e, i) => {
        toUpsert.push({
          values: e.embedding,
          id: `${i}-${Date.now()}`,
          metadata: {
            ts: messages[i].ts,
            text: messages[i].text,
            channel_id,
            user_id: messages[i].user_id,
            username: messages[i].username,
          },
        });
      });

      await context.vectorDb.namespace(team_id).upsert(toUpsert);
      await context.db.seedHistory.create({
        data: {
          channel_id,
          team_id,
          last_message_ts: latestSlackMessageTs,
        },
      });
      await axios.post(response_url, {
        text: "Channel seeded!",
      });
      return;
    } catch (e) {
      const error = e as unknown as any;
      if (error?.data.ok !== undefined && error?.data.ok === false) {
        switch (error.data.error) {
          case "invalid_auth":
            await context.db.platformIntegrationInfo.updateMany({
              where: {
                platform_id: team_id,
                platform: "SLACK",
              },
              data: {
                auth_status: "EXPIRED",
              },
            });
            await axios.post(response_url, {
              text: "Please refresh the access token!",
            });
            return;
          case "not_in_channel":
            await axios.post(response_url, {
              text: "Please add the bot to the channel!",
            });
            return;
        }
      }
      console.log(e);
    }
  };
};

export default seedProcessor;
