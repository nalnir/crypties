import { z } from 'zod';
import { procedure, router } from '../trpc';
import { connectDB } from '@/backend/connection';
import User from '@/pages/api/schemas/user_schema';
import Race, { RaceDocument } from '@/pages/api/schemas/race_schema';
import { REST } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";
import { CreateGenerationResponseData, GeneratedImageVariationGenerics, GetGenerationByIdResponseData, LeonardoAPI } from '@/utils/types/leonardo';
import PlayerClass, { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { getUser, getUserClass, getUserFantasyRace, onboardUser, register, saveUserFantasyRace, saveUserPlayerClass } from './procedures/user_procedures';
import { bumpCreateTry, checkIfPlayerClassAlreadyCreated, checkIfPlayerClassExists, checkIfRaceAlreadyCreated, checkIfRaceExists, createRace, resetCreateTries, setCreateCycle, setUseCreatePower } from './procedures/creation_power_procedures';
import { correctName, generateDescription, generateImages, isFantasyRace, isPlayerClass } from './procedures/ai_procedures';
import { bumpPlayedByAmountFantasyRace, getOtherFantasyRaces } from './procedures/fantasy_race_procedures';
import { bumpPlayedByAmoungPlayerClass, getOtherPlayerClasses } from './procedures/player_class_procedures';
import { getAuthToken, invalidateAuthToken, registerAuthToken } from './procedures/auth_procedures';

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
  getOtherFantasyRaces,
  bumpPlayedByAmountFantasyRace,

  // PLAYER CLASS PROCEDURES
  getOtherPlayerClasses,
  bumpPlayedByAmoungPlayerClass,
});

export type AppRouter = typeof appRouter;