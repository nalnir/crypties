import { z } from 'zod';
import { connectDB } from '@/backend/connection';
import User, { UserDocument } from '@/pages/api/schemas/user_schema';
import { UserRoles } from "@/pages/api/enums";
import { publicProcedure } from '@/server/trpc';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { waitForTransaction } from '@/server/helper_functions';
import { Wallet } from '@ethersproject/wallet';
import { AlchemyProvider } from '@ethersproject/providers';
import Deck, { DeckDocument } from '@/pages/api/schemas/deck_schema';
import { deck } from '../objects/deck';
const mongoose = require('mongoose');

export const getUser = publicProcedure
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

    opts.ctx.user = user ?? undefined;
    return user as UserDocument;
  });

export const register = publicProcedure
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

    opts.ctx.user = user;
    return user
  })

export const onboardUser = publicProcedure
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

export const saveUserFantasyRace = publicProcedure
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

export const getUserFantasyRace = publicProcedure
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

export const saveUserPlayerClass = publicProcedure
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

export const getUserClass = publicProcedure
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

export const getUserDecks = publicProcedure
  .input(z.object({
    walletAddress: z.string(),
  }))
  .query(async (opts) => {
    const inputs = opts.input;
    const userDecks: DeckDocument[] | null = await Deck.find({ walletAddress: inputs.walletAddress })
    return userDecks;
  })

export const createUserDeck = publicProcedure
  .input(z.object({
    walletAddress: z.string(),
    deckName: z.string(),
    image: z.string(),
    cards: z.array(z.string()).nullish(),
    default: z.boolean().nullish()
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    const userDeck: DeckDocument | null = await Deck.findOne({ walletAddress: inputs.walletAddress, deckName: inputs.deckName });
    if (userDeck) {
      throw new Error('Deck with this name already exists')
    }
    const newUserDeck: DeckDocument | null = await Deck.create({ walletAddress: inputs.walletAddress, deckName: inputs.deckName, image: inputs.image, cards: inputs.cards, default: inputs.default })
    return newUserDeck;
  })

export const saveUserDeck = publicProcedure
  .input(z.object({
    deck: deck
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    const updatedDeck: DeckDocument | null = await Deck.findOneAndUpdate({ _id: inputs.deck._id }, { $set: { cards: inputs.deck.cards } }, { new: true })
    return updatedDeck
  })

export const deleteUserDeck = publicProcedure
  .input(z.object({
    deck: deck
  }))
  .mutation(async (opts) => {
    const inputs = opts.input;
    if (inputs.deck.default) {
      return;
    }
    const res: DeckDocument | null = await Deck.findByIdAndDelete({ _id: inputs.deck._id });
    return res;
  })

export const updateUserDecks = publicProcedure
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
