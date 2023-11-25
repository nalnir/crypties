import DefaultDeck, { DefaultDeckDocument } from "@/pages/api/schemas/default_deck_schema";

import { default_deck } from "../objects/default_deck";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";

export const defaultDeckRouter = createTRPCRouter({
    getAllDefaultDecks: adminProcedure
        .input(z.object({
            onlyPublished: z.boolean().nullish()
        }))
        .query(async (opts): Promise<DefaultDeckDocument[]> => {
            const inputs = opts.input;
            const query = inputs.onlyPublished ? { isPublished: true } : {};
            const decks = await DefaultDeck.find(query);
            if (decks) {
                return decks
            }
            return [];
        }),

    createNewDefaultDeck: adminProcedure
        .input(default_deck)
        .mutation(async (opts) => {
            const inputs = opts.input;
            return await DefaultDeck.create(inputs)
        }),

    deleteDefaultDeck: adminProcedure
        .input(default_deck)
        .mutation(async (opts) => {
            const inputs = opts.input;
            if (inputs._id) {
                return await DefaultDeck.deleteOne({ _id: inputs._id })
            }
            return;
        }),

    publishUnpublishDeck: adminProcedure
        .input(default_deck)
        .mutation(async (opts) => {
            const inputs = opts.input;
            return await DefaultDeck.findOneAndUpdate({ _id: inputs._id }, { isPublished: !inputs.isPublished }, { new: true })
        }),

    updateDefaultDeck: adminProcedure
        .input(default_deck)
        .mutation(async (opts) => {
            const inputs = opts.input;
            const res = await DefaultDeck.findOneAndUpdate({ _id: inputs._id }, inputs, { new: true })
            return res;
        })
})