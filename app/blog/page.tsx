import { Container, Title, Text, SimpleGrid, Card, Badge, Group, Button, ThemeIcon } from '@mantine/core';
import { IconArrowRight, IconLeaf } from '@tabler/icons-react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/actions';

export default async function BlogListPage() {
    const posts = await getBlogPosts();

    return (
        <Container size="xl" py={60}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <Badge size="lg" variant="dot" color="wasabi" mb="md">K-Farm Knowledge Hub</Badge>
                <Title order={1} size={48} mb="sm" style={{ fontFamily: 'Greycliff CF, sans-serif' }}>
                    Future of Agriculture
                </Title>
                <Text c="dimmed" size="lg" maw={600} mx="auto">
                    Explore insights on smart farming technology, investment trends, and the premium Wasabi market.
                </Text>
            </div>

            {/* Posts Grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {posts.length > 0 ? (
                    posts.map((post: any) => (
                        <Card key={post.id} padding="lg" radius="md" withBorder shadow="sm" component={Link} href={`/blog/${post.slug}`} style={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                            <Group justify="space-between" mb="xs">
                                <Badge color="wasabi" variant="light">{post.topic || 'Opinion'}</Badge>
                                <Text size="xs" c="dimmed">{new Date(post.timestamp).toLocaleDateString()}</Text>
                            </Group>

                            <Title order={3} size="h4" mb="sm" style={{ minHeight: 50, lineHeight: 1.3 }}>
                                {post.title}
                            </Title>

                            <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ minHeight: 60 }}>
                                {post.content.replace(/[#*`]/g, '')}
                            </Text>

                            <Group mt="auto">
                                <Text size="sm" c="wasabi" fw={500} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    Read Article <IconArrowRight size={16} />
                                </Text>
                            </Group>
                        </Card>
                    ))
                ) : (
                    <Container py={60} ta="center">
                        <ThemeIcon size={60} radius="xl" color="gray" variant="light" mb="md">
                            <IconLeaf size={30} />
                        </ThemeIcon>
                        <Title order={3} c="dimmed">No articles yet.</Title>
                        <Text c="dimmed">Check back soon for updates!</Text>
                    </Container>
                )}
            </SimpleGrid>
        </Container>
    );
}
