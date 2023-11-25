import { z } from "zod";

export const user = z.object({
    _id: z.string(),
    walletAddress: z.string(),
    profilePicture: z.string().nullish(),
    alignment: z.string(),
    playerName: z.string(),
    generatedName: z.string(),
    playerClass: z.object({
        ref: z.string(),
        name: z.string()
    }),
    fantasyRace: z.object({
        ref: z.string(),
        name: z.string()
    })
})