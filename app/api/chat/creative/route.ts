
import { NextRequest, NextResponse } from 'next/server';
import { generateCreativeDirectorResponse } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { messages, language } = await req.json();

        // Convert history format
        const history = messages.map((m: { sender: string; text: string }) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        const responseText = await generateCreativeDirectorResponse(history, language);

        return NextResponse.json({ text: responseText });
    } catch (error) {
        console.error('Creative API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
