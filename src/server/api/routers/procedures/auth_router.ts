import AuthToken from "@/pages/api/schemas/auth_token_schema";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import e from "cors";
import { z } from "zod"

export const authRouter = createTRPCRouter({
    getAuthToken: publicProcedure
        .input(
            z.object({
                walletAddress: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.authtokens.findFirst({
                where: {
                    userWalletAddress: input.walletAddress

                },
                orderBy: {
                    createdAt: 'desc',
                },
            })
            // const authToken = await AuthToken.findOne({
            //     userWalletAddress: opts.input.walletAddress,
            // });
            // return authToken;
        }),

    registerAuthToken: publicProcedure
        .input(
            z.object({
                walletAddress: z.string(),
                userId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            // const inputs = opts.input;

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 14);
            return await ctx.prisma.authtokens.create({
                data: {
                    userWalletAddress: input.walletAddress,
                    validUntil: expirationDate,
                    userId: input.userId
                }
            })

            // const authToken = await AuthToken.create({
            //     userWalletAddress: inputs.walletAddress,
            //     validUntil: expirationDate,
            //     userId: inputs.userId
            // });
            // return authToken;
        }),

    invalidateAuthToken: publicProcedure
        .input(
            z.object({
                walletAddress: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // const authToken = await AuthToken.findOneAndRemove({
            //     userWalletAddress: opts.input.walletAddress,
            // });
            // return authToken;
            const currentDate = new Date();
            return await ctx.prisma.authtokens.deleteMany({
                where: {
                    userWalletAddress: input.walletAddress,
                    validUntil: {
                        lt: currentDate,
                    },
                }
            })
        })
})