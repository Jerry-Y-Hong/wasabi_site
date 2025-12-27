'use server';

import { cookies } from 'next/headers';

export async function setAuthCookie(password: string) {
    // Hardcoded password as requested by user
    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || '3357';

    if (password === CORRECT_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set('wasabi_auth', 'authenticated', {
            httpOnly: true,
            secure: true, // Always true in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return true;
    }

    return false;
}
