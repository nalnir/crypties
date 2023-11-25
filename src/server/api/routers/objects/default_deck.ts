import { z } from "zod";

export const default_deck = z.object({
    _id: z.string().nullish(),
    walletAddress: z.string(),
    cards: z.array(z.object({
        amountOfCards: z.number(),
        cardId: z.string()
    })),
    deckName: z.string(),
    description: z.string(),
    image: z.string(),
    isPublished: z.boolean().nullish(),
    generation: z.number(),
    randomCards: z.array(z.object({
        cardType: z.string(),
        amountOfCards: z.number(),
        cardTypeId: z.string()
    })),
    price: z.number()
})