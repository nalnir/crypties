import { z } from "zod";

export const deck = z.object({
    _id: z.string(),
    walletAddress: z.string(),
    cards: z.array(z.string()),
    deckName: z.string(),
})