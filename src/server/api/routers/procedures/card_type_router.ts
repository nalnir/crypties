import CardType, { CardTypeDocument } from "@/pages/api/schemas/card_type_schema";

import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";

export const cardTypeRouter = createTRPCRouter({
    createCardType: authenticatedProcedure
        .input(
            z.object({
                name: z.string(),
                power: z.number(),
            })
        )
        .mutation(async (opts) => {
            // const inputs = opts.input;

            // const cardTypeExists = await CardType.findOne({
            //     name: inputs.name
            // })

            // if (cardTypeExists) {
            //     throw new Error('Card type exists');
            // }

            // const authToken = await CardType.create({
            //     name: inputs.name,
            //     power: inputs.power
            // });
            // return authToken;

            return 'createCardType'
        }),

    getCardType: authenticatedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async (opts) => {
            return await CardType.findOne({ _id: opts.input.id })
        }),

    getAllCardTypes: authenticatedProcedure
        .query(async (): Promise<CardTypeDocument[]> => {
            const allCards: CardTypeDocument[] = await CardType.find({});
            return allCards ?? [];
        })
})