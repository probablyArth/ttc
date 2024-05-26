import { Pinecone } from "@pinecone-database/pinecone";
import getEnvVar from "env/index";

const newPineconeClient = async () => {
  const client = new Pinecone({
    apiKey: getEnvVar("PINECONE_API_KEY"),
  });
  const indexes = await client.listIndexes();
  if (!indexes.indexes?.find((index) => index.name == "slack")) {
    await client.createIndex({
      name: "slack",
      dimension: 1536,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
      waitUntilReady: true,
    });
    console.log("Index not found, created slack index");
  }
  return client.Index("slack");
};

export default newPineconeClient;
