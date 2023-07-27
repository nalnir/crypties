import { z } from 'zod';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import { procedure } from '@/server/trpc';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { waitForTransaction } from '@/server/helper_functions';
import { Wallet } from '@ethersproject/wallet';
import { AlchemyProvider } from '@ethersproject/providers';
const mongoose = require('mongoose');

const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 ?? ''
const ETH_NETWORK = process.env.ETH_NETWORK ?? 'goerli';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';
const IMX_COLLECTION_ADDRESS = process.env.IMX_COLLECTION_ADDRESS ?? '';

const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

export const getUser = procedure
  .input(
    z.object({
      walletAddress: z.string(),
    })
  )
  .mutation(async (opts) => {
    console.log('HELLO')
    const db = await connectDB();
    console.log('CONNECTED')
    console.log('FETCHING USER!')
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
      playerName: z.string(),
      playerClass: z.object({
        id: z.string(),
        name: z.string()
      }),
      fantasyRace: z.object({
        id: z.string(),
        name: z.string()
      }),
      alignment: z.enum(['light', 'darkness'])
    })
  )
  .mutation(async (opts) => {
    const inputs = opts.input;
    const fantasyRaceId = new mongoose.Types.ObjectId(inputs.fantasyRace.id)
    const playerClassId = new mongoose.Types.ObjectId(inputs.playerClass.id)
    const updatedUser = await User.findOneAndUpdate({ walletAddress: inputs.walletAddress },
      {
        profilePicture: inputs.profilePicture,
        generatedName: inputs.generatedName,
        playerName: inputs.playerName,
        onboarded: true,
        playerClass: {
          ref: playerClassId,
          name: inputs.playerClass.name
        },
        fantasyRace: {
          ref: fantasyRaceId,
          name: inputs.fantasyRace.name
        },
        alignment: inputs.alignment
      }, { new: true }
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
      nameCombinations: z.array(z.string()),
      default: z.boolean()
    })
  )
  .mutation(async (opts) => {
    console.log('nameCombinations: ', opts.input.nameCombinations)
    try {
      const newRace: RaceDocument = await Race.create(opts.input)
      return newRace;
    } catch (e: any) {
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
      const userRace: RaceDocument | null = await Race.findOne({ creatorAddress: opts.input.walletAddress, default: false })
      return userRace;
    } catch (e: any) {
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
      nameCombinations: z.array(z.string()),
      default: z.boolean().default(false)
    })
  )
  .mutation(async (opts) => {
    try {
      const newPlayerClass: PlayerClassDocument | null = await PlayerClass.create(opts.input)
      return newPlayerClass;
    } catch (e: any) {
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
      const userPlaerClass: RaceDocument | null = await PlayerClass.findOne({ creatorAddress: opts.input.walletAddress, default: false })
      return userPlaerClass;
    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const getUserCards = procedure
  .input(
    z.object({
      walletAddress: z.string()
    })
  )
  .mutation(async (opts) => {
    const inputs = opts.input;
    const client = {
      publicApiUrl: process.env.NEXT_PUBLIC_IMX_API_ADDRESS ?? '',
      starkContractAddress: process.env.STARK_CONTRACT_ADDRESS ?? '',
      registrationContractAddress: process.env.REGISTRATION_ADDRESS,
      gasLimit: process.env.GAS_LIMIT,
      gasPrice: process.env.GAS_PRICE,
    }
    const minter = await ImmutableXClient.build({
      ...client,
      signer: new Wallet(PRIVATE_KEY1).connect(provider),
    });

    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    console.log('registerImxResult: ', registerImxResult.tx_hash)

    if (registerImxResult.tx_hash === '') {
      console.log('Minter registered, continuing...');
    } else {
      console.log('Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const assets = await minter.getAssets({
      user: inputs.walletAddress,
      collection: IMX_COLLECTION_ADDRESS
    })
    return assets;
  })

