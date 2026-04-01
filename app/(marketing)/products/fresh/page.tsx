'use client';

import { Container, Title, Text, SimpleGrid, Card, Image, Badge, Group, Button, Box, Paper, Grid, List, Stack } from '@mantine/core';
import { EcosystemDiagram } from '@/components/ui/EcosystemDiagram';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

export default function FreshProductsPage() {
    const { t } = useTranslation();

    const products = [
        {
            title: t('prod_fresh_p1_title'),
            description: t('prod_fresh_p1_desc'),
            image: '/images/wasabi-rhizomes.jpg',
            badge: t('prod_fresh_p1_badge'),
            link: '/products/fresh/rhizome',
        },
        {
            title: t('prod_fresh_p2_title'),
            description: t('prod_fresh_p2_desc'),
            image: '/images/wasabi-leaves.jpg',
            badge: t('prod_fresh_p2_badge'),
            link: '/products/fresh/leaf',
        },
        {
            title: t('prod_fresh_p3_title'),
            description: t('prod_fresh_p3_desc'),
            image: '/images/wasabi-stems.jpg',
            badge: t('prod_fresh_p3_badge'),
            link: '/products/fresh/stem',
        },
    ];

    return (
        <Container size="xl" py="xl">
            <Title order={1} ta="center" mb="sm">{t('prod_fresh_title')}</Title>
            <Text c="dimmed" ta="center" mb="xl" maw={600} mx="auto">
                {t('prod_fresh_desc')}
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                {products.map((product) => (
                    <Card key={product.title} shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                                src={product.image}
                                height={240}
                                alt={product.title}
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={700} size="lg">{product.title}</Text>
                            {product.badge && <Badge color="wasabi" variant="light">{product.badge}</Badge>}
                        </Group>

                        <Text size="sm" c="dimmed" h={50} mb="md">
                            {product.description}
                        </Text>

                        <Button
                            component={Link}
                            href={product.link}
                            variant="light"
                            color="wasabi"
                            fullWidth
                            mt="auto"
                            rightSection={<IconArrowRight size={16} />}
                        >
                            {t('prod_fresh_btn_detail')}
                        </Button>
                    </Card>
                ))}
            </SimpleGrid>

            {/* 15 Minute Rule */}
            <Card shadow="md" radius="lg" p={0} mb={80} mt={80} withBorder style={{ overflow: 'hidden' }}>
                <Grid gutter={0} align="center">
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Image src="/images/tech-flavor-timer.jpg" alt="Wasabi Peak Flavor" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 7 }} p="xl">
                        <Stack>
                            <Badge color="red" size="lg" variant="filled">Critical Freshness</Badge>
                            <Title order={2}>{t('prod_fresh_rule_title')}</Title>
                            <Text size="lg">
                                {t('prod_fresh_rule_desc')}
                            </Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>

            {/* Industrial Apps */}
            <Box mt={100} py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={10}>{t('prod_fresh_app_title')}</Title>
                <Text ta="center" c="dimmed" mb={50} maw={800} mx="auto">
                    {t('prod_fresh_app_desc')}
                </Text>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    <Card shadow="sm" padding="xl" radius="lg" withBorder style={{ border: '2px solid var(--mantine-color-wasabi-2)' }}>
                        <Card.Section>
                            <Image src="/images/wasabi-meat-pairing.jpg" height={220} alt="K-BBQ" />
                        </Card.Section>
                        <Title order={4} mt="md" mb="xs">{t('prod_fresh_app_kfood')}</Title>
                        <Text size="sm" c="dimmed">{t('prod_fresh_app_kfood_desc')}</Text>
                    </Card>

                    <Card shadow="sm" padding="xl" radius="lg" withBorder>
                        <Card.Section>
                            <Image src="/images/wasabi_med_cosmetic_pro.jpg" height={220} alt="Medical & Bio" />
                        </Card.Section>
                        <Title order={4} mt="md" mb="xs">{t('prod_fresh_app_bio')}</Title>
                        <Text size="sm" c="dimmed">{t('prod_fresh_app_bio_desc')}</Text>
                    </Card>

                    <Card shadow="sm" padding="xl" radius="lg" withBorder>
                        <Card.Section>
                            <Image src="/images/wasabi-nutrients-pro.jpg" height={220} alt="Functional Food" />
                        </Card.Section>
                        <Title order={4} mt="md" mb="xs">{t('prod_fresh_app_functional')}</Title>
                        <Text size="sm" c="dimmed">{t('prod_fresh_app_functional_desc')}</Text>
                    </Card>
                </SimpleGrid>
            </Box>
        </Container>
    );
}
