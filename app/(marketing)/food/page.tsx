'use client';

import { Container, Title, Text, Button, Group, SimpleGrid, Card, Image, Badge, AspectRatio, Box } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function FoodPage() {
    const { t } = useTranslation();

    const products = [
        {
            title: t('prod_wasabi_name'),
            desc: t('prod_wasabi_desc'),
            image: null, // Placeholder will be used
            badge: 'SIGNATURE'
        },
        {
            title: t('prod_rice_name'),
            desc: t('prod_rice_desc'),
            image: null,
            badge: 'BEST SELLER'
        },
        {
            title: t('prod_sauce_name'),
            desc: t('prod_sauce_desc'),
            image: null,
            badge: 'NEW ARRIVAL'
        }
    ];

    return (
        <Box>
            {/* Hero Section - Minimalist & Atmospheric */}
            <Box
                py={120}
                style={{
                    background: 'var(--bg-gradient-orange)',
                    backgroundColor: '#fff5f0'
                }}
            >
                <Container size="lg">
                    <Stack align="center" gap="xl">
                        <Badge size="lg" variant="dot" color="orange">PREMIUM SELECTION</Badge>
                        <Title order={1} ta="center" fz={64} fw={300} style={{ letterSpacing: '-2px' }}>
                            {t('food_hero_title')}
                        </Title>
                        <Text ta="center" size="xl" c="dimmed" maw={600} mx="auto">
                            {t('food_hero_subtitle')}
                        </Text>
                    </Stack>
                </Container>
            </Box>

            {/* Curated Grid */}
            <Container size="xl" py={100}>
                <Group justify="space-between" mb={60} align="flex-end">
                    <Title order={2} fz={32} fw={400}>{t('food_section_curated')}</Title>
                    <Button variant="subtle" color="dark" rightSection={<IconArrowRight size={16} />}>
                        View All
                    </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={60} verticalSpacing={80}>
                    {products.map((product, index) => (
                        <div key={index}>
                            <AspectRatio ratio={3 / 4} mb="lg" bg="gray.1" style={{ borderRadius: '8px' }}>
                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <Text c="gray.4" fz="lg" fw={700}>PRODUCT IMAGE</Text>
                                </Box>
                            </AspectRatio>

                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Badge variant="light" color="gray" size="sm">{product.badge}</Badge>
                                </Group>
                                <Title order={3} fz={24} fw={500} mt="xs">{product.title}</Title>
                                <Text c="dimmed" lineClamp={2}>{product.desc}</Text>
                                <Button variant="light" color="dark" radius="xl" fullWidth mt="md">
                                    {t('btn_view_detail')}
                                </Button>
                            </Stack>
                        </div>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}

// Helper component for Stack if not imported
import { Stack } from '@mantine/core';
