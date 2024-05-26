import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { integrationsRouter } from "./routers/integration";
import { slackRouter } from "./routers/slack";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  integrations: integrationsRouter,
  slack: slackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
