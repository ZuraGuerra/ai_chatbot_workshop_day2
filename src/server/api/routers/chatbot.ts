import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chatbotRouter = createTRPCRouter({
  sendChatMessage: publicProcedure
    .input(
      z.object({
        content: z.string(),
        userEmail: z.string(),
        threadId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chatMessage = await ctx.db.chatMessage.create({
        data: {
          content: input.content,
          senderType: "USER",
          userEmail: input.userEmail,
          threadId: input.threadId,
        },
      });
      return { id: chatMessage.id };
    }),

  sendWelcomeMessage: publicProcedure
    .input(
      z.object({
        userName: z.string(),
        userEmail: z.string(),
        threadId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chatMessage = await ctx.db.chatMessage.create({
        data: {
          content: `Gracias por contactarnos, ${input.userName}. ¿Cómo puedo ayudarte?`,
          senderType: "SYSTEM",
          userEmail: input.userEmail,
          threadId: input.threadId,
        },
      });
      return { id: chatMessage.id };
    }),

  getThreadMessages: publicProcedure
    .input(
      z.object({
        threadId: z.string(),
        userEmail: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.chatMessage.findMany({
        where: {
          threadId: input.threadId,
          userEmail: input.userEmail,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return messages;
    }),
});
