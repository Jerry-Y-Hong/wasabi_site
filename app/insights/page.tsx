'use client';

import { Container, Title, Text, SimpleGrid, Card, ThemeIcon, Stack, Group, Box, Badge, List, Paper, Image } from '@mantine/core';
import { IconChartLine, IconAlertTriangle, IconRotateClockwise, IconWorld, IconFlask, IconSparkles } from '@tabler/icons-react';
import { EcosystemDiagram } from '@/components/ui/EcosystemDiagram';

export default function InsightsPage() {
    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60} gap="xs">
                <Badge variant="filled" color="wasabi" size="lg">Market Insights</Badge>
                <Title order={1} ta="center" size="h1">The Global Wasabi Opportunity</Title>
                <Text c="dimmed" ta="center" maw={800} size="lg">
                    Traditional wasabi cultivation is facing a global crisis, creating a massive "Blue Ocean" opportunity
                    for technology-driven smart farms.
                </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} mb={80}>
                <Box>
                    <Title order={2} mb="md" c="wasabi.7">Global Supply Crisis</Title>
                    <Text size="lg" mb="xl">
                        Main production hubs, particularly in Japan, are seeing a rapid decline in output due to:
                    </Text>

                    <Stack gap="lg">
                        <Group align="flex-start">
                            <ThemeIcon color="red" size={32} radius="md">
                                <IconAlertTriangle />
                            </ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>Climate Change</Text>
                                <Text c="dimmed">Rising temperatures are destroying the delicate balance required for traditional stream-grown wasabi.</Text>
                            </Box>
                        </Group>

                        <Group align="flex-start">
                            <ThemeIcon color="orange" size={32} radius="md">
                                <IconRotateClockwise />
                            </ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>Aging Population</Text>
                                <Text c="dimmed">Traditional cultivation is labor-intensive; the average age of farmers is rising, leading to farm closures.</Text>
                            </Box>
                        </Group>

                        <Group align="flex-start">
                            <ThemeIcon color="wasabi" size={32} radius="md">
                                <IconWorld />
                            </ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>Skyrocketing Global Demand</Text>
                                <Text c="dimmed">The global expansion of Japanese cuisine and the "health-conscious" food movement has created a 300% demand surge over the last decade.</Text>
                            </Box>
                        </Group>
                    </Stack>
                </Box>

                <Card shadow="sm" padding="xl" radius="lg" withBorder bg="var(--mantine-color-gray-0)">
                    <Title order={3} mb="lg">Why Smart Farms are the Solution</Title>
                    <Text mb="md">
                        Our Aeroponic technology circumvents every limitation of traditional farming.
                        By digitizing the environment, we achieve:
                    </Text>
                    <List spacing="sm" mt="md" size="md">
                        <List.Item><b>Year-Round Harvest:</b> No seasonal dependencies.</List.Item>
                        <List.Item><b>Ultra-High Quality:</b> Optimal nutrient control via AI.</List.Item>
                        <List.Item><b>Scalability:</b> Can be built anywhere globally, closer to consumption hubs.</List.Item>
                    </List>
                </Card>
            </SimpleGrid>

            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={40}>Nutritional Science of Wasabi Leaf</Title>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                    <Paper p="xl" radius="lg" withBorder bg="wasabi.0">
                        <Title order={3} mb="lg" c="wasabi.9">5 Key Bioactive Ingredients</Title>
                        <List spacing="md" size="lg" icon={
                            <ThemeIcon color="wasabi" size={24} radius="xl">
                                <IconSparkles size={16} />
                            </ThemeIcon>
                        }>
                            <List.Item><b>Glucosinolate (Sinigrin):</b> Potent antimicrobial and anti-inflammatory properties.</List.Item>
                            <List.Item><b>Catechin:</b> Powerful antioxidant found in premium green teas.</List.Item>
                            <List.Item><b>Potassium & Magnesium:</b> Essential minerals for heart health and muscle recovery.</List.Item>
                            <List.Item><b>Dietary Fiber:</b> Supports digestive health and satiety.</List.Item>
                            <List.Item><b>6-MSITC:</b> Exclusive compound for memory and cognitive enhancement.</List.Item>
                        </List>
                    </Paper>
                    <Box ta="center">
                        <Image
                            src="/images/wasabi-nutrients-pro.jpg"
                            alt="Wasabi Nutrients"
                            radius="md"
                            style={{ maxWidth: '100%', height: 'auto', boxShadow: 'var(--mantine-shadow-md)' }}
                        />
                    </Box>
                </SimpleGrid>
            </Box>

            <Box py={60}>
                <Title order={2} ta="center" mb={40}>Our Vision: The Wasabi Industry Ecosystem</Title>
                <Text ta="center" mb="xl" c="dimmed" maw={800} mx="auto">
                    We are moving beyond simple farming to create a comprehensive industrial platform that spans food, bio, and experience.
                </Text>
                <Paper bg="gray.1" p="xl" radius="lg" mb={60} style={{ border: '1px solid var(--mantine-color-gray-3)' }}>
                    <EcosystemDiagram />
                </Paper>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    <Paper p="md" radius="md" withBorder>
                        <Title order={4} mb="xs">Diversified Industrial Clusters</Title>
                        <Text size="sm">Our platform integrates <b>Regional Revitalization</b>, <b>Franchise Bakery Cafes</b>, <b>Theme Park Industries</b>, and <b>Pharmaceutical Raw Materials</b>.</Text>
                    </Paper>
                    <Paper p="md" radius="md" withBorder>
                        <Title order={4} mb="xs">Social Impact & Welfare</Title>
                        <Text size="sm">Creating sustainable jobs through social enterprise models and eco-friendly smart farm complexes for regional balance.</Text>
                    </Paper>
                    <Paper p="md" radius="md" withBorder>
                        <Title order={4} mb="xs">Wasabi Kimchi & Global Cuisine</Title>
                        <Text size="sm">Pioneering new food categories like premium <b>Wasabi Kimchi</b>, targeting the global K-food market with unique spicy and clean flavors.</Text>
                    </Paper>
                </SimpleGrid>
            </Box>

            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={40}>Expansion into Food Processing & Bio-Sector</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    <InsightCard
                        title="High-Value Processing"
                        description="Beyond fresh rhizomes, we are expanding into processed pastes, oils, and seasonings that command premium prices in international retail."
                        icon={IconChartLine}
                    />
                    <InsightCard
                        title="Functional Foods"
                        description="Wasabi contains 6-MSITC, a powerful antioxidant. We are developing functional dietary supplements targeting cognitive and immune health."
                        icon={IconFlask}
                    />
                    <InsightCard
                        title="Cosmetics & Bio"
                        description="Utilizing the antimicrobial properties of wasabi for natural preservatives and luxury skincare ingredients."
                        icon={IconSparkles}
                    />
                </SimpleGrid>
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
