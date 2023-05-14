import { z } from 'zod';
import { procedure, router } from '../trpc';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
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
        })
});
// export type definition of API
export type AppRouter = typeof appRouter;