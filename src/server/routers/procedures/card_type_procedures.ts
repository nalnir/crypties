import { connectDB } from "@/backend/connection";
import CardType, { CardTypeDocument } from "@/pages/api/schemas/card_type_schema";
import { procedure } from "@/server/trpc";
import { z } from "zod";

export const createCardType = procedure
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

export const getCardType = procedure
    .input(
        z.object({
            id: z.string()
        })
    )
    .query(async (opts) => {
        return await CardType.findOne({ _id: opts.input.id })
    })

export const getAllCardTypes = procedure
    .query(async (): Promise<CardTypeDocument[]> => {
        return await CardType.find({});
    })