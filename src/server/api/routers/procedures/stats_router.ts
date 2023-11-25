import PlayerClass from "@/pages/api/schemas/class_schema";
import Race from "@/pages/api/schemas/race_schema";
import User from "@/pages/api/schemas/user_schema";
import { z } from "zod";
import { game_stats } from "../objects";
import GameStats from "@/pages/api/schemas/game_stats_schema";
import { createTRPCRouter, publicProcedure, authenticatedProcedure } from "@/server/api/trpc";

export const statsRouter = createTRPCRouter({
    getRaceStat: authenticatedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async (opts) => {
            // return await Race.findOne({
            //     _id: opts.input.id
            // });
            return 'getRaceStat'
        }),

    getClassStat: authenticatedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async (opts) => {
            // return await PlayerClass.findOne({
            //     _id: opts.input.id
            // });
            return 'getClassStat'
        }),

    getAlignmentStat: authenticatedProcedure
        .mutation(async () => {
            // const lightAlignmentAmount = await User.countDocuments({ alignment: 'light' });
            // const darknessAlignmentAmount = await User.countDocuments({ alignment: 'darkness' });
            // return {
            //     lightAlignmentAmount: lightAlignmentAmount,
            //     darknessAlignmentAmount: darknessAlignmentAmount
            // }
            return 'getAlignmentStat'
        }),

    saveGameStats: authenticatedProcedure
        .input(game_stats)
        .mutation(async (opts) => {
            // const inputs = opts.input
            // console.log('inputs: ', inputs)
            // return await GameStats.create(inputs)
            return 'saveGameStats'
        })
})