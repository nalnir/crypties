import { env } from '@/env.mjs';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';


export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();
    // Check if we have a session
    const supabase = createMiddlewareClient(
        { req, res },
        {
            supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
        }
    );
    const { data } = await supabase.auth.getSession();

    const { session } = data;
    // Check auth condition
    if (session?.user || req.nextUrl.pathname === '/api/auth/callback') {
        // Authentication successful, forward request to protected route.
        if (session?.user && req.nextUrl.pathname.includes('/login')) {
            // Auth condition not met, redirect to home page.
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/';
            redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }

        console.log('CONTINUE!');
        return res;
    } else if (req.nextUrl.pathname.includes('/login')) {
        return res;
    }

    // Auth condition not met, redirect to home page.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login route)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};