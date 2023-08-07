import { z } from 'zod';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import { UserRoles } from "@/pages/api/enums";
import { procedure } from '@/server/trpc';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { waitForTransaction } from '@/server/helper_functions';
import { Wallet } from '@ethersproject/wallet';
import { AlchemyProvider } from '@ethersproject/providers';
import Deck, { DeckDocument } from '@/pages/api/schemas/deck_schema';
import { deck } from '../objects/deck';
const mongoose = require('mongoose');

const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 ?? ''
const ETH_NETWORK = process.env.ETH_NETWORK ?? 'goerli';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';

const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

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
      hasCreatePower: true,
      roles: [UserRoles.USER]
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
      const userPlayerClass: PlayerClassDocument | null = await PlayerClass.findOne({ creatorAddress: opts.input.walletAddress, default: false })
      return userPlayerClass;
    } catch (e: any) {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log(e.message);
      }
    }
  })

export const getUserDecks = procedure
  .input(z.object({
    walletAddress: z.string(),
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    const userDecks: DeckDocument[] | null = await Deck.find({ walletAddress: inputs.walletAddress })
    return userDecks;
  })

export const createUserDeck = procedure
  .input(z.object({
    walletAddress: z.string(),
    deckName: z.string(),
    image: z.string()
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    const userDeck: DeckDocument | null = await Deck.findOne({ walletAddress: inputs.walletAddress, deckName: inputs.deckName });
    if (userDeck) {
      throw new Error('Deck with this name already exists')
    }
    const newUserDeck: DeckDocument | null = await Deck.create({ walletAddress: inputs.walletAddress, deckName: inputs.deckName, image: inputs.image })
    return newUserDeck;
  })

export const saveUserDeck = procedure
  .input(z.object({
    deck: deck
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    const updatedDeck: DeckDocument | null = await Deck.findOneAndUpdate({ _id: inputs.deck._id }, { $set: { cards: inputs.deck.cards } }, { new: true })
    console.log('updatedDeck: ', updatedDeck)
    return updatedDeck;
  })

export const deleteUserDeck = procedure
  .input(z.object({
    deck: deck
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    const res: DeckDocument | null = await Deck.findByIdAndDelete({ _id: inputs.deck._id });
    return res;
  })

export const updateUserDecks = procedure
  .input(z.object({
    decks: z.array(deck)
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    let results: any = [];
    await Promise.all(
      inputs.decks.map(async (deck) => {
        const res = await Deck.findOneAndUpdate({ _id: deck._id }, { $set: { cards: deck.cards } }, { new: true })
        results.push(res);
      })
    )
    return results;
  })
