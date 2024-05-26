"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class SlackRouter {
    constructor(ctx, engine) {
        this.ctx = ctx;
        this.engine = engine;
        this.postSeed = this.postSeed.bind(this);
        this.postAsk = this.postAsk.bind(this);
        this.postDelete = this.postDelete.bind(this);
    }
    registerRoutes() {
        const router = (0, express_1.Router)();
        router.post("/seed", this.postSeed);
        router.post("/ask", this.postAsk);
        router.post("/delete", this.postDelete);
        this.engine.use("/slash", router);
    }
    async postDelete(req, res) {
        const data = req.body;
        await this.ctx.queues.delete.add(`${data.channel_id}-${Date.now()}`, data);
        return res.send("Processing...");
    }
    async postSeed(req, res) {
        const data = req.body;
        await this.ctx.queues.seed.add(`${data.channel_id}-${Date.now()}`, data);
        return res.send("Processing...");
    }
    async postAsk(req, res) {
        const data = req.body;
        await this.ctx.queues.ask.add(`${data.channel_id}-${Date.now()}`, data);
        return res.send("Processing....");
    }
}
exports.default = SlackRouter;
