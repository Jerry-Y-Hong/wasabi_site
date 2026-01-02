import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'scripts.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const scripts = JSON.parse(fileContent);
        return NextResponse.json(scripts);
    } catch (error) {
        console.error('Error reading scripts:', error);
        return NextResponse.json({ error: 'Failed to load scripts' }, { status: 500 });
    }
}
