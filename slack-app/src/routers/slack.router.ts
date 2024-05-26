import { IContext } from "interfaces/index";
import { Express, Request, Response, Router } from "express";
import { CommandPayload } from "types/slack";

export default class SlackRouter {
  ctx: IContext;
  engine: Express;

  constructor(ctx: IContext, engine: Express) {
    this.ctx = ctx;
    this.engine = engine;
    this.postSeed = this.postSeed.bind(this);
    this.postAsk = this.postAsk.bind(this);
    this.postDelete = this.postDelete.bind(this);
  }

  registerRoutes() {
    const router = Router();
    router.post("/seed", this.postSeed);
    router.post("/ask", this.postAsk);
    router.post("/delete", this.postDelete);
    this.engine.use("/slash", router);
  }

  async postDelete(req: Request, res: Response) {
    const data = req.body as CommandPayload;
    await this.ctx.queues.delete.add(`${data.channel_id}-${Date.now()}`, data);
    return res.send("Processing...");
  }

  async postSeed(req: Request, res: Response) {
    const data = req.body as CommandPayload;
    await this.ctx.queues.seed.add(`${data.channel_id}-${Date.now()}`, data);
    return res.send("Processing...");
  }

  async postAsk(req: Request, res: Response) {
    const data = req.body as CommandPayload;
    await this.ctx.queues.ask.add(`${data.channel_id}-${Date.now()}`, data);
    return res.send("Processing....");
  }
}
