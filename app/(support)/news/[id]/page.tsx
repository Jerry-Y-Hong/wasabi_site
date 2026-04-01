

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
            <Link href="/news" style={{ textDecoration: 'none' }}>
                <Button variant="subtle" color="gray" mb="xl">
                    ← Back to News
                </Button>
            </Link>

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
