"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const deleteProcessor = (context) => {
    return async (job) => {
        try {
            const { response_url, team_id } = job.data;
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
            await context.vectorDb.namespace(team_id).deleteAll();
            await context.db.seedHistory.deleteMany({
                where: {
                    team_id,
                },
            });
            await axios_1.default.post(response_url, {
                text: "Deleted stored workspace data!",
            });
        }
        catch (e) {
            console.log(e);
        }
    };
};
exports.default = deleteProcessor;
