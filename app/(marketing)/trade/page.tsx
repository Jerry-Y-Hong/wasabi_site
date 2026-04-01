'use client';

import { Container, Title, Text, Button, Group, SimpleGrid, Card, ThemeIcon, Badge, Box } from '@mantine/core';
import { IconWorld, IconShip, IconBuildingStore, IconArrowRight, IconSearch } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function TradePage() {
    const { t } = useTranslation();

    return (
        <Box>
            {/* Hero Section */}
            <Box
                py={120}
                style={{
                    background: 'var(--bg-gradient-mint)',
                    backgroundColor: '#f0fbff'
                }}
            >
                <Container size="lg">
                    <Stack align="center" gap="xl">
                        <Badge size="xl" variant="gradient" gradient={{ from: 'cyan', to: 'blue' }}>Global B2B Platform</Badge>
                        <Title order={1} ta="center" fz={56} fw={800}>
                            {t('trade_hero_title')}
                        </Title>
                        <Text ta="center" size="xl" c="dimmed" maw={700} mx="auto">
                            {t('trade_hero_subtitle')}
                        </Text>
                        <Group mt="xl">
                            <Button size="xl" color="cyan" radius="md" leftSection={<IconSearch size={20} />}>
                                {t('btn_access_hunter')}
                            </Button>
                            <Button component={Link} href="/contact" size="xl" variant="default" radius="md">
                                {t('nav_trade_partner')}
                            </Button>
                        </Group>
                    </Stack>
                </Container>
            </Box>

            {/* Features Grid */}
            <Container size="xl" py={100}>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing={50}>
                    <Card withBorder padding="xl" radius="md" shadow="sm">
                        <ThemeIcon size={60} radius="md" variant="light" color="indigo" mb="xl">
                            <IconWorld size={32} />
                        </ThemeIcon>
                        <Text fz="lg" fw={700} mb="sm">
                            {t('trade_feat_network')}
                        </Text>
                        <Text size="sm" c="dimmed" mb="md">
                            {t('trade_feat_network_desc')}
                        </Text>
                    </Card>

                    <Card withBorder padding="xl" radius="md" shadow="sm">
                        <ThemeIcon size={60} radius="md" variant="light" color="cyan" mb="xl">
                            <IconShip size={32} />
                        </ThemeIcon>
                        <Text fz="lg" fw={700} mb="sm">
                            {t('trade_feat_logistics')}
                        </Text>
                        <Text size="sm" c="dimmed" mb="md">
                            {t('trade_feat_logistics_desc')}
                        </Text>
                    </Card>

                    <Card withBorder padding="xl" radius="md" shadow="sm">
                        <ThemeIcon size={60} radius="md" variant="light" color="violet" mb="xl">
                            <IconBuildingStore size={32} />
                        </ThemeIcon>
                        <Text fz="lg" fw={700} mb="sm">
                            {t('trade_feat_sourcing')}
                        </Text>
                        <Text size="sm" c="dimmed" mb="md">
                            {t('trade_feat_sourcing_desc')}
                        </Text>
                    </Card>
                </SimpleGrid>
            </Container>
        </Box>
    );
}

// Helper component for Stack if not imported
import { Stack } from '@mantine/core';
