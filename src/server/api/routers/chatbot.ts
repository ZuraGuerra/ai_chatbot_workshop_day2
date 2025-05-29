import { threadId } from "worker_threads";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PlombService } from "~/server/services/plombService";

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
      const userChatMessage = await ctx.db.chatMessage.create({
        data: {
          content: input.content,
          senderType: "USER",
          userEmail: input.userEmail,
          threadId: input.threadId,
        },
      });

      const plombService = new PlombService();

      try {
        const chatbotResponse = await plombService.processMessage(
          input.threadId,
          input.userEmail,
          input.content,
        );

        await ctx.db.chatMessage.create({
          data: {
            content: chatbotResponse,
            senderType: "BOT",
            userEmail: input.userEmail,
            threadId: input.threadId,
          },
        });
      } catch (error) {
        await ctx.db.chatMessage.create({
          data: {
            content: "Por favor, intenta enviar de nuevo tu mensaje.",
            senderType: "SYSTEM",
            userEmail: input.userEmail,
            threadId: input.threadId,
          },
        });
      }

      return { id: userChatMessage.id };
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
