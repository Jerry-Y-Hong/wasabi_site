import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionToken } from './lib/auth';

export function middleware(request: NextRequest) {
    // Protect all routes under /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const authCookie = request.cookies.get('wasabi_session_v2');

        // If no auth cookie, redirect to login
        if (!authCookie || authCookie.value !== getSessionToken()) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
