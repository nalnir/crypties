import { z } from 'zod';
import { procedure, router } from '../trpc';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import { REST } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import { CreateGenerationResponseData, GeneratedImageVariationGenerics, GetGenerationByIdResponseData, LeonardoAPI } from '@/utils/types/leonardo';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? '');
const chatpgptConfig = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(chatpgptConfig);
const leonardo: LeonardoAPI = require('api')('@leonardoai/v1.0#28807z41owlgnis8jg');

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
            walletAddress: opts.input.walletAddress,
            hasCreatePower: true
        })
        return user
    }),

  // HERO CREATION PROCEDURES
  checkIfRaceAlreadyCreated: procedure
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
  
    checkIfPlayerClassAlreadyCreated: procedure
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
      const race = await PlayerClass.findOne({ 
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
      const race = await Race.findOne({ 
        nameCombinations: { $in: [new RegExp(`^${opts.input.name}$`, 'i')] }
      })
      if(race) {
        return true;
      }
      return false
    }),

    checkIfPlayerClassExists: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const db = await connectDB()
      const playerClass = await PlayerClass.findOne({ 
        nameCombinations: { $in: [new RegExp(`^${opts.input.name}$`, 'i')] }
      })
      if(playerClass) {
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
        if(!user.createTries) {
          const race = await Race.create({ 
            creatorAddress: inputs.creatorAddress,
            name: inputs.name,
            description: inputs.description,
            image: inputs.image,
          })
          return { success: true, message: "Successfully created the race", data: race }
        } else if(user.createTries < 3) {
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
        prompt: z.string(),
        negative_prompt: z.string().nullish(),
        num_images: z.number().nullish(),
        modelId: z.string().nullish()
      })
    )
    .mutation(async (opts) => {
      if(opts.input.num_images) {
        if(opts.input.num_images > 4) {
          throw new Error("Maximum 4 images");
        }
      }
      try {
        await leonardo.auth(process.env.LEONARDO_API_KEY ?? '');
        const createGenerationRes = await leonardo.createGeneration({
          prompt: opts.input.prompt,
          negative_prompt: opts.input.negative_prompt ?? '',
          modelId: opts.input.modelId ?? 'b7aa9939-abed-4d4e-96c4-140b8c65dd92',
          sd_version: 'v1_5',
          num_images: opts.input.num_images ?? 2,
          // width: 552, -> CARD DIMENSION
          // height: 256, -> CARD DIMENSION
          width: 1024,
          height: 1024,
          public: false,
        })
        const createGenerationResData: CreateGenerationResponseData = createGenerationRes.data
        const generationID = createGenerationResData.sdGenerationJob.generationId

        let getGenerationByIdRes = await leonardo.getGenerationById({id: generationID})
        
        if(getGenerationByIdRes.data) {
          while(getGenerationByIdRes.data!.generations_by_pk!.status === 'PENDING') {
            // Delay 5 seconds before each new status check
            await new Promise(r => setTimeout(r, 5000));
            const newGetGenerationByIdRes = await leonardo.getGenerationById({id: generationID});
            getGenerationByIdRes = newGetGenerationByIdRes
          }
        } else {
          throw new Error("Response is null");
        }

  
      if (getGenerationByIdRes.data!.generations_by_pk!.status === 'FAILED') {
        throw new Error("Generation failed");
      }
      const images: GeneratedImageVariationGenerics[] = getGenerationByIdRes.data!.generations_by_pk!.generated_images
      return images;
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
            // { role: "system", content: "" },
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

  isPlayerClass: procedure
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
            { role: "user", content: `Only answer "true" or "false". ${opts.input.name} SOUNDS like a fantasy rpg class?`},
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

  correctName: procedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation(async (opts) => {
      try {
        const completion = await openai.createEdit({
          "model": "text-davinci-edit-001",
          "input": opts.input.name,
          "instruction": "Separate the word correctly. Output ONLY corrected word. NO CODE, TEXT ONLY",
          "temperature": 0,
        });

        console.log('completion: ', completion.data.usage)

        const message = completion.data.choices[0].text
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

  setCreateCycle: procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const currentDate = new Date();
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress }, { createNextCycle: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)) }, { new: true })
      return updatedUser;
    }),
  
  resetCreateTries: procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress }, { createTries: 0, createNextCycle: null }, { new: true })
      return updatedUser;
    }),

  bumpCreateTry: procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress },
        { $inc: { createTries: 1 } }, { new: true }
      )
      return updatedUser;
    }),

  setUseCreatePower: procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress },
        { hasCreatePower: false }
      )
      return updatedUser;
    }),

  generateDescription: procedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: opts.input.prompt},
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

  saveUserFantasyRace: procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        creatorAddress: z.string(),
        image: z.string(),
        nameCombinations: z.array(z.string())
      })
    )
    .mutation(async (opts) => {
      console.log('nameCombinations: ', opts.input.nameCombinations)
      try {
        const newRace = await Race.create(opts.input)
        return newRace;
      } catch(e: any) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      }
    }),
  
  getUserFantasyRace: procedure
  .input(
    z.object({
      walletAddress: z.string(),
    })
  )
  .mutation(async (opts) => {
    try {
      const userRace: RaceDocument | null = await Race.findOne({ creatorAddress: opts.input.walletAddress })
      return userRace;
    } catch(e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  }),

  getOtherFantasyRaces: procedure
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
  }),

  // PLAYER CLASS PROCEDURES

  saveUserPlayerClass: procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        creatorAddress: z.string(),
        image: z.string(),
        nameCombinations: z.array(z.string())
      })
    )
    .mutation(async (opts) => {
      console.log('nameCombinations: ', opts.input.nameCombinations)
      try {
        const newPlayerClass = await PlayerClass.create(opts.input)
        return newPlayerClass;
      } catch(e: any) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      }
    }),

  getUserClass: procedure
    .input(
      z.object({
        walletAddress: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const userPlaerClass: RaceDocument | null = await PlayerClass.findOne({ creatorAddress: opts.input.walletAddress })
        return userPlaerClass;
      } catch(e: any) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      }
    }),

  getOtherPlayerClasses: procedure
    .input(
      z.object({
        page: z.number(),
        walletAddress: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const userClasses: PlayerClassDocument[] | null = await PlayerClass.find({ creatorAddress: { $ne: opts.input.walletAddress } })
        return userClasses;
      } catch(e: any) {
        if (e.response) {
          console.log(e.response.status);
          console.log(e.response.data);
        } else {
          console.log(e.message);
        }
      }
    }),

});

export type AppRouter = typeof appRouter;