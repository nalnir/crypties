import { z } from 'zod';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { authenticatedProcedure, createTRPCRouter } from '@/server/api/trpc';

export const fantasyRaceRouter = createTRPCRouter({
  getDefaultFantasyRaces: authenticatedProcedure
    .mutation(async () => {
      // try {
      //   const defaultRaces: RaceDocument[] | null = await Race.find({ default: true });
      //   return defaultRaces as RaceDocument[];
      // } catch (e: any) {
      //   if (e.response) {
      //     console.log(e.response.status);
      //     console.log(e.response.data);
      //   } else {
      //     console.log(e.message);
      //   }
      // }

      return 'getDefaultFantasyRaces'
    }),

  getOtherFantasyRaces: authenticatedProcedure
    .input(
      z.object({
        page: z.number(),
        walletAddress: z.string(),
      })
    )
    .mutation(async (opts) => {
      // try {
      //   const userRaces: RaceDocument[] | null = await Race.find({ creatorAddress: { $ne: opts.input.walletAddress }, default: false })
      //   return userRaces;
      // } catch (e: any) {
      //   if (e.response) {
      //     console.log(e.response.status);
      //     console.log(e.response.data);
      //   } else {
      //     console.log(e.message);
      //   }
      // }

      return 'getOtherFantasyRaces'
    }),

  bumpPlayedByAmountFantasyRace: authenticatedProcedure
    .input(
      z.object({
        fantasyRaceID: z.string(),
      })
    )
    .mutation(async (opts) => {
      // try {
      //   const fantasyRace = await Race.updateOne({ _id: opts.input.fantasyRaceID }, { $inc: { playedByAmount: 1 } },)
      //   return fantasyRace;
      // } catch (e: any) {
      //   if (e.response) {
      //     console.log(e.response.status);
      //     console.log(e.response.data);
      //   } else {
      //     console.log(e.message);
      //   }
      // }

      return 'bumpPlayedByAmountFantasyRace';
    })
})