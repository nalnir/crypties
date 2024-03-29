import { connectDB } from "@/backend/connection";
import PlayerClass from "@/pages/api/schemas/class_schema";
import Race from "@/pages/api/schemas/race_schema";
import User from "@/pages/api/schemas/user_schema";
import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { game_stats } from "../objects";
import GameStats from "@/pages/api/schemas/game_stats_schema";

export const getRaceStat = publicProcedure
    .input(
        z.object({
            id: z.string(),
        })
    )
    .mutation(async (opts) => {
        const db = await connectDB();
        return await Race.findOne({
            _id: opts.input.id
        });
    });

export const getClassStat = publicProcedure
    .input(
        z.object({
            id: z.string(),
        })
    )
    .mutation(async (opts) => {
        const db = await connectDB();
        return await PlayerClass.findOne({
            _id: opts.input.id
        });
    });

export const getAlignmentStat = publicProcedure
    .mutation(async () => {
        const db = await connectDB();
        const lightAlignmentAmount = await User.countDocuments({ alignment: 'light' });
        const darknessAlignmentAmount = await User.countDocuments({ alignment: 'darkness' });
        return {
            lightAlignmentAmount: lightAlignmentAmount,
            darknessAlignmentAmount: darknessAlignmentAmount
        }
    });

export const saveGameStats = publicProcedure
    .input(game_stats)
    .mutation(async (opts) => {
        const db = await connectDB();
        const inputs = opts.input
        console.log('inputs: ', inputs)
        return await GameStats.create(inputs)
    })