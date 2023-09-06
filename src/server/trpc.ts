import { UserRoles } from '@/pages/api/enums';
import { UserDocument } from '@/pages/api/schemas/user_schema';
import { TRPCError, initTRPC } from '@trpc/server';

interface Context {
    user?: UserDocument
}
const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;


export const isAdmin = middleware(async (opts) => {
    const { ctx } = opts;

    if (!ctx.user?.roles.includes(UserRoles.ADMIN || UserRoles.SUPERADMIN)) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
        ctx: {
            user: ctx.user,
        },
    });
});

export const adminProcedure = publicProcedure.use(isAdmin);