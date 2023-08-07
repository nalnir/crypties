import { procedure } from "@/server/trpc";
import { z } from "zod";
import { original_card } from "../objects";
import DefaultCard, { DefaultCardDocument } from "@/pages/api/schemas/default_card_schema";
import { query } from "express";

export const createDefaultCard = procedure
    .input(original_card)
    .mutation(async (opts) => {
        const inputs = opts.input;
        return await DefaultCard.create(inputs);
    })

export const getAllDefaultCards = procedure
    .query(async (): Promise<DefaultCardDocument[] | null> => {
        return await DefaultCard.find({});
    })