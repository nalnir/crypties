import { connectDB } from "@/backend/connection";
import AuthToken from "@/pages/api/schemas/auth_token_schema";
import { procedure } from "@/server/trpc"
import e from "cors";
import { z } from "zod"


export const getAuthToken = procedure
    .input(
    z.object({
        walletAddress: z.string(),
    })
    )
    .mutation(async (opts) => {
        const db = await connectDB();
        const authToken = await AuthToken.findOne({
            userWalletAddress: opts.input.walletAddress,
        });
        return authToken;
    })

export const registerAuthToken = procedure
    .input(
    z.object({
        walletAddress: z.string(),
        userId: z.string()
    })
    )
    .mutation(async (opts) => {
        const db = await connectDB();
        const inputs = opts.input;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 14);

        const authToken = await AuthToken.create({
            userWalletAddress: inputs.walletAddress,
            validUntil: expirationDate,
            userId: inputs.userId
        });
        return authToken;
    })

export const invalidateAuthToken = procedure
.input(
    z.object({
        walletAddress: z.string(),
    })
    )
    .mutation(async (opts) => {
        const db = await connectDB();
        const authToken = await AuthToken.findByIdAndRemove({
            userWalletAddress: opts.input.walletAddress,
        });
        return authToken;
    })