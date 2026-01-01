'use client';

import { Container, Title, Text, SimpleGrid, Card, ThemeIcon, Stack, Group, Box, Button, Paper, Badge } from '@mantine/core';
import { IconSchool, IconMicroscope, IconWorld, IconCertificate, IconMessage2, IconUsers, IconTent } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function PartnershipPage() {
    const { t } = useTranslation();

    return (
        <Container size="xl" py={80}>
            {/* Hero Section */}
            <Box ta="center" mb={80}>
                <Badge variant="dot" color="wasabi" size="xl" mb="md">{t('part_hero_badge')}</Badge>
                <Title order={1} size="48px" mb="xl">{t('part_hero_title')}</Title>
                <Text c="dimmed" size="xl" maw={900} mx="auto">
                    {t('part_hero_desc')}
                </Text>
            </Box>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80} mb={100}>
                <Stack gap="xl">
                    <Box>
                        <Title order={2} mb="lg" c="wasabi.8">{t('part_pillar_title')}</Title>
                        <Text size="lg" mb="xl">
                            {t('part_pillar_desc')}
                        </Text>
                    </Box>

                    <CollaborationItem
                        icon={IconMicroscope}
                        title={t('part_item_1_title')}
                        description={t('part_item_1_desc')}
                    />
                    <CollaborationItem
                        icon={IconWorld}
                        title={t('part_item_2_title')}
                        description={t('part_item_2_desc')}
                    />
                    <CollaborationItem
                        icon={IconUsers}
                        title={t('part_item_3_title')}
                        description={t('part_item_3_desc')}
                    />
                    <CollaborationItem
                        icon={IconTent}
                        title={t('part_item_4_title')}
                        description={t('part_item_4_desc')}
                    />
                </Stack>

                <Card padding="xl" radius="lg" withBorder shadow="md" bg="gray.0">
                    <Title order={3} mb="xl">{t('part_prop_title')}</Title>
                    <Stack gap="md">
                        <Paper p="md" radius="md" withBorder>
                            <Group>
                                <ThemeIcon color="wasabi" size="lg" radius="xl"><IconCertificate /></ThemeIcon>
                                <Box>
                                    <Text fw={700}>{t('part_card_1_title')}</Text>
                                    <Text size="sm" c="dimmed">{t('part_card_1_desc')}</Text>
                                </Box>
                            </Group>
                        </Paper>
                        <Paper p="md" radius="md" withBorder>
                            <Group>
                                <ThemeIcon color="blue" size="lg" radius="xl"><IconSchool /></ThemeIcon>
                                <Box>
                                    <Text fw={700}>{t('part_card_2_title')}</Text>
                                    <Text size="sm" c="dimmed">{t('part_card_2_desc')}</Text>
                                </Box>
                            </Group>
                        </Paper>
                    </Stack>

                    <Button
                        component={Link}
                        href="/contact?subject=partnership"
                        mt={40}
                        size="lg"
                        color="wasabi"
                        rightSection={<IconMessage2 size={20} />}
                        fullWidth
                    >
                        {t('part_btn_proposal')}
                    </Button>
                </Card>
            </SimpleGrid>

            {/* Investor Relations Link */}
            <Box ta="center" py={40} mb={60} bg="gray.0" style={{ borderRadius: '16px' }}>
                <Title order={2} mb="md">{t('part_inv_title')}</Title>
                <Text c="dimmed" mb="xl">
                    {t('part_inv_desc')}
                </Text>
                <Button component={Link} href="/invest" size="lg" variant="outline" color="dark">
                    {t('part_inv_btn')} &rarr;
                </Button>
            </Box>

            {/* Global Vision */}
            <Box ta="center" py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} mb="lg">Global Vision 2030</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    <StatCard label={t('part_stats_1')} value="50+" color="blue" />
                    <StatCard label={t('part_stats_2')} value="30 Cities" color="wasabi" />
                    <StatCard label={t('part_stats_3')} value="20+" color="orange" />
                </SimpleGrid>
            </Box>
        </Container>
    );
}

function CollaborationItem({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <Group align="flex-start" wrap="nowrap">
            <ThemeIcon variant="light" color="wasabi" size={48} radius="md">
                <Icon style={{ width: 28, height: 28 }} />
            </ThemeIcon>
            <Box>
                <Text fw={700} fz="lg">{title}</Text>
                <Text c="dimmed" mt={4}>{description}</Text>
            </Box>
        </Group>
    );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <Paper p="xl" radius="md" withBorder ta="center">
            <Text size="sm" c="dimmed" tt="uppercase" fw={700}>{label}</Text>
            <Text size="32px" fw={900} c={color}>{value}</Text>
        </Paper>
    );
}
