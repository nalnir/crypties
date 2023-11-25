import { z } from 'zod';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { authenticatedProcedure, createTRPCRouter } from '@/server/api/trpc';

export const playerClassRouter = createTRPCRouter({
  getOtherPlayerClasses: authenticatedProcedure
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
    }),

  bumpPlayedByAmoungPlayerClass: authenticatedProcedure
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
    }),


  getDefaultClasses: authenticatedProcedure
    .mutation(async () => {
      try {
        const defaultClasses: PlayerClassDocument[] | null = await PlayerClass.find({ default: true });
        return defaultClasses as PlayerClassDocument[];
      } catch (e: any) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      }
    }),
})