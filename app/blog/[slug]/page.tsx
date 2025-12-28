import { Container, Title, Text, Button, Paper, Group, Badge, ThemeIcon, TypographyStylesProvider } from '@mantine/core';
import { IconArrowLeft, IconCalendar, IconUser, IconShare } from '@tabler/icons-react';
import Link from 'next/link';
import { getBlogPost } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

interface BlogPostProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return notFound();
    }

    return (
        <Container size="sm" py={60}>
            {/* Navigation */}
            <Button
                component={Link}
                href="/blog"
                variant="subtle"
                color="gray"
                size="sm"
                leftSection={<IconArrowLeft size={16} />}
                mb="xl"
            >
                Back to Articles
            </Button>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <Group gap="xs" mb="md">
                    <Badge color="wasabi" size="lg" variant="light">{post.theme || post.topic || 'Opinion'}</Badge>
                    <Badge color="gray" size="lg" variant="outline">{new Date(post.timestamp).toLocaleDateString()}</Badge>
                </Group>

                <Title order={1} size={42} style={{ lineHeight: 1.2, fontFamily: 'Greycliff CF, sans-serif' }} mb="lg">
                    {post.title}
                </Title>

                <Group c="dimmed" gap="lg">
                    <Group gap={6}>
                        <IconUser size={16} />
                        <Text size="sm">{post.author || 'K-Farm Edtior'}</Text>
                    </Group>
                </Group>
            </div>

            {/* Content Body */}
            <Paper p={0} bg="transparent">
                <TypographyStylesProvider>
                    <div className="react-markdown-content" style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#333' }}>
                        <ReactMarkdown>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </TypographyStylesProvider>
            </Paper>

            {/* Footer / Share */}
            <Paper withBorder p="lg" radius="md" mt={60} bg="gray.0">
                <Group justify="space-between">
                    <div>
                        <Text fw={700}>Found this interesting?</Text>
                        <Text size="sm" c="dimmed">Share it with your network.</Text>
                    </div>
                    {/* Share Logic would go here (client component), for now a button */}
                    <Button variant="outline" color="dark" leftSection={<IconShare size={16} />}>
                        Share Article
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
}
