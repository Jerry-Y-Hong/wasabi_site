import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const filename = `${Date.now()}-${file.name}`;

        // Upload to Vercel Blob (Cloud Storage)
        const blob = await put(`uploads/${filename}`, file, {
            access: 'public',
        });

        console.log('[API] File uploaded to Cloud:', blob.url);

        return NextResponse.json({
            success: true,
            path: blob.url  // Returns secure https URL
        });

    } catch (error) {
        console.error('[API] Cloud Upload failed:', error);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}
