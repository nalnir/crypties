import { z } from 'zod';
import { connectDB } from '@/backend/connection';
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
import UserStats, { UserStatsDocument } from '@/pages/api/schemas/user_stats_schema';
const mongoose = require('mongoose');

export const getUserStats = publicProcedure
    .input(
        z.object({
            walletAddress: z.string(),
        })
    )
    .query(async (opts) => {

        const db = await connectDB();
        const userStats = await UserStats.findOne({
            walletAddress: opts.input.walletAddress,
        });

        return userStats as UserStatsDocument;
    });

export const saveUserStats = publicProcedure
    .input(
        z.object({
            walletAddress: z.string(),
            opponentWalletAddress: z.string(),
            hasWon: z.boolean(),

        })
    )
    .mutation(async (opts) => {
        const inputs = opts.input
        const db = await connectDB();
        const userStats = await UserStats.findOne({
            walletAddress: inputs.walletAddress,
        });

        if (userStats) {

            const opponentsMap = userStats.opponents as unknown as Map<string, { winsAgainst: number, lossesAgainst: number, totalGames: number }>
            const opponentStats = opponentsMap.get(inputs.opponentWalletAddress) ?? {
                winsAgainst: 0,
                lossesAgainst: 0,
                totalGames: 0
            };

            opponentStats.winsAgainst = inputs.hasWon ? opponentStats.winsAgainst += 1 : opponentStats.winsAgainst
            opponentStats.lossesAgainst = inputs.hasWon ? opponentStats.lossesAgainst : opponentStats.lossesAgainst += 1
            opponentStats.totalGames = opponentStats.totalGames += 1
            opponentsMap.set(inputs.opponentWalletAddress, opponentStats)

            await UserStats.updateOne({
                walletAddress: userStats.walletAddress
            }, {
                opponents: opponentsMap,
                totalWins: inputs.hasWon ? userStats.totalWins += 1 : userStats.totalWins,
                totalLosses: inputs.hasWon ? userStats.totalLosses : userStats.totalLosses += 1,
                longestWinStreak: inputs.hasWon ? userStats.longestWinStreak += 1 : userStats.longestWinStreak,
                longestLossStreak: inputs.hasWon ? userStats.longestLossStreak : userStats.longestLossStreak += 1,
                currentWinStreak: inputs.hasWon ? userStats.currentWinStreak += 1 : 0,
                currentLossStreak: inputs.hasWon ? 0 : userStats.currentLossStreak += 1,
            })
        } else {
            await UserStats.create({
                opponents: {
                    [inputs.opponentWalletAddress]: {
                        winsAgainst: inputs.hasWon ? 1 : 0,
                        lossesAgainst: inputs.hasWon ? 0 : 1,
                        totalGames: 1
                    }
                },
                totalWins: inputs.hasWon ? 1 : 0,
                totalLosses: inputs.hasWon ? 0 : 1,
                longestWinStreak: inputs.hasWon ? 1 : 0,
                longestLossStreak: inputs.hasWon ? 0 : 1,
                currentWinStreak: inputs.hasWon ? 1 : 0,
                currentLossStreak: inputs.hasWon ? 0 : 1,
                walletAddress: inputs.walletAddress
            })
        }

        return userStats as UserStatsDocument;
    })