import { z } from 'zod';
import { procedure, router } from '../trpc';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import Race from '@/pages/api/schemas/race_schema';
export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

    register: procedure
      .input(
          z.object({
              text: z.string(),
          })
      )
      .query(async (opts) => {
          const db = await connectDB()
          const user = await User.create({ 
              walletAddress: opts.input.text
          })
          return user
      }),

    // HERO RACE PROCEDURES
    checkIfAlreadyCreated: procedure
      .input(
        z.object({
          creatorAddress: z.union([z.string(), z.null(), z.undefined()]),
        })
      )
      .mutation(async (opts) => {
        const walletAddress = opts.input.creatorAddress;
        if(!walletAddress) {
          return null;
        }

        const db = await connectDB()
        const race = await Race.findOne({ 
            creatorAddress: opts.input.creatorAddress
        })
        console.log('RACE: ', race)
        if(race) {
          return true;
        }
        return false
      }),
    
    checkIfRaceExists: procedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .query(async (opts) => {
        const db = await connectDB()
        const inputName = opts.input.name.replace(/\s/g, '');
        const race = await Race.findOne({ 
          name: { $regex: new RegExp(`^${inputName}$`, 'i') }
        })
        console.log('RACE: ', race)
        if(race) {
          return true;
        }
        return false
      }),

    createRace: procedure
      .input(
        z.object({
          name: z.string(),
        })
    )
    .query(async (opts) => {
        const db = await connectDB()
        const race = await Race.findOne({ 
            creatorAddress: opts.input.name
        })
        return race
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;