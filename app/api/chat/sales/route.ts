import { NextRequest, NextResponse } from 'next/server';
import { generateSalesChatResponse } from '@/lib/ai';

/**
 * API Route for Sales AI Chat (Manager Hong)
 * Handles conversion between frontend message format and Gemini history format.
 */
export async function POST(req: NextRequest) {
    try {
        const { messages, language } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
        }

        // Convert frontend message format to Gemini format
        // Frontend: { sender: 'user' | 'ai', text: string }
        // Gemini: { role: 'user' | 'model', parts: [{ text: string }] }
        const history = messages.map((msg: { sender: string; text: string }) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // Pass the full history to the AI library.
        // The library will extract the last message as the new input and 
        // use the rest as context history for the startChat method.
        const responseText = await generateSalesChatResponse(history, language);

        return NextResponse.json({ text: responseText });
    } catch (error) {
        console.error('Sales Chat API Error:', error);
        return NextResponse.json({ 
            error: 'Failed to generate chat response',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
