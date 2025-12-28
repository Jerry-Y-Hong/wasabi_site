import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'fs';
import pathLib from 'path';

// Use /tmp only on Vercel deployment
const DB_PATH = process.env.VERCEL === '1'
    ? pathLib.join('/tmp', 'data')
    : pathLib.join(process.cwd(), 'data');

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;

        await ensureDataDir();
        const uploadDir = pathLib.join(DB_PATH, 'uploads');
        await fsp.mkdir(uploadDir, { recursive: true });

        const filePath = pathLib.join(uploadDir, fileName);
        await fsp.writeFile(filePath, buffer);

        console.log('[API] File saved:', filePath);

        return NextResponse.json({
            success: true,
            path: `/api/uploads/${fileName}`
        });

    } catch (error) {
        console.error('[API] Upload failed:', error);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}

async function ensureDataDir() {
    try {
        await fsp.access(DB_PATH);
    } catch {
        await fsp.mkdir(DB_PATH, { recursive: true });
    }
}
