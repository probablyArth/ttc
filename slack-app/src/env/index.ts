import { z } from "zod";
import { config } from "dotenv";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  APP_PORT: z.string(),
  PINECONE_API_KEY: z.string(),
  OPENAI_API_KEY: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
});

export const parseEnv = (): void => {
  config();
  envSchema.parse(process.env);
};

const getEnvVar = (key: keyof z.infer<typeof envSchema>): string => {
  return process.env[key] as string;
};

export default getEnvVar;
