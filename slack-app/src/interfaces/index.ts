import { Index } from "@pinecone-database/pinecone";
import { PrismaClient } from "@prisma/client";
import { WebClient } from "@slack/web-api";
import { Queue } from "bullmq";

export interface IContext {
  vectorDb: Index;
  db: PrismaClient;
  slack: WebClient;
  queues: {
    seed: Queue;
    ask: Queue;
    delete: Queue;
  };
}
