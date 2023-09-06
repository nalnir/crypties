import { connectDB } from "@/backend/connection";
import Generation from "@/pages/api/schemas/generation_schema";
import { adminProcedure } from "@/server/trpc";
import { z } from "zod";

export const establishNextGeneration = adminProcedure
    .input(
        z.object({
            generation: z.number()
        })
    )
    .mutation(async (opts) => {
        const db = await connectDB();
        const inputs = opts.input;
        const generation = await Generation.findOne({
            generation: inputs.generation,
        });
        console.log('generation: ', generation)

        if (generation) {
            throw new Error('Generation already exists');
        }

        const currentDate = new Date()
        const currentYear = currentDate.getFullYear();
        return await Generation.create({
            generation: inputs.generation,
            amountOfCardsForged: 0,
            year: currentYear
        })
    })

export const testAuth = adminProcedure
    .mutation(async (opts) => {
        const db = await connectDB();
        console.log('I WORK')
    })