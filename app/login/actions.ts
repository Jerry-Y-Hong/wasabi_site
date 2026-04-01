'use server';

import { cookies } from 'next/headers';

import { getSessionToken } from '@/lib/auth';
import { getStoredPassword } from '@/lib/auth-storage';

export async function setAuthCookie(password: string) {
    const cleanPassword = password.trim();
    // Dynamic password from Vercel Blob
    const CORRECT_PASSWORD = await getStoredPassword();

    //  // Debug log
    if (cleanPassword === CORRECT_PASSWORD.trim()) {
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
