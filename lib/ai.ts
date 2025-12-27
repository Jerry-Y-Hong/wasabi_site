'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Note: This requires GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Use Flash model for faster response (avoids Vercel timeout)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

interface ProposalRequest {
    partnerName: string;
    partnerType: string;
    relevance: string;
    contactPerson?: string;
}

export async function generateProposalEmail(data: ProposalRequest) {
    if (!process.env.GEMINI_API_KEY) {
        return {
            subject: `[Proposal] Strategic Partnership: K-Farm x ${data.partnerName}`,
            body: `(AI Mode Unavailable - Missing GEMINI_API_KEY)\n\nDear ${data.contactPerson || 'Partner'},\n\nWe are interested in collaborating with ${data.partnerName} based on your work in ${data.relevance}.\n\nPlease check your .env.local file to enable AI generation.`
        };
    }

    try {
        const prompt = `
        Act as a professional B2B Sales Director for "K-Farm International" (Korean Smart Farm Company).
        
        Write a personalized partnership proposal email to a Japanese potential partner.
        **LANGUAGE: JAPANESE (Business Keigo/Formal)**
        
        Partner Info:
        - Name: ${data.partnerName}
        - Type: ${data.partnerType}
        - Relevance: ${data.relevance}
        - Contact: ${data.contactPerson || '担当者様'}
        
        My Company (K-Farm):
        - Tech: Virus-free Wasabi Seedlings (Meristem culture), Aeroponic Smart Farm Systems.
        - Goal: Exporting seedlings or joint R&D.
        - My Name: 洪 泳喜 (Hong Young-hee)
        - My Title: Sales Manager (営業責任者)
        
        Requirements:
        - Subject: Formal and clear Business Japanese.
        - Body: Polite "Keigo", mentioning their specific relevance, offering our high-quality seedlings/tech.
        - Formatting: Start with Partner Name, then standard Japanese business email structure (Introduction, Reason for contact, Value Prop, Closing).
        - IMPORTANT: Do NOT include a signature block (Name, Company, Address) at the end. The system appends it automatically.
        - Output format: JSON with "subject" and "body".
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple parsing if JSON is returned within markdown blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return {
            subject: `Partnership Opportunity: K-Farm x ${data.partnerName}`,
            body: text
        };

    } catch (error) {
        console.error('AI Generation Error:', error);
        return {
            subject: `Error generating proposal for ${data.partnerName}`,
            body: "I encountered an error while communicating with the AI. Please try again later."
        };
    }
}

export async function generateBlogContent(topic: string, tone: string, language: string = 'English') {
    if (!process.env.GEMINI_API_KEY) {
        // Fallback to mock if no key
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            title: `[Mock] Future of ${topic}`,
            content: `Please set GEMINI_API_KEY in .env.local to generate real content about ${topic}.`
        };
    }

    try {
        const prompt = `
        Write a high-quality blog post about "${topic}".
        - Tone: ${tone}
        - Language: ${language}
        - Role: Expert Agricultural Tech Consultant
        - Format: JSON with "title" and "content".
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return {
            title: `Insights on ${topic}`,
            content: text
        };

    } catch (error) {
        return { title: "Error", content: "Failed to generate content." };
    }
}

export async function generateVideoScript(topic: string) {
    if (!process.env.GEMINI_API_KEY) return { scenes: [], raw: "No API Key" };

    const prompt = `
    Create a 30-second short-form video script for a marketing video about: "${topic}".
    Target Audience: Potential B2B Partners for Wasabi Smart Farm.
    Format: JSON array of objects, where each object has "scene" (number), "visual" (detailed description for AI video generator), "audio" (voiceover/sound).
    Example: [{"scene": 1, "visual": "Drone shot...", "audio": "Welcome to..."}]
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\[[\s\S]*\]/); // Match array
        if (jsonMatch) return { scenes: JSON.parse(jsonMatch[0]) };
        return { scenes: [], raw: text };
    } catch (e) {
        console.error(e);
        return { error: "Failed" };
    }
}
