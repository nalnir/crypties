import { z } from 'zod';
import { publicProcedure } from '@/server/trpc';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';

export const getOtherPlayerClasses = publicProcedure
  .input(
    z.object({
      page: z.number(),
      walletAddress: z.string(),
    })
  )
  .mutation(async (opts) => {
    try {
      const userClasses: PlayerClassDocument[] | null = await PlayerClass.find({ creatorAddress: { $ne: opts.input.walletAddress }, default: false })
      return userClasses;
    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const bumpPlayedByAmoungPlayerClass = publicProcedure
  .input(
    z.object({
      playerClassID: z.string(),
    })
  )
  .mutation(async (opts) => {
    try {
      const playerClass = await PlayerClass.updateOne({ _id: opts.input.playerClassID }, { $inc: { playedByAmount: 1 } },)
      return playerClass;
    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })