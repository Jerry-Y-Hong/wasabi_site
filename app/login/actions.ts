'use server';

import { cookies } from 'next/headers';

import { getSessionToken } from '@/lib/auth';

export async function setAuthCookie(password: string) {
    // Hardcoded password as requested by user
    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || '3357';

    if (password === CORRECT_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set('wasabi_session_v2', getSessionToken(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
        return true;
    }

    return false;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('wasabi_session_v2');
}
