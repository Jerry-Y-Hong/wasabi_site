'use client';

import {
    Container,
    Title,
    Text,
    Card,
    Badge,
    Group,
    ThemeIcon,
    Stack,
    Loader,
    Box,
    SimpleGrid,
    Button,
    Divider,
    Paper,
    Avatar
} from '@mantine/core';
import {
    IconRocket,
    IconExternalLink,
    IconBuildingSkyscraper,
    IconWind,
    IconDroplet,
    IconRobot,
    IconFileDescription,
    IconWorld
} from '@tabler/icons-react';
import { getHunterResults } from '@/lib/actions';
import { useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';

const PILLAR_ICONS: Record<string, any> = {
    '건축 및 설계': IconBuildingSkyscraper,
    '재배 시스템': IconBuildingSkyscraper,
    '배지 솔루션': IconBuildingSkyscraper,
    '냉난방 설비': IconWind,
    '공조 시스템': IconWind,
    '기류 제어': IconWind,
    '양액 기계': IconDroplet,
    '관수 설비': IconDroplet,
    '인공 광원': IconDroplet,
    '운영 SW': IconRobot,
    'IoT 하드웨어': IconRobot,
    '로봇/자동화': IconRobot
};

export default function TechSpotlightPage() {
    const { t } = useTranslation();
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getHunterResults();
                const publicOnly = (data || []).filter((p: any) => p.isPublic);
                setPartners(publicOnly);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <Container size="xl" py={60}>
            {/* Legend Hero Section */}
            <Box mb={60} ta="center">
                <Badge size="lg" variant="filled" color="green" mb="md" leftSection={<IconRocket size={14} />}>TECH SPOTLIGHT</Badge>
                <Title order={1} size={48} mb="sm" fw={900}>
                    {t('tech_spotlight_title')}
                </Title>
                <Text c="dimmed" size="lg" maw={700} mx="auto">
                    {t('tech_spotlight_subtitle')}
                </Text>
            </Box>

            {loading ? (
                <Stack align="center" py={100}>
                    <Loader color="green" size="xl" type="bars" />
                    <Text c="dimmed" fw={500}>{t('tech_loading')}</Text>
                </Stack>
            ) : partners.length > 0 ? (
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
                    {partners.map((p) => {
                        const Icon = PILLAR_ICONS[p.category] || IconRocket;
                        return (
                            <Card key={p.id} withBorder shadow="md" radius="lg" p="xl" style={{ transition: 'transform 0.2s', cursor: 'default' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Stack gap="md" h="100%">
                                    <Group justify="space-between" align="flex-start">
                                        <ThemeIcon size={50} radius="md" color="green.1" variant="light">
                                            <Icon size={30} color="var(--mantine-color-green-7)" />
                                        </ThemeIcon>
                                        <Badge variant="outline" color="gray" size="sm">{p.country || 'Global'}</Badge>
                                    </Group>

                                    <div>
                                        <Title order={3} mb={4}>{p.name}</Title>
                                        <Badge size="xs" color="green" variant="light">{p.category}</Badge>
                                    </div>

                                    {p.aiSummary?.analysis && (
                                        <Text size="sm" c="dimmed" lineClamp={3}>
                                            {p.aiSummary.analysis}
                                        </Text>
                                    )}

                                    {p.techSpecs && p.techSpecs.length > 0 && (
                                        <Box mt="xs">
                                            <Divider label={t('tech_stats_label')} labelPosition="center" mb="sm" />
                                            <SimpleGrid cols={2} spacing="xs">
                                                {p.techSpecs.slice(0, 4).map((s: any, idx: number) => (
                                                    <Paper key={idx} withBorder p={8} radius="sm" bg="gray.0">
                                                        <Text size="10px" fw={700} c="dimmed" tt="uppercase">{s.label}</Text>
                                                        <Text size="xs" fw={700} truncate>{s.value}</Text>
                                                    </Paper>
                                                ))}
                                            </SimpleGrid>
                                        </Box>
                                    )}

                                    <Group mt="auto" pt="md">
                                        <Button
                                            component="a"
                                            href={p.url}
                                            target="_blank"
                                            variant="light"
                                            color="green"
                                            fullWidth
                                            leftSection={<IconWorld size={16} />}
                                        >
                                            Visit Solutions
                                        </Button>
                                        {p.catalogs && p.catalogs.length > 0 && (
                                            <Button
                                                component="a"
                                                href={p.catalogs[0]}
                                                target="_blank"
                                                variant="subtle"
                                                color="gray"
                                                size="xs"
                                                fullWidth
                                                leftSection={<IconFileDescription size={14} />}
                                            >
                                                View Official Catalog
                                            </Button>
                                        )}
                                    </Group>
                                </Stack>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            ) : (
                <Stack align="center" py={120} c="dimmed">
                    <ThemeIcon size={80} radius="xl" color="gray.2" variant="light" mb="md">
                        <IconRocket size={40} opacity={0.3} />
                    </ThemeIcon>
                    <Title order={3}>{t('tech_coming_soon')}</Title>
                    <Text>{t('tech_verifying')}</Text>
                </Stack>
            )}
        </Container>
    );
}
