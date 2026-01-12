
import { list, put } from '@vercel/blob';

const AUTH_FILE_NAME = 'auth_config_v1.json';
const DEFAULT_PASS = '3357';

export async function getStoredPassword(): Promise<string> {
    try {
        // Find the auth file - grab latest by sorting
        const { blobs } = await list({ prefix: AUTH_FILE_NAME });

        if (blobs.length > 0) {
            // Sort by uploadedAt descending (newest first)
            blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

            // Found file, download and parse
            const response = await fetch(blobs[0].url, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                return data.password || DEFAULT_PASS;
            }
        }

        // If no file exists, creates one with default password
        await saveStoredPassword(DEFAULT_PASS);
        return DEFAULT_PASS;

    } catch (error) {
        console.error('Failed to get auth config from Blob:', error);
        return DEFAULT_PASS;
    }
}

export async function saveStoredPassword(newPassword: string): Promise<void> {
    try {
        // Save as JSON
        const data = {
            password: newPassword,
            updatedAt: new Date().toISOString()
        };

        // Upload (overwrite is implicit if we use the same filename logic in retrieval, 
        // but Blob stores all versions. We just list(limit:1) to get latest usually, 
        // OR we specifically delete old ones. For simplicity, just PUT new one.)
        // Note: put() returns a unique URL. 'list' sorts by date usually?
        // Actually list() returns blobs. We should filter by name.

        await put(AUTH_FILE_NAME, JSON.stringify(data), {
            access: 'public',
            addRandomSuffix: false, // Keep filename constant
            // @ts-ignore - Vercel SDK types might trail behind, but error message says use this.
            // Actually it is supported in recent versions.
            allowOverwrite: true,
            cacheControlMaxAge: 0 // Prevent CDN caching for config file is crucial!
        });

    } catch (error) {
        console.error('Failed to save auth config to Blob:', error);
        throw new Error(`Failed to save password: ${error instanceof Error ? error.message : String(error)}`);
    }
}
