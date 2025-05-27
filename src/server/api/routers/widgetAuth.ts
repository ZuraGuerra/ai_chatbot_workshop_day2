import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const widgetAuthRouter = createTRPCRouter({
  verifyWidgetCredentials: publicProcedure
    .input(
      z.object({
        token: z.string(),
        allowedDomain: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const chatWidgetToken = await ctx.db.chatWidgetToken.findFirst({
        where: {
          token: input.token,
          allowedDomain: input.allowedDomain,
        },
      });

      if (!chatWidgetToken) {
        throw new Error("Invalid widget token");
      }

      return {
        isValid: true,
      };
    }),

  createWidgetToken: publicProcedure
    .input(
      z.object({
        allowedDomain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const token = nanoid(32);

      const chatWidgetToken = await ctx.db.chatWidgetToken.create({
        data: {
          token,
          allowedDomain: input.allowedDomain,
        },
      });

      return chatWidgetToken;
    }),
});
