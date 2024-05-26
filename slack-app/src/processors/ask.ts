import axios from "axios";
import { Job } from "bullmq";
import { IContext } from "interfaces/index";
import { CommandPayload } from "types/slack";
import { createEmbedding, prompt } from "utils/openai";

const askProcesser = (context: IContext) => {
  return async (job: Job<CommandPayload>) => {
    const { channel_id, response_url, team_id, text } = job.data;

    try {
      if (!text) {
        await axios.post(response_url, {
          text: "Empty query",
        });
        return;
      }
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

      const { namespaces } = await context.vectorDb.describeIndexStats();
      if (!namespaces?.hasOwnProperty(team_id)) {
        await axios.post(response_url, {
          text: "Channel not seeded!",
        });
        return;
      }
      const queryEmbedding = await createEmbedding(text);

      const searchedEmbeddings = await context.vectorDb
        .namespace(team_id)
        .query({
          topK: 15,
          vector: queryEmbedding.data[0].embedding,
          includeMetadata: true,
          filter: {
            channel_id,
          },
        });

      if (searchedEmbeddings.matches.length === 0) {
        await axios.post(response_url, {
          text: "Channel not seeded!",
        });
        return;
      }
      const dataStore = searchedEmbeddings.matches.map((a) => {
        if (!a.metadata) return "";
        return a.metadata["text"] as string;
      });
      const res = await prompt(dataStore, text);

      let completion = "";
      res.choices.forEach((e) => {
        completion += e.message.content + "\n";
      });

      await axios.post(response_url, {
        text: completion,
        mrkdwn: true,
      });
      return;
    } catch (e) {
      console.log(e);
    }
  };
};

export default askProcesser;
