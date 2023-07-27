import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { Configuration, OpenAIApi } from "openai";
import { CreateGenerationResponseData, GeneratedImageVariationGenerics, LeonardoAPI } from '@/utils/types/leonardo';

const chatpgptConfig = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(chatpgptConfig);
const leonardo: LeonardoAPI = require('api')('@leonardoai/v1.0#28807z41owlgnis8jg');

// LEONARDO AI PROCEDURES

export const generateImages = procedure
  .input(
    z.object({
      prompt: z.string(),
      negative_prompt: z.string().nullish(),
      num_images: z.number().nullish(),
      modelId: z.string().nullish(),
      promptMagic: z.boolean().nullish()
    })
  )
  .mutation(async (opts) => {
    if (opts.input.num_images) {
      if (opts.input.num_images > 4) {
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
        promptMagic: opts.input.promptMagic ?? false,
        // width: 552, -> CARD DIMENSION
        // height: 256, -> CARD DIMENSION
        width: 1024,
        height: 1024,
        public: false,
      })
      const createGenerationResData: CreateGenerationResponseData = createGenerationRes.data
      const generationID = createGenerationResData.sdGenerationJob.generationId

      let getGenerationByIdRes = await leonardo.getGenerationById({ id: generationID })

      if (getGenerationByIdRes.data) {
        while (getGenerationByIdRes.data!.generations_by_pk!.status === 'PENDING') {
          // Delay 5 seconds before each new status check
          await new Promise(r => setTimeout(r, 5000));
          const newGetGenerationByIdRes = await leonardo.getGenerationById({ id: generationID });
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
    } catch (e) {
      console.log(e);
    }
  })

export const isFantasyRace = procedure
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
          { role: "user", content: `Only answer "true" or "false". ${opts.input.name} SOUNDS like a fantasy race name?` },
        ]
      });

      const message = completion.data.choices[0].message?.content
      return message;

    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const isPlayerClass = procedure
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
          { role: "user", content: `Only answer "true" or "false". ${opts.input.name} SOUNDS like a fantasy rpg class?` },
        ]
      });

      const message = completion.data.choices[0].message?.content
      return message;

    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const correctName = procedure
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
        "instruction": "IF NEEDED Separate the word correctly. Output ONLY corrected word. NO ESCAPE CHARACTERS, NO NEW LINES, NO CODE, TEXT ONLY",
        "temperature": 0,
      });

      console.log('completion: ', completion.data.usage)
      console.log('completion.data.choices: ', completion.data.choices)

      const message = completion.data.choices[0].text
      return message;

    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const generateDescription = procedure
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
          { role: "user", content: opts.input.prompt },
        ]
      });

      const message = completion.data.choices[0].message?.content
      return message;

    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })