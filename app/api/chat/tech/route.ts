import { NextRequest, NextResponse } from 'next/server';
import { generateTechSupportResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { messages, language } = await req.json();

        const history = messages.map((msg: { sender: string; text: string }) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const responseText = await generateTechSupportResponse(history, language);

        return NextResponse.json({ text: responseText });
    } catch (error) {
        console.error('Tech API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
