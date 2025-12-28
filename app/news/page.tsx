import { Container, Title, Text, Card, Badge, Group, ThemeIcon } from '@mantine/core';
import { IconArrowRight, IconLeaf } from '@tabler/icons-react';
import { getBlogPosts } from '@/lib/actions';

export const dynamic = 'force-dynamic'; // Force real-time data fetching
export const revalidate = 0;

export default async function NewsPage() {
    const posts = await getBlogPosts();
    // Filter valid posts first to prevent render errors
    const validPosts = Array.isArray(posts) ? posts.filter((p: any) => p && p.title) : [];

    console.log('[NewsPage] Loaded Posts:', posts.length, 'Valid:', validPosts.length);

    return (
        <Container size="xl" py={60}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <Badge size="lg" variant="dot" color="wasabi" mb="md">K-Farm Newsroom</Badge>
                <Title order={1} size={48} mb="sm" style={{ fontFamily: 'Greycliff CF, sans-serif' }}>
                    Latest Updates & Insights
                </Title>
                <Text c="dimmed" size="lg" maw={600} mx="auto">
                    Stay updated with our latest research, partnerships, and smart farming technologies.
                </Text>
            </div>

            {/* Manual Grid Implementation (Safer than Mantine Grid) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {validPosts.length > 0 ? (
                    validPosts.map((post: any) => (
                        <Card key={post.id || Math.random()} padding="lg" radius="md" withBorder shadow="sm" style={{ display: 'flex', flexDirection: 'column' }}>
                            <Group justify="space-between" mb="xs">
                                <Badge color="wasabi" variant="light">{post.topic || 'News'}</Badge>
                                <Text size="xs" c="dimmed">
                                    {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Date'}
                                </Text>
                            </Group>

                            <a href={`/blog/${post.slug || '#'}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Title order={3} size="h4" mb="sm" style={{ minHeight: 50, lineHeight: 1.3, cursor: 'pointer' }}>
                                    {post.title}
                                </Title>
                            </a>

                            <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ minHeight: 60 }}>
                                {(post.content || '').replace(/[#*`]/g, '')}
                            </Text>

                            <Group mt="auto">
                                <a
                                    href={`/blog/${post.slug || '#'}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '8px 12px',
                                        color: '#2b8a3e',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        backgroundColor: '#ebfbee',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Read Full Story <IconArrowRight size={16} style={{ marginLeft: 6 }} />
                                </a>
                            </Group>
                        </Card>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                        <ThemeIcon size={60} radius="xl" color="gray" variant="light" mb="md">
                            <IconLeaf size={30} />
                        </ThemeIcon>
                        <Title order={3} c="dimmed">No news yet.</Title>
                        <Text c="dimmed">Check back soon for updates!</Text>
                    </div>
                )}
            </div>
        </Container>
    );
}
