import { z } from 'zod';
import connectDB from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';

import Race from '@/pages/api/schemas/race_schema';
import PlayerClass from '@/pages/api/schemas/class_schema';
import { authenticatedProcedure, createTRPCRouter } from '@/server/api/trpc';

export const creationPowerRouter = createTRPCRouter({
  checkIfRaceAlreadyCreated: authenticatedProcedure
    .input(
      z.object({
        creatorAddress: z.union([z.string(), z.null(), z.undefined()]),
      })
    )
    .mutation(async (opts) => {
      const walletAddress = opts.input.creatorAddress;
      if (!walletAddress) {
        return null;
      }
      const db = await connectDB()
      const race = await Race.findOne({
        creatorAddress: opts.input.creatorAddress
      })
      if (race) {
        return true;
      }
      return false
    }),

  checkIfPlayerClassAlreadyCreated: authenticatedProcedure
    .input(
      z.object({
        creatorAddress: z.union([z.string(), z.null(), z.undefined()]),
      })
    )
    .mutation(async (opts) => {
      const walletAddress = opts.input.creatorAddress;
      if (!walletAddress) {
        return null;
      }
      const db = await connectDB()
      const race = await PlayerClass.findOne({
        creatorAddress: opts.input.creatorAddress
      })
      if (race) {
        return true;
      }
      return false
    }),

  checkIfRaceExists: authenticatedProcedure
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
      if (race) {
        return true;
      }
      return false
    }),

  checkIfPlayerClassExists: authenticatedProcedure
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
      if (playerClass) {
        return true;
      }
      return false
    }),

  createRace: authenticatedProcedure
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
      if (user) {
        if (!user.createTriesUsed) {
          const race = await Race.create({
            creatorAddress: inputs.creatorAddress,
            name: inputs.name,
            description: inputs.description,
            image: inputs.image,
          })
          return { success: true, message: "Successfully created the race", data: race }
        } else if (user.createTriesUsed < 3) {
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

  setUseCreatePower: authenticatedProcedure
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

  setCreateCycle: authenticatedProcedure
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

  resetCreateTries: authenticatedProcedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress }, { createTriesUsed: 0, createNextCycle: null }, { new: true })
      return updatedUser;
    }),

  bumpCreateTry: authenticatedProcedure
    .input(
      z.object({
        walletAddress: z.string()
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await User.findOneAndUpdate({ walletAddress: opts.input.walletAddress },
        { $inc: { createTriesUsed: 1 } }, { new: true }
      )
      return updatedUser;
    })
})