

/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { verify } from 'jsonwebtoken';
import { PrismaClient, user_role } from '@prisma/client';
// import { env } from '../../env.mjs';
import { prisma } from '../db';
import { compareHash } from '../../utils/functions/hash';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = Record<string, never>;

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const { req, res } = _opts;
  console.log('req: ', req)
  async function getUserFromHeader() {
    console.log('req.headers.authorization: ', req.headers.authorization)
    if (req.headers.authorization && req.headers.authorization.split(' ')[1]) {
      try {
        const token = localStorage.getItem('crypties:auth')
        if (!token) return null;
        const parsedToken = JSON.parse(token);
        if (new Date(parsedToken.validUntil) < new Date()) return null
        // const jwtVerified = verify(
        //   req.headers.authorization.split(' ')[1],
        //   process.env.SUPABASE_JWT_SECRET ?? ''
        // );
        console.log('token: ', token)
        const user = await prisma.users.findFirst({
          where: {
            walletAddress: parsedToken.userWalletAddress
          },
        });
        console.log('user: ', user)
        return user;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  return { req, res, user: await getUserFromHeader(), prisma };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  // allowOutsideOfServer: true,
  // isServer: true,
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

const isSupabaseAuthed = t.middleware(({ ctx, next }) => {
  const { req } = ctx;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  if (
    !compareHash({
      text: token,
      hash: 'e9733b4d3a3e0d05f33d047efb4834e0',
      salt: 'newSalt',
    })
  )
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  return next();
});

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});

const isAdmin = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (!ctx.user.roles.includes(user_role.admin))
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const authenticatedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = authenticatedProcedure.use(isAdmin);
export const supabasePrivateProcedure = t.procedure.use(isSupabaseAuthed);
export const publicProcedure = t.procedure;