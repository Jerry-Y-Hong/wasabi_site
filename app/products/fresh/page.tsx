'use client';

import { Container, Title, Text, SimpleGrid, Card, Image, Badge, Group, Button, Box, Paper, Grid, List } from '@mantine/core';
import { EcosystemDiagram } from '@/components/ui/EcosystemDiagram';

const products = [
    {
        title: 'Wasabi Rhizome',
        description: 'The highest value part of the plant. Our smart farm produces premium rhizomes with intense flavor in 12 months.',
        price: '₩250,000 - ₩500,000 / kg',
        image: '/images/wasabi-rhizomes.jpg',
        badge: 'Premium Grade',
    },
    {
        title: 'Wasabi Leaves',
        description: 'Fresh leaves harvested every 10-14 days. Ideal for ssam, pickling (jang-ajji), or functional ingredients.',
        price: '₩20,000 - ₩30,000 / kg',
        image: '/images/wasabi-leaves.jpg',
        badge: 'Year-Round Harvest',
    },
    {
        title: 'Wasabi Stems',
        description: 'Crunchy and flavorful stems harvested frequently. High in nutritional value and perfect for pastes.',
        price: '₩20,000 - ₩30,000 / kg',
        image: '/images/wasabi-stems.jpg',
        badge: 'Fresh Daily',
    },
];

export default function FreshProductsPage() {
    return (
        <Container size="xl" py="xl">
            <Title order={1} ta="center" mb="sm">Fresh Wasabi Products</Title>
            <Text c="dimmed" ta="center" mb="xl" maw={600} mx="auto">
                Harvested daily from our vertical smart farms. Pesticide-free and full of natural flavor.
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {products.map((product) => (
                    <Card key={product.title} shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                                src={product.image}
                                height={200}
                                alt={product.title}
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>{product.title}</Text>
                            {product.badge && <Badge color="wasabi">{product.badge}</Badge>}
                        </Group>

                        <Text size="sm" c="dimmed" h={50}>
                            {product.description}
                        </Text>

                        <Group mt="md" justify="space-between" align="center">
                            <Text fw={700} size="xl" c="wasabi">{product.price}</Text>
                            <Button variant="light" color="wasabi" radius="md">
                                Order Now
                            </Button>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>

            <Box mt={100} py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={10}>Industrial Applications & Marketability</Title>
                <Text ta="center" c="dimmed" mb={50} maw={800} mx="auto">
                    Our premium wasabi is not just food—it's a high-value raw material for global industries.
                    Leveraging the unique bioactive compound <b>6-MSITC</b>, we are expanding into multi-billion dollar markets.
                </Text>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    <Card shadow="sm" padding="xl" radius="lg" withBorder style={{ border: '2px solid var(--mantine-color-wasabi-2)' }}>
                        <Card.Section>
                            <Image src="/images/wasabi-meat-pairing.jpg" height={220} alt="K-BBQ & K-Food Wave" />
                        </Card.Section>
                        <Group justify="space-between" mt="md" mb="xs">
                            <Title order={4}>1. K-Culture & Food Revolution</Title>
                            <Badge color="wasabi" variant="filled">K-WAVE</Badge>
                        </Group>
                        <Text size="sm" mb="md" fw={500} c="wasabi.9">
                            Riding the global K-Culture wave, we are redefining "K-Food" with wasabi as the ultimate spice for the K-BBQ phenomenon.
                        </Text>
                        <List size="xs" spacing="xs" mb="lg">
                            <List.Item><b>The K-BBQ Companion:</b> Capitalizing on the global popularity of Korean BBQ, positioning wasabi as the essential protein-pairing seasoning.</List.Item>
                            <List.Item><b>Wasabi Kimchi Synergy:</b> Merging Korea's soul food (Kimchi) with wasabi technology to create a premium "K-Life" gourmet experience.</List.Item>
                            <List.Item><b>Global Seasoning Trend:</b> Developing wasabi-based sauces and powders that fit the "Healthy & Spicy" K-Food lifestyle demanded by Gen Z worldwide.</List.Item>
                        </List>
                        <Badge variant="light" color="red">Market: Global K-Food Enthusiasts</Badge>
                    </Card>

                    <Card shadow="sm" padding="xl" radius="lg" withBorder>
                        <Card.Section>
                            <Image src="/images/wasabi_med_cosmetic_pro.jpg" height={220} alt="Medical & Bio" />
                        </Card.Section>
                        <Title order={4} mt="md" mb="xs">2. Medical & Bio-Sector</Title>
                        <Text size="sm" c="dimmed" mb="md">
                            Utilizing antimicrobial and anti-inflammatory properties for <b>Natural Preservatives</b> and
                            high-end <b>Cosmaceuticals</b> targeting sensitive skin.
                        </Text>
                        <Badge variant="light" color="blue">Market: $15B+ (Natural Extracts)</Badge>
                    </Card>

                    <Card shadow="sm" padding="xl" radius="lg" withBorder>
                        <Card.Section>
                            <Image src="/images/wasabi-nutrients-pro.jpg" height={220} alt="Health Functional Food" />
                        </Card.Section>
                        <Title order={4} mt="md" mb="xs">3. Health Functional Foods</Title>
                        <Text size="sm" c="dimmed" mb="md">
                            Concentrated capsules of <b>6-MSITC</b> for cognitive health (memory improvement)
                            and metabolic support. Rich in antioxidants and essential minerals.
                        </Text>
                        <Badge variant="light" color="wasabi">Market: $200B+ (Supplements)</Badge>
                    </Card>
                </SimpleGrid>

                <Paper mt={60} p="xl" radius="lg" bg="wasabi.0" withBorder>
                    <Grid gutter={40} align="center">
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Paper p="md" radius="md" withBorder bg="white">
                                <EcosystemDiagram />
                            </Paper>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Title order={3} mb="md">Strategic Market Positioning</Title>
                            <Text mb="lg">
                                By establishing a complete value chain from <b>Tissue Culture → Smart Farm → Processing → Global Distribution</b>,
                                we secure a comparative advantage over traditional farmers.
                            </Text>
                            <SimpleGrid cols={2} spacing="md">
                                <Box>
                                    <Text fw={700} c="wasabi.9">Value Creation</Text>
                                    <Text size="sm">Transforming a $50/kg raw product into $500/kg high-purity extracts.</Text>
                                </Box>
                                <Box>
                                    <Text fw={700} c="wasabi.9">Sustainability</Text>
                                    <Text size="sm">Stable supply regardless of climate crisis, meeting ESG requirements.</Text>
                                </Box>
                            </SimpleGrid>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}
