import { NextRequest, NextResponse } from 'next/server';
import { analyzeLeadQuality } from '@/lib/ai';

export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get('name') || "Test Company";
    const summary = req.nextUrl.searchParams.get('summary') || "We produce premium wasabi using smart farm technology in Korea.";
    const meta = req.nextUrl.searchParams.get('meta') || "Best wasabi in the world.";
    const country = req.nextUrl.searchParams.get('country') || "South Korea";

    try {
        console.log("[Test AI Route] Calling analyzeLeadQuality...");
        const result = await analyzeLeadQuality(name, summary, meta, country);
        return NextResponse.json({
            success: true,
            result: result
        });
    } catch (error: any) {
        console.error("[Test AI Route] Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown error",
            stack: error.stack,
            fullError: error
        });
    }
}
