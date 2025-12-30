
import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/actions';

export async function GET() {
    try {
        const posts = await getBlogPosts();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
