import { chatbotRouter } from "~/server/api/routers/chatbot";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { widgetAuthRouter } from "./routers/widgetAuth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chatbot: chatbotRouter,
  widgetAuth: widgetAuthRouter,
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
