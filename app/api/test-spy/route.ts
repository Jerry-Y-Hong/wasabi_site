import { NextRequest, NextResponse } from 'next/server';
import { spyOnCompany } from '@/lib/hunter-spy';

export async function GET(req: NextRequest) {
    // Safety check: Only allow localhost or admin session ideally, but for dev we skip
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Please provide ?url=... parameter' });
    }

    // Call the spy
    const result = await spyOnCompany(url);

    return NextResponse.json({
        target: url,
        result: result
    });
}
