import getEnvVar, { parseEnv } from "./env";
parseEnv();

import Server from "apps/server";
import newDbClient from "apps/database";
import newPineconeClient from "apps/pinecone";
import { IContext } from "./interfaces";
import { WebClient } from "@slack/web-api";
import { Queue, Worker } from "bullmq";
import SlackRouter from "routers/slack.router";
import { CommandPayload } from "types/slack";
import deleteProcessor from "processors/delete";
import askProcesser from "processors/ask";
import seedProcessor from "processors/seed";
import { type Index } from "@pinecone-database/pinecone";

const redisConnectionData = {
  host: getEnvVar("REDIS_HOST"),
  port: Number(getEnvVar("REDIS_PORT")),
  username: getEnvVar("REDIS_USERNAME"),
  password: getEnvVar("REDIS_PASSWORD"),
};

const main = async () => {
  const pineconeClient = await newPineconeClient();

  const seedQueue = new Queue("seed", { connection: redisConnectionData });
  const askQueue = new Queue("ask", { connection: redisConnectionData });
  const deleteQueue = new Queue("delete", { connection: redisConnectionData });

  const context: IContext = {
    db: newDbClient(),
    vectorDb: pineconeClient as unknown as Index,
    slack: new WebClient(),
    queues: {
      seed: seedQueue,
      ask: askQueue,
      delete: deleteQueue,
    },
  };

  const seedWorker = new Worker<CommandPayload>(
    "seed",
    seedProcessor(context),
    {
      connection: redisConnectionData,
    }
  );

  const askWorker = new Worker<CommandPayload>("ask", askProcesser(context), {
    connection: redisConnectionData,
  });

  const deleteWorker = new Worker<CommandPayload>(
    "delete",
    deleteProcessor(context),
    { connection: redisConnectionData }
  );

  const server = new Server(context);

  const slackRouter = new SlackRouter(context, server.engine);
  slackRouter.registerRoutes();

  server.engine.get("/", (_, res) => {
    res.json({ ok: true });
  });

  server.engine.listen(getEnvVar("APP_PORT"), () => {
    console.log(`Slack app listening at ${getEnvVar("APP_PORT")}`);
  });
};

main();
