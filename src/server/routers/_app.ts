import { router } from '../trpc';
// import { REST } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import { createUserDeck, deleteUserDeck, getUser, getUserClass, getUserDecks, getUserFantasyRace, onboardUser, register, saveUserDeck, saveUserFantasyRace, saveUserPlayerClass, updateUserDecks } from './procedures/user_procedures';
import { bumpCreateTry, checkIfPlayerClassAlreadyCreated, checkIfPlayerClassExists, checkIfRaceAlreadyCreated, checkIfRaceExists, createRace, resetCreateTries, setCreateCycle, setUseCreatePower } from './procedures/creation_power_procedures';
import { correctName, generateDescription, generateImages, isFantasyRace, isPlayerClass } from './procedures/ai_procedures';
import { bumpPlayedByAmountFantasyRace, getDefaultClasses, getDefaultFantasyRaces, getOtherFantasyRaces } from './procedures/fantasy_race_procedures';
import { bumpPlayedByAmoungPlayerClass, getOtherPlayerClasses } from './procedures/player_class_procedures';
import { getAuthToken, invalidateAuthToken, registerAuthToken } from './procedures/auth_procedures';
import { bumpTokenId, getCurrentCardId, getCurrentGeneration, getTokenId, mintBulk, uploadMetadataToIPFS, uploadMetadataToS3 } from './procedures/card_creation_procedures';
import { establishNextGeneration, testAuth } from './procedures/admin_procedures';
import { getAlignmentStat, getClassStat, getRaceStat, saveGameStats } from './procedures/stats_procedures';
import { getAllCards, getUserBalance, getUserCards } from './procedures/imx_procedures';
import { connectToLobby } from './procedures/battle_procedures';
import { createCardType, getAllCardTypes, getCardType } from './procedures/card_type_procedures';
import { createDefaultCard, getAllDefaultCards, publishUnpublishDefaultCard } from './procedures/default_card_procedures';
import { createNewDefaultDeck, deleteDefaultDeck, getAllDefaultDecks, publishUnpublishDeck, updateDefaultDeck } from './procedures/default_deck_procedures';
import { getETHprice } from './procedures/other_procedures';

// const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN ?? '');
const chatpgptConfig = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(chatpgptConfig);

export const appRouter = router({
  // ADMIN PROCEDURES
  establishNextGeneration,
  testAuth,

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

  // DEFAULT CARD PROCEDURES
  createDefaultCard,
  getAllDefaultCards,
  publishUnpublishDefaultCard,
  deleteDefaultDeck,

  // DEFAULT DECK PROCEDURES
  getAllDefaultDecks,
  createNewDefaultDeck,
  publishUnpublishDeck,
  updateDefaultDeck,

  // CARD CREATION PROCEDURES
  uploadMetadataToIPFS,
  uploadMetadataToS3,
  mintBulk,
  getTokenId,
  bumpTokenId,
  getCurrentGeneration,
  getCurrentCardId,

  // CARD TYPE PROCEDURES
  createCardType,
  getCardType,
  getAllCardTypes,

  // STAT PROCEDURES
  getRaceStat,
  getClassStat,
  getAlignmentStat,
  saveGameStats,

  //IMX PROCEDURES
  getUserCards,
  getAllCards,
  getUserBalance,

  //OTHER PROCEDURES
  getETHprice
});

export type AppRouter = typeof appRouter;