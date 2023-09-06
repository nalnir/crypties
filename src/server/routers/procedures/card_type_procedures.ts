import { connectDB } from "@/backend/connection";
import CardType, { CardTypeDocument } from "@/pages/api/schemas/card_type_schema";
import { publicProcedure } from "@/server/trpc";
import { z } from "zod";

export const createCardType = publicProcedure
    .input(
        z.object({
            name: z.string(),
            power: z.number(),
        })
    )
    .mutation(async (opts) => {
        const inputs = opts.input;
        const db = await connectDB();

        const cardTypeExists = await CardType.findOne({
            name: inputs.name
        })

        if (cardTypeExists) {
            throw new Error('Card type exists');
        }

        const authToken = await CardType.create({
            name: inputs.name,
            power: inputs.power
        });
        return authToken;
    })

export const getCardType = publicProcedure
    .input(
        z.object({
            id: z.string()
        })
    )
    .query(async (opts) => {
        return await CardType.findOne({ _id: opts.input.id })
    })

export const getAllCardTypes = publicProcedure
    .query(async (): Promise<CardTypeDocument[]> => {
        const allCards: CardTypeDocument[] = await CardType.find({});
        return allCards ?? [];
    })