import { createTRPCRouter } from '@/server/api/trpc';
import { adminRouter } from './routers/procedures/admin_router';
import { authRouter } from './routers/procedures/auth_router';
import { userRouter } from './routers/procedures/user_router';
import { aiRouter } from './routers/procedures/ai_router';
import { battleRouter } from './routers/procedures/battle_router';
import { cardCreationRouter } from './routers/procedures/card_creation_router';
import { defaultDeckRouter } from './routers/procedures/default_deck_router';
import { imxRouter } from './routers/procedures/imx_router';
import { otherRouter } from './routers/procedures/other_router';
import { statsRouter } from './routers/procedures/stats_router';
import { fantasyRaceRouter } from './routers/procedures/fantasy_race_router';
import { playerClassRouter } from './routers/procedures/player_class_router';
import { defaultCardRouter } from './routers/procedures/default_card_router';
import { cardTypeRouter } from './routers/procedures/card_type_router';
import { creationPowerRouter } from './routers/procedures/creation_power_router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  user: userRouter,
  battle: battleRouter,
  creation: creationPowerRouter,
  ai: aiRouter,
  fatansyRace: fantasyRaceRouter,
  playerClass: playerClassRouter,
  defautlCard: defaultCardRouter,
  defaultDeck: defaultDeckRouter,
  cardCreation: cardCreationRouter,
  cardType: cardTypeRouter,
  stats: statsRouter,
  imx: imxRouter,
  other: otherRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;