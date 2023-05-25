import { z } from 'zod';
import { procedure, router } from '../trpc';
import { connectDB } from '@/backend/connection';
import User, { UserDocument } from '@/pages/api/schemas/user_schema';
import Race from '@/pages/api/schemas/race_schema';
import { REST, Routes } from 'discord.js';
import midjourney from "midjourney-client";
import { bufferToBlob, downloadImageAsBuffer } from '../helper_functions';
import { Configuration, OpenAIApi } from "openai";

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? '');
const chatpgptConfig = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(chatpgptConfig);

export const appRouter = router({

  getUser: procedure
    .input(
        z.object({
            walletAddress: z.string(),
        })
    )
    .mutation(async (opts) => {
        const db = await connectDB()
        const user = await User.findOne({ 
            walletAddress: opts.input.walletAddress
        })
        return user
    }),

  register: procedure
    .input(
        z.object({
          walletAddress: z.string(),
        })
    )
    .mutation(async (opts) => {
        const db = await connectDB()
        const user = await User.create({ 
            walletAddress: opts.input.walletAddress
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
    .mutation(async (opts) => {
      const db = await connectDB()
      const inputName = opts.input.name.replace(/\s/g, '');
      const race = await Race.findOne({ 
        name: { $regex: new RegExp(`^${inputName}$`, 'i') }
      })
      if(race) {
        return true;
      }
      return false
    }),

  createRace: procedure
    .input(
      z.object({
        name: z.string(),
        creatorAddress: z.string(),
        description: z.string(),
        image: z.string()
      })
  )
  .mutation(async (opts) => {
      const db = await connectDB()
      const inputs = opts.input
      const user = await User.findOne({
        walletAddress: inputs.creatorAddress
      })
      if(user) {
        if(!user.createFantasyRaceTries) {
          const race = await Race.create({ 
            creatorAddress: inputs.creatorAddress,
            name: inputs.name,
            description: inputs.description,
            image: inputs.image,
          })
          return { success: true, message: "Successfully created the race", data: race }
        } else if(user.createFantasyRaceTries < 5) {
          const race = await Race.create({ 
            creatorAddress: inputs.creatorAddress,
            name: inputs.name,
            description: inputs.description,
            image: inputs.image,
          })
          return { success: true, message: "Successfully created the race", data: race }
        } else {
          return { success: false, message: "User used all his tries", data: null }
        }
      }
      return { success: false, message: "Could not find the user", data: null }
  }),

  generateImages: procedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .mutation(async (opts) => {
      try {
        // const res = await midjourney(`mdjrny-v4 style, ${opts.input.text}, portrait, pixar style.`, { num_inference_steps: 1 })
        const res = await midjourney("mdjrny-v4 style, cat, portrait, pixar style.")
        console.log('res: ', res)
        const bufferData = await downloadImageAsBuffer(res[0])
        if(bufferData){
          const buffer = Buffer.from(bufferData);
          const blob = new Blob([bufferData], { type: 'image/png' });
          return blob
        }
        // return await downloadImageAsBuffer('https://replicate.delivery/pbxt/AMwf4l9efFPLQJcupiWPAmxK5fQye5HZVPwodkmXHJjP3fdPE/out-0.png')
      } catch(e) {
        console.log(e);
      }
    }),

  isFantasyRace: procedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation(async (opts) => {
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You respond with a boolean indicating whether the name is a fantasy race name (true/false)." },
            { role: "user", content: `Only answer "true" or "false". ${opts.input.name} SOUNDS like a fantasy race name?`},
          ]
        });

        const message = completion.data.choices[0].message?.content
        return message;

      } catch(e: any) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      }
    }),

  userHasTries: procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const currentUser = await User.findOne({
        walletAddress: opts.input.walletAddress
      })

      if(currentUser) {
        if(currentUser.createFantasyRaceNextCycle) {
          const currentDate = new Date();
          if(currentUser.createFantasyRaceNextCycle < currentDate) {
            await User.findOneAndUpdate({ walletAddress: currentUser.walletAddress }, { createFantasyRaceTries: 0 })
          }
        }
        return { success: true, message: "User has 5 tries" }
      }

      return { success: false, message: "Could not find the user"  }
    }),

  bumpCreateFantasyRaceTry: procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = User.findOneAndUpdate({ walletAddress: opts.input.walletAddress },
        { $inc: { createFantasyRaceTries: 1 } },
      )
    })
});

export type AppRouter = typeof appRouter;