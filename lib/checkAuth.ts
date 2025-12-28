'use server';

import { cookies } from 'next/headers';
import { getSessionToken } from './auth';

export async function checkAuthStatus() {
    const cookieStore = await cookies();
    const token = cookieStore.get('wasabi_session_v2');

    if (!token || token.value !== getSessionToken()) {
        return false;
    }
    return true;
}
