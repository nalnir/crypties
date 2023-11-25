
import { z } from "zod";
import { default_card } from "../objects";
import DefaultCard, { DefaultCardDocument } from "@/pages/api/schemas/default_card_schema";
import { query } from "express";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const defaultCardRouter = createTRPCRouter({
    createDefaultCard: adminProcedure
        .input(default_card)
        .mutation(async (opts) => {
            const inputs = opts.input;
            return await DefaultCard.create(inputs);
        }),

    getAllDefaultCards: adminProcedure
        .query(async (): Promise<DefaultCardDocument[] | null> => {
            return await DefaultCard.find({});
        }),

    publishUnpublishDefaultCard: adminProcedure
        .input(default_card)
        .mutation(async (opts) => {
            const inputs = opts.input;
            if (inputs._id) {
                return await DefaultCard.updateOne({ _id: inputs._id }, { isPublished: !inputs.isPublished }, { new: true })
            }
        })
})