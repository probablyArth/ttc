import axios from "axios";
import { Job } from "bullmq";
import { IContext } from "interfaces/index";
import { CommandPayload } from "types/slack";

const deleteProcessor = (context: IContext) => {
  return async (job: Job<CommandPayload>) => {
    try {
      const { response_url, team_id, channel_id, text } = job.data;
      console.log(
        `/delete channel_id: ${channel_id} team_id: ${team_id} text: ${text}`
      );
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
      await context.vectorDb.namespace(team_id).deleteAll();
      await context.db.seedHistory.deleteMany({
        where: {
          team_id,
        },
      });
      await axios.post(response_url, {
        text: "Deleted stored workspace data!",
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export default deleteProcessor;
