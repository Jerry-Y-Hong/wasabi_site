import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionToken } from './lib/auth';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const { pathname } = request.nextUrl;

    // 1. Domain-based Routing Strategy (Business Splitting)
    // Only redirect if they are at the root ('/') to avoid infinite loops or breaking navigation
    if (pathname === '/') {
        // 🇮🇹 k-farm.it.kr -> Products (Premium Brand)
        if (hostname.includes('k-farm.it.kr')) {
            return NextResponse.redirect(new URL('/products', request.url));
        }
        // 🤖 k-smartfarm.ai.kr -> Innovation (Tech/R&D)
        if (hostname.includes('k-smartfarm.ai.kr')) {
            return NextResponse.redirect(new URL('/innovation', request.url));
        }
    }

    // 2. Admin Protection
    if (pathname.startsWith('/admin')) {
        const authCookie = request.cookies.get('wasabi_session_v2');

        // If no auth cookie, redirect to login
        if (!authCookie || authCookie.value !== getSessionToken()) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Matcher needs to be broader now to catch the root path '/' for redirects
    matcher: ['/', '/admin', '/admin/:path*'],
};
