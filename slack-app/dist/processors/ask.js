"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const openai_1 = require("../utils/openai");
const askProcesser = (context) => {
    return async (job) => {
        const { channel_id, response_url, team_id, text } = job.data;
        try {
            if (!text) {
                await axios_1.default.post(response_url, {
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
                await axios_1.default.post(response_url, {
                    text: "Workspace not registered on Talk To Channel!",
                });
                return;
            }
            const { namespaces } = await context.vectorDb.describeIndexStats();
            if (!namespaces?.hasOwnProperty(team_id)) {
                await axios_1.default.post(response_url, {
                    text: "Channel not seeded!",
                });
                return;
            }
            const queryEmbedding = await (0, openai_1.createEmbedding)(text);
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
                await axios_1.default.post(response_url, {
                    text: "Channel not seeded!",
                });
                return;
            }
            const dataStore = searchedEmbeddings.matches.map((a) => {
                if (!a.metadata)
                    return "";
                return a.metadata["text"];
            });
            const res = await (0, openai_1.prompt)(dataStore, text);
            let completion = "";
            res.choices.forEach((e) => {
                completion += e.message.content + "\n";
            });
            await axios_1.default.post(response_url, {
                text: completion,
                mrkdwn: true,
            });
            return;
        }
        catch (e) {
            console.log(e);
        }
    };
};
exports.default = askProcesser;
