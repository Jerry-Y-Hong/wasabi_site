import { NextRequest, NextResponse } from 'next/server';
import { promises as fsp } from 'fs';
import pathLib from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    // Use /tmp only on Vercel deployment
    const DB_PATH = process.env.VERCEL === '1'
        ? pathLib.join('/tmp', 'data')
        : pathLib.join(process.cwd(), 'data');

    const filePath = pathLib.join(DB_PATH, 'uploads', filename);

    try {
        // Check if file exists
        await fsp.access(filePath);

        // Open a stream instead of reading the whole file into memory
        const fileStream = await fsp.open(filePath, 'r');
        const stream = fileStream.readableWebStream();

        // Determine content type
        const ext = pathLib.extname(filename).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.webp') contentType = 'image/webp';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.mp4') contentType = 'video/mp4';

        return new NextResponse(stream as any, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('File access error:', filePath);
        return new NextResponse('File not found or access error', { status: 404 });
    }
}
