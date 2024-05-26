import getEnvVar from "env/index";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: getEnvVar("OPENAI_API_KEY") });

export const createEmbedding = async (text: string | string[]) => {
  return await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });
};

export const prompt = async (context: string[], query: string) => {
  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `This is the relevant data you have about a slack workspace so far:
      ${context.toString()}
      Act as if you are the product manager and answer the queries asked by the user.`,
      },
      {
        role: "user",
        content: query,
      },
    ],
  });
};
