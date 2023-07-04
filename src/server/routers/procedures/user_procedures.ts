import { z } from 'zod';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import { procedure } from '@/server/trpc';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import PlayerClass from '@/pages/api/schemas/class_schema';

export const getUser = procedure
  .input(
    z.object({
      walletAddress: z.string(),
    })
  )
  .mutation(async (opts) => {
    const db = await connectDB();
    const user = await User.findOne({
      walletAddress: opts.input.walletAddress,
    });
    return user;
  });

export const register = procedure
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
})

export const onboardUser = procedure
.input(
  z.object({
    walletAddress: z.string(),
    profilePicture: z.string(),
    generatedName: z.string(),
    playerName: z.string()
  })
)
.mutation(async (opts) => {
  const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress },
    { 
      profilePicture: opts.input.profilePicture,
      generatedName: opts.input.generatedName,
      playerName: opts.input.playerName,
      onboarded: true
    }, {new: true}
  )
  return updatedUser;
})

export const saveUserFantasyRace = procedure
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
})

export const getUserFantasyRace = procedure
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
})

export const saveUserPlayerClass = procedure
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
})

export const getUserClass = procedure
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
})

