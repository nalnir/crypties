import { createTRPCRouter } from '@/server/api/trpc';
import { adminRouter } from './procedures/admin_router';
import { authRouter } from './procedures/auth_router';
import { userRouter } from './procedures/user_router';
import { aiRouter } from './procedures/ai_router';
import { battleRouter } from './procedures/battle_router';
import { cardCreationRouter } from './procedures/card_creation_router';
import { defaultDeckRouter } from './procedures/default_deck_router';
import { imxRouter } from './procedures/imx_router';
import { otherRouter } from './procedures/other_router';
import { statsRouter } from './procedures/stats_router';
import { fantasyRaceRouter } from './procedures/fantasy_race_router';
import { playerClassRouter } from './procedures/player_class_router';
import { defaultCardRouter } from './procedures/default_card_router';
import { cardTypeRouter } from './procedures/card_type_router';
import { creationPowerRouter } from './procedures/creation_power_router';

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