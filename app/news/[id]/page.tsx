'use client'; // Actually we can use server component if we don't need client features, but Mantine components often need 'use client' if they have interactions. Images and Text are fine. Button link is fine.
// However, 'generateStaticParams' works with server components.
// Let's try to make it a server component first. If Mantine complains, we might need a client wrapper or specific handling. 
// Standard Mantine components work in Server Components as long as they render to primitives, but often 'use client' is safer for full Mantine pages to avoid hydration issues with style injection, though Mantine v7 supports RSC.
// Let's stick to 'use client' for simplicity unless I'm sure about the async params in client components.
// Wait, client components can't be async. So if I need 'await params', it MUST be a server component.
// BUT Mantine components usually need to run in a client boundary or the RootLayout handles the Registry. We set up MantineProvider in layout.tsx.
// So server components can render Mantine components.

import { Container, Title, Text, Image, Badge, Button } from '@mantine/core';
import newsData from '@/data/news.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return newsData.map((post) => ({
        id: post.id,
    }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const news = newsData.find((n) => n.id === id);

    if (!news) {
        return notFound();
    }

    return (
        <Container size="md" py={80}>
            <Button component={Link} href="/news" variant="subtle" color="gray" mb="xl">
                ← Back to News
            </Button>

            <Badge color="blue" size="lg" mb="md">{news.category}</Badge>
            <Title order={1} mb="xs">{news.title}</Title>
            <Text c="dimmed" mb="xl">{news.date}</Text>

            <Image
                src={news.image}
                alt={news.title}
                radius="md"
                mb="xl"
            />

            <Text size="lg" style={{ whiteSpace: 'pre-line' }}>
                {news.content}
            </Text>
        </Container>
    );
}
