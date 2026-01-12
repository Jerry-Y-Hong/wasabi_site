'use server';

import { saveStoredPassword } from '@/lib/auth-storage';
import { revalidatePath } from 'next/cache';

export async function updateAdminPassword(newPassword: string) {
    if (!newPassword || newPassword.length < 4) {
        return { success: false, message: 'Password must be at least 4 characters.' };
    }

    try {
        await saveStoredPassword(newPassword.trim());
        revalidatePath('/'); // Clear cache if needed, though Blob is fetched freshly logic mostly
        return { success: true, message: 'Password updated successfully.' };
    } catch (error) {
        console.error('Update password error:', error);
        return { success: false, message: `Failed to update password: ${error instanceof Error ? error.message : String(error)}` };
    }
}
