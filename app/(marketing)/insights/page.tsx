'use client';
import { Container, Title, Text, Card, ThemeIcon, Stack, Group, Box, Badge, List, Paper, Image, Button, Loader } from '@mantine/core';
import { IconAlertTriangle, IconRotateClockwise, IconWorld } from '@tabler/icons-react';
import { EcosystemDiagram } from '@/components/ui/EcosystemDiagram';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function InsightsPage() {
    const { t } = useTranslation();
    // 1. Robust State Management with FALLBACK
    const [innovationPosts, setInnovationPosts] = useState<any[]>([
        {
            id: 1,
            title: "[기술 백서] K-Wasabi의 생산성 혁명: 고품질 와사비 조직배양 프로토콜",
            content: "와사비 재배의 혁신적인 조직배양 기술에 대한 상세 보고서...",
            image: "/images/tissue-culture.jpg",
            timestamp: "2024-12-30T10:00:00.000Z",
            category: "Innovation",
            slug: "wasabi-tissue-culture-tech-report"
        }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const connectToData = async () => {
            try {
                // 2. Refresh Cache on Fetch
                const res = await fetch(`/api/posts?t=${Date.now()}`, { cache: 'no-store' });

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const allPosts = await res.json();

                // 3. Filter Logic
                const filtered = Array.isArray(allPosts)
                    ? allPosts.filter((p: any) => p.category === 'Innovation' || p.category === 'Tech Data')
                    : [];

                if (filtered.length > 0) {
                    setInnovationPosts(filtered);
                } else {
                    console.warn('[InsightsPage] API returned 0 innovation posts. Using fallback.');
                }
            } catch (e) {
                console.error('[InsightsPage] Connection Failed:', e);
            } finally {
                setLoading(false);
            }
        };

        connectToData();
    }, []);

    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60} gap="xs">
                <Badge variant="filled" color="wasabi" size="lg">{t('ins_badge')}</Badge>
                <Title order={1} ta="center" size="h1">{t('ins_title')}</Title>
                <Text c="dimmed" ta="center" maw={800} size="lg">
                    {t('ins_desc')}
                </Text>
            </Stack>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '50px',
                marginBottom: '80px'
            }}>
                <Box>
                    <Title order={2} mb="md" c="wasabi.7">{t('ins_crisis_title')}</Title>
                    <Text size="lg" mb="xl">
                        {t('ins_crisis_desc')}
                    </Text>

                    <Stack gap="lg">
                        <Group align="flex-start">
                            <ThemeIcon color="red" size={32} radius="md"><IconAlertTriangle style={{ width: 18, height: 18 }} /></ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>{t('ins_point_1_title')}</Text>
                                <Text c="dimmed">{t('ins_point_1_desc')}</Text>
                            </Box>
                        </Group>
                        <Group align="flex-start">
                            <ThemeIcon color="orange" size={32} radius="md"><IconRotateClockwise style={{ width: 18, height: 18 }} /></ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>{t('ins_point_2_title')}</Text>
                                <Text c="dimmed">{t('ins_point_2_desc')}</Text>
                            </Box>
                        </Group>
                        <Group align="flex-start">
                            <ThemeIcon color="wasabi" size={32} radius="md"><IconWorld style={{ width: 18, height: 18 }} /></ThemeIcon>
                            <Box flex={1}>
                                <Text fw={700}>{t('ins_point_3_title')}</Text>
                                <Text c="dimmed">{t('ins_point_3_desc')}</Text>
                            </Box>
                        </Group>
                    </Stack>
                </Box>

                <Card shadow="sm" padding="xl" radius="lg" withBorder bg="var(--mantine-color-gray-0)">
                    <Title order={3} mb="lg">{t('ins_sol_title')}</Title>
                    <Text mb="md">
                        {t('ins_sol_desc')}
                    </Text>
                    <List spacing="sm" mt="md" size="md">
                        <List.Item><b>{t('ins_sol_item_1_bold')}</b> {t('ins_sol_item_1_desc')}</List.Item>
                        <List.Item><b>{t('ins_sol_item_2_bold')}</b> {t('ins_sol_item_2_desc')}</List.Item>
                        <List.Item><b>{t('ins_sol_item_3_bold')}</b> {t('ins_sol_item_3_desc')}</List.Item>
                    </List>
                </Card>
            </div>

            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} ta="center" mb={40}>{t('ins_ecosystem_title')}</Title>
                <Paper bg="gray.1" p="xl" radius="lg" mb={40} withBorder>
                    <EcosystemDiagram />
                </Paper>
            </Box>

            {/* Technical Reports Section */}
            <Box py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Group justify="space-between" align="center" mb={40}>
                    <Title order={2}>{t('ins_report_title')}</Title>
                    <Button component="a" href="/news" variant="subtle" color="wasabi">{t('ins_report_btn')} →</Button>
                </Group>

                {loading ? (
                    <Group justify="center" py="xl"><Loader color="wasabi" type="dots" /></Group>
                ) : (
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
                                                {item.timestamp ? item.timestamp.split('T')[0] : 'Recent'}
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
                )}
            </Box>
        </Container>
    );
}
