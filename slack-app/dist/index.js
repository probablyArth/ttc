"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importStar(require("./env"));
(0, env_1.parseEnv)();
const server_1 = __importDefault(require("./apps/server"));
const database_1 = __importDefault(require("./apps/database"));
const pinecone_1 = __importDefault(require("./apps/pinecone"));
const web_api_1 = require("@slack/web-api");
const bullmq_1 = require("bullmq");
const slack_router_1 = __importDefault(require("./routers/slack.router"));
const delete_1 = __importDefault(require("./processors/delete"));
const ask_1 = __importDefault(require("./processors/ask"));
const seed_1 = __importDefault(require("./processors/seed"));
const redisConnectionData = {
    host: (0, env_1.default)("REDIS_HOST"),
    port: Number((0, env_1.default)("REDIS_PORT")),
    username: (0, env_1.default)("REDIS_USERNAME"),
    password: (0, env_1.default)("REDIS_PASSWORD"),
};
const main = async () => {
    const pineconeClient = await (0, pinecone_1.default)();
    const seedQueue = new bullmq_1.Queue("seed", { connection: redisConnectionData });
    const askQueue = new bullmq_1.Queue("ask", { connection: redisConnectionData });
    const deleteQueue = new bullmq_1.Queue("delete", { connection: redisConnectionData });
    const context = {
        db: (0, database_1.default)(),
        vectorDb: pineconeClient,
        slack: new web_api_1.WebClient(),
        queues: {
            seed: seedQueue,
            ask: askQueue,
            delete: deleteQueue,
        },
    };
    const seedWorker = new bullmq_1.Worker("seed", (0, seed_1.default)(context), {
        connection: redisConnectionData,
    });
    const askWorker = new bullmq_1.Worker("ask", (0, ask_1.default)(context), {
        connection: redisConnectionData,
    });
    const deleteWorker = new bullmq_1.Worker("delete", (0, delete_1.default)(context), { connection: redisConnectionData });
    const server = new server_1.default(context);
    const slackRouter = new slack_router_1.default(context, server.engine);
    slackRouter.registerRoutes();
    server.engine.get("/", (_, res) => {
        res.json({ ok: true });
    });
    server.engine.listen((0, env_1.default)("APP_PORT"), () => {
        console.log(`Slack app listening at ${(0, env_1.default)("APP_PORT")}`);
    });
};
main();
