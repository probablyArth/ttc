import Express, { Express as IExpress } from "express";
import { IContext } from "interfaces";
import morgan from "morgan";

export default class Server {
  engine: IExpress;
  context: IContext;
  constructor(context: IContext) {
    this.engine = Express();
    this.engine.use(morgan("tiny"));
    this.engine.use(Express.json());
    this.engine.use(Express.urlencoded({ extended: true }));
    this.context = context;
  }
}
