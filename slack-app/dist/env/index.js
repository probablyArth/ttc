"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnv = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string(),
    APP_PORT: zod_1.z.string(),
    PINECONE_API_KEY: zod_1.z.string(),
    OPENAI_API_KEY: zod_1.z.string(),
    REDIS_HOST: zod_1.z.string(),
    REDIS_PORT: zod_1.z.string(),
    REDIS_USERNAME: zod_1.z.string(),
    REDIS_PASSWORD: zod_1.z.string(),
});
const parseEnv = () => {
    (0, dotenv_1.config)();
    envSchema.parse(process.env);
};
exports.parseEnv = parseEnv;
const getEnvVar = (key) => {
    return process.env[key];
};
exports.default = getEnvVar;
