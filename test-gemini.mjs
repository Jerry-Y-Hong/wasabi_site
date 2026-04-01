import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
    }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function run() {
    try {
        console.log("Testing Gemini API with key:", process.env.GEMINI_API_KEY ? "PRESENT" : "MISSING");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Response:", response.text());
        console.log("SUCCESS: Gemini API is working.");
    } catch (error) {
        console.error("FAILURE: Gemini API error:", error);
    }
}

run();
