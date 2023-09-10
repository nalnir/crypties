import { z } from "zod";

export const game_stats = z.object({
    _id: z.string().nullish(),
    players: z.object({
        winner: z.string(),
        looser: z.string()
    }),
    decks: z.object({
        winner: z.string(),
        looser: z.string()
    }),
    game: z.enum(['FINISHED', 'DISCONNECTED', 'FORFEITED'])
})