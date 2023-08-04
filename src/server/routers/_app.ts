import { router } from '../trpc';
import { REST } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import { createUserDeck, deleteUserDeck, getUser, getUserClass, getUserDecks, getUserFantasyRace, onboardUser, register, saveUserDeck, saveUserFantasyRace, saveUserPlayerClass, updateUserDecks } from './procedures/user_procedures';
import { bumpCreateTry, checkIfPlayerClassAlreadyCreated, checkIfPlayerClassExists, checkIfRaceAlreadyCreated, checkIfRaceExists, createRace, resetCreateTries, setCreateCycle, setUseCreatePower } from './procedures/creation_power_procedures';
import { correctName, generateDescription, generateImages, isFantasyRace, isPlayerClass } from './procedures/ai_procedures';
import { bumpPlayedByAmountFantasyRace, getDefaultClasses, getDefaultFantasyRaces, getOtherFantasyRaces } from './procedures/fantasy_race_procedures';
import { bumpPlayedByAmoungPlayerClass, getOtherPlayerClasses } from './procedures/player_class_procedures';
import { getAuthToken, invalidateAuthToken, registerAuthToken } from './procedures/auth_procedures';
import { bumpTokenId, getCurrentCardId, getCurrentGeneration, getTokenId, mintBulk, uploadMetadataToIPFS, uploadMetadataToS3 } from './procedures/card_creation_procedures';
import { establishNextGeneration } from './procedures/admin_procedures';
import { getAlignmentStat, getClassStat, getRaceStat } from './procedures/stats_procedures';
import { getAllCards, getUserBalance, getUserCards } from './procedures/imx_procedures';
import { connectToLobby } from './procedures/battle_procedures';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? '');
const chatpgptConfig = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(chatpgptConfig);

export const appRouter = router({

  // AUTH PROCEDURES
  getAuthToken,
  registerAuthToken,
  invalidateAuthToken,

  // USER PROCEDURES
  getUser,
  register,
  onboardUser,
  saveUserFantasyRace,
  getUserFantasyRace,
  saveUserPlayerClass,
  getUserClass,
  getUserDecks,
  createUserDeck,
  saveUserDeck,
  deleteUserDeck,
  updateUserDecks,

  // BATTLE PROCEDURES
  connectToLobby,

  // CREATION POWER PROCEDURES
  checkIfRaceAlreadyCreated,
  checkIfPlayerClassAlreadyCreated,
  checkIfRaceExists,
  checkIfPlayerClassExists,
  createRace,
  setCreateCycle,
  resetCreateTries,
  bumpCreateTry,
  setUseCreatePower,

  // AI PROCEDURES
  generateImages,
  isFantasyRace,
  isPlayerClass,
  correctName,
  generateDescription,

  // FANTASY RACE PROCEDURES
  getDefaultFantasyRaces,
  getOtherFantasyRaces,
  bumpPlayedByAmountFantasyRace,
  getDefaultClasses,

  // PLAYER CLASS PROCEDURES
  getOtherPlayerClasses,
  bumpPlayedByAmoungPlayerClass,

  // CARD CREATION PROCEDURES
  uploadMetadataToIPFS,
  uploadMetadataToS3,
  mintBulk,
  getTokenId,
  bumpTokenId,
  getCurrentGeneration,
  getCurrentCardId,

  // ADMIN PROCEDURES
  establishNextGeneration,

  // STAT PROCEDURES
  getRaceStat,
  getClassStat,
  getAlignmentStat,

  //IMX PROCEDURES
  getUserCards,
  getAllCards,
  getUserBalance
});

export type AppRouter = typeof appRouter;