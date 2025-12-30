import { Container, Title, Text, Card, ThemeIcon, Stack, Group, Box, Badge, List, Paper, Image, Button } from '@mantine/core';
import { IconChartLine, IconAlertTriangle, IconRotateClockwise, IconWorld, IconFlask, IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { EcosystemDiagram } from '@/components/ui/EcosystemDiagram';
import { getBlogPosts } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
    let innovationPosts: any[] = [];
    try {
        const posts = await getBlogPosts();
        const allPosts = Array.isArray(posts) ? posts : [];
        innovationPosts = allPosts.filter((p: any) => p && (p.category === 'Innovation' || p.category === 'Tech Data'));
    } catch (e) {
        console.error('[InsightsPage] Data fetch failed:', e);
    }

    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60} gap="xs">
                <Badge variant="filled" color="wasabi" size="lg">Innovation & Market Insights</Badge>
                <Title order={1} ta="center" size="h1">The Global Wasabi Opportunity</Title>
                <Text c="dimmed" ta="center" maw={800} size="lg">
                    Traditional wasabi cultivation is facing a global crisis, creating a massive "Blue Ocean" opportunity
                    for technology-driven smart farms.
                </Text>
            </Stack>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '50px',
                marginBottom: '80px'
            }}>
                <Box>
                    <Title order={2} mb="md" c="wasabi.7">Global Supply Crisis</Title>
                    <Text size="lg" mb="xl">
                        Main production hubs are seeing a rapid decline in output due to climate change and aging labor.
                    </Text>

                    <Stack gap="lg">
                        <Group align="flex-start">
                            <ThemeIcon color="red" size={32} radius="md"><IconAlertTriangle /></ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>Climate Change</Text>
                                <Text c="dimmed">Rising temperatures are destroying traditional stream-grown wasabi habitats.</Text>
                            </Box>
                        </Group>
                        <Group align="flex-start">
                            <ThemeIcon color="orange" size={32} radius="md"><IconRotateClockwise /></ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>Aging Population</Text>
                                <Text c="dimmed">The labor force for traditional cultivation is declining rapidly.</Text>
                            </Box>
                        </Group>
                        <Group align="flex-start">
                            <ThemeIcon color="wasabi" size={32} radius="md"><IconWorld /></ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>Skyrocketing Global Demand</Text>
                                <Text c="dimmed">Global expansion of Japanese cuisine has created a 300% demand surge.</Text>
                            </Box>
                        </Group>
                    </Stack>
                </Box>

                <Card shadow="sm" padding="xl" radius="lg" withBorder bg="var(--mantine-color-gray-0)">
                    <Title order={3} mb="lg">Why Smart Farms are the Solution</Title>
                    <Text mb="md">
                        Our Aeroponic technology circumvents traditional limitations.
                    </Text>
                    <List spacing="sm" mt="md" size="md">
                        <List.Item><b>Year-Round Harvest:</b> No seasonal dependencies.</List.Item>
                        <List.Item><b>Ultra-High Quality:</b> Optimal nutrient control via AI.</List.Item>
                        <List.Item><b>Scalability:</b> Can be built anywhere globally.</List.Item>
                    </List>
                </Card>
            </div>

            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={40}>Our Vision: The Wasabi Industry Ecosystem</Title>
                <Paper bg="gray.1" p="xl" radius="lg" mb={40} withBorder>
                    <EcosystemDiagram />
                </Paper>
            </Box>

            {/* Technical Reports Section */}
            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Group justify="space-between" align="center" mb={40}>
                    <Title order={2}>Technical Materials & R&D Reports</Title>
                    <Button component="a" href="/news" variant="subtle" color="wasabi">View All Updates →</Button>
                </Group>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {innovationPosts.length > 0 ? (
                        innovationPosts.map((item: any) => (
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
        </Container>
    );
}

function InsightCard({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
    return (
        <Paper p="xl" radius="md" withBorder>
            <ThemeIcon variant="light" color="wasabi" size={48} radius="md">
                <Icon style={{ width: 28, height: 28 }} />
            </ThemeIcon>
            <Text fw={700} fz="lg" mt="md">{title}</Text>
            <Text c="dimmed" fz="sm" mt="sm">{description}</Text>
        </Paper>
    );
}
