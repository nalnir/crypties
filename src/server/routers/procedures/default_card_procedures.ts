import { procedure } from "@/server/trpc";
import { z } from "zod";
import { default_card } from "../objects";
import DefaultCard, { DefaultCardDocument } from "@/pages/api/schemas/default_card_schema";
import { query } from "express";

export const createDefaultCard = procedure
    .input(default_card)
    .mutation(async (opts) => {
        const inputs = opts.input;
        return await DefaultCard.create(inputs);
    })

export const getAllDefaultCards = procedure
    .query(async (): Promise<DefaultCardDocument[] | null> => {
        return await DefaultCard.find({});
    })

export const publishUnpublishDefaultCard = procedure
    .input(default_card)
    .mutation(async (opts) => {
        const inputs = opts.input;
        if (inputs._id) {
            return await DefaultCard.updateOne({ _id: inputs._id }, { isPublished: !inputs.isPublished }, { new: true })
        }
    })