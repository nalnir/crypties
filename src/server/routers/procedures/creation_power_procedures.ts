import { z } from 'zod';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import { procedure } from '@/server/trpc';
import Race from '@/pages/api/schemas/race_schema';
import PlayerClass from '@/pages/api/schemas/class_schema';

export const checkIfRaceAlreadyCreated = procedure
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
})

export const checkIfPlayerClassAlreadyCreated = procedure
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
})

export const checkIfRaceExists = procedure
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
})

export const checkIfPlayerClassExists = procedure
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
})

export const createRace = procedure
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
    if(!user.createTriesUsed) {
      const race = await Race.create({ 
        creatorAddress: inputs.creatorAddress,
        name: inputs.name,
        description: inputs.description,
        image: inputs.image,
      })
      return { success: true, message: "Successfully created the race", data: race }
    } else if(user.createTriesUsed < 3) {
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
})

export const setUseCreatePower = procedure
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
    })

    export const setCreateCycle = procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const currentDate = new Date();
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress }, { createNextCycle: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000)) }, { new: true })
      return updatedUser;
    })
    
    export const resetCreateTries = procedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress }, { createTries: 0, createNextCycle: null }, { new: true })
      return updatedUser;
    })
    
    export const bumpCreateTry = procedure
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
    })