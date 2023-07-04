import { z } from 'zod';
import { procedure } from '@/server/trpc';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';

export const getOtherFantasyRaces = procedure
  .input(
    z.object({
      page: z.number(),
      walletAddress: z.string(),
    })
  )
  .mutation(async (opts) => {
    try {
      const userRaces: RaceDocument[] | null = await Race.find({ creatorAddress: { $ne: opts.input.walletAddress } })
      return userRaces;
    } catch(e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const bumpPlayedByAmountFantasyRace = procedure
.input(
  z.object({
    fantasyRaceID: z.string(),
  })
)
.mutation(async (opts) => {
  try {
    const fantasyRace = await Race.updateOne({ _id: opts.input.fantasyRaceID }, { $inc: { playedByAmount: 1 } },)
    return fantasyRace;
  } catch(e: any) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
    } else {
      console.log(e.message);
    }
  }
})