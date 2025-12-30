import { Container, Title, Text, Card, ThemeIcon, Stack, Group, Box, Badge, List, Paper, Image, Button } from '@mantine/core';
import { IconChartLine, IconAlertTriangle, IconRotateClockwise, IconWorld, IconFlask, IconSparkles } from '@tabler/icons-react';
import { EcosystemDiagram } from '@/components/ui/EcosystemDiagram';
import { getBlogPosts } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function InnovationTestPage() {
    const posts = await getBlogPosts();
    const allPosts = Array.isArray(posts) ? posts : [];
    const innovationPosts = allPosts.filter((p: any) => p && (p.category === 'Innovation' || p.category === 'Tech Data'));

    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60} gap="xs">
                <Badge variant="filled" color="wasabi" size="lg">Innovation & Tech Trends</Badge>
                <Title order={1} ta="center" size="h1">The Global Wasabi Innovation</Title>
                <Text c="dimmed" ta="center" maw={800} size="lg">
                    Discover how cutting-edge technology and global trends are shaping the future of smart agriculture.
                </Text>
            </Stack>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '40px',
                alignItems: 'center',
                marginBottom: '80px'
            }}>
                <Box>
                    <Image src="/images/traditional-stream.jpg" radius="lg" style={{ boxShadow: 'var(--mantine-shadow-md)' }} alt="Traditional" />
                    <Text size="xs" c="dimmed" ta="center" mt="sm">Traditional stream-grown wasabi (400+ days Cycle)</Text>
                </Box>
                <Box ta="center">
                    <Title order={2} c="wasabi">VS</Title>
                </Box>
                <Box>
                    <Image src="/images/tech-blueprint.jpg" radius="lg" style={{ boxShadow: 'var(--mantine-shadow-md)' }} alt="Smart Farm" />
                    <Text size="xs" c="dimmed" ta="center" mt="sm">K-Farm AI-Aeroponic System (9 months Cycle)</Text>
                </Box>
            </div>

            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={40}>Our Vision: The Wasabi Industry Ecosystem</Title>
                <Paper bg="gray.0" p="xl" radius="lg" mb={40} withBorder>
                    <EcosystemDiagram />
                </Paper>
            </Box>

            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Group justify="space-between" align="center" mb={40}>
                    <Title order={2}>Latest Innovation News</Title>
                    <Button component="a" href="/news" variant="subtle" color="wasabi">View All News →</Button>
                </Group>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {innovationPosts.length > 0 ? (
                        innovationPosts.slice(0, 4).map((item: any) => (
                            <Card key={item.id || item.slug} shadow="sm" padding="lg" radius="md" withBorder component="a" href={`/blog/${item.slug}`}>
                                <Group wrap="nowrap" align="flex-start">
                                    <Image src={item.image || '/images/blog/stock_lab.png'} w={120} h={120} radius="md" alt={item.title} style={{ objectFit: 'cover' }} />
                                    <Box flex={1}>
                                        <Text size="xs" c="dimmed" mb={4}>
                                            {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent'}
                                        </Text>
                                        <Text fw={700} size="md" mb={8} lineClamp={2}>
                                            {item.title}
                                        </Text>
                                        <Text size="sm" c="dimmed" lineClamp={2}>
                                            {(item.content || '').replace(/[#*`]/g, '').substring(0, 80)}...
                                        </Text>
                                    </Box>
                                </Group>
                            </Card>
                        ))
                    ) : (
                        <Text c="dimmed" ta="center" w="100%" py="xl">No technical materials uploaded yet.</Text>
                    )}
                </div>
            </Box>
        </Container >
    );
}
