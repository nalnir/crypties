import { z } from "zod";

export const default_card = z.object({
    _id: z.string().nullish(),
    name: z.string(),
    description: z.string(),
    image_url: z.string(),
    metadata: z.object({
        health: z.number(),
        attackPower: z.number(),
        special: z.string().nullish(),
        creatorPlayerName: z.string(),
        creatorAddress: z.string(),
        creatorLoreName: z.string(),
        cardType: z.string(),
        cardTypeId: z.string(),
        collection: z.string().nullish(),
        generation: z.number(),
        ipfsCID: z.string().nullish(),
        imageId: z.string(),
        default: z.boolean()
    }),
    isPublished: z.boolean().nullish()
})