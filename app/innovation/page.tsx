import { Container, Title, Text, Card, Badge, Group, ThemeIcon } from '@mantine/core';
import { IconArrowRight, IconLeaf } from '@tabler/icons-react';
import { getBlogPosts } from '@/lib/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InnovationPage() {
    console.log('[InnovationPage] Data fetching starting...');
    const posts = await getBlogPosts();
    const allPosts = Array.isArray(posts) ? posts : [];
    const innovationPosts = allPosts.filter((p: any) => p && (p.category === 'Innovation' || p.category === 'Tech Data'));

    console.log('[InnovationPage] Posts found:', innovationPosts.length);

    return (
        <Container size="xl" py={60}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <Badge size="lg" variant="dot" color="wasabi" mb="md">Innovation & Tech Data</Badge>
                <Title order={1} size={48} mb="sm">Innovation Hub</Title>
                <Text c="dimmed" size="lg" maw={600} mx="auto">
                    K-Wasabi's technical materials and innovation reports.
                </Text>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '24px'
            }}>
                {innovationPosts.length > 0 ? (
                    innovationPosts.map((post: any) => (
                        <Card key={post.id || post.slug} padding="lg" radius="md" withBorder shadow="sm" style={{ display: 'flex', flexDirection: 'column' }}>
                            <Group justify="space-between" mb="xs">
                                <Badge color="wasabi" variant="light">{post.category || 'Tech Data'}</Badge>
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
                                {(post.content || '').replace(/[#*`]/g, '').substring(0, 150)}...
                            </Text>

                            <Group mt="auto">
                                <Button
                                    component="a"
                                    href={`/blog/${post.slug || '#'}`}
                                    variant="subtle"
                                    color="wasabi"
                                    rightSection={<IconArrowRight size={16} />}
                                >
                                    Read Technical Report
                                </Button>
                            </Group>
                        </Card>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                        <ThemeIcon size={60} radius="xl" color="gray" variant="light" mb="md">
                            <IconLeaf size={30} />
                        </ThemeIcon>
                        <Title order={3} c="dimmed">No technical materials uploaded yet.</Title>
                        <Text c="dimmed">Contact us for specialized R&D data.</Text>
                    </div>
                )}
            </div>
        </Container>
    );
}
