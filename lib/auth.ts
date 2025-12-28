export const ADMIN_SECRET = process.env.ADMIN_SECRET || 'complex_secret_key_wasabi_farm_2025';

export function getSessionToken() {
    // Edge-compatible base64 encoding
    if (typeof window === 'undefined') {
        const text = `${ADMIN_SECRET}:authenticated`;
        return btoa(text);
    }
    return 'browser_unsafe_token';
}

export function verifySessionToken(token: string) {
    const validToken = getSessionToken();
    return token === validToken;
}
