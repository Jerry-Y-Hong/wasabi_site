'use client';

import { Container, Title, Text, SimpleGrid, Paper, Group, Stack, Card, ThemeIcon, Badge, Button, Avatar, Grid, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMail, IconTrendingUp, IconUsers, IconSearch, IconPencil, IconMovie, IconSettings, IconShare, IconBuildingArch, IconDownload, IconFileAnalytics, IconBox } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/lib/actions';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PipelineStatusChart, InquiryTypeChart } from '@/components/DashboardCharts';
import { useTranslation } from '@/lib/i18n';

interface DashboardStats {
    pipeline: {
        total: number;
        statusCounts: Record<string, number>;
    };
    inquiries: {
        total: number;
        categoryCounts: Record<string, number>;
        recent: any[];
    };
}

export default function AdminDashboard() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const loadStats = async () => {
        const data = await getDashboardStats();
        setStats(data);
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (!stats) return (
        <Container py="xl" h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text c="dimmed" size="lg">{t('admin_dash_init')}</Text>
        </Container>
    );

    const totalPipeline = stats.pipeline.total;
    const proceeding = stats.pipeline.statusCounts['Proceeding'] || 0;
    const contracted = stats.pipeline.statusCounts['Contracted'] || 0;
    const activeLeads = proceeding + contracted;

    return (
        <Container size="xl" py={40} bg="gray.0" style={{ minHeight: '100vh', borderRadius: '16px' }}>
            {/* Header Section */}
            <Group justify="space-between" align="flex-end" mb={40}>
                <div>
                    <Badge variant="dot" color="wasabi" size="lg" mb="xs">{t('admin_dash_badge')}</Badge>
                    <Title order={1} style={{ fontSize: '2.2rem' }}>
                        {t('admin_dash_title')} <Text span c="grape" inherit>{t('admin_dash_title_subtitle')}</Text> <Badge color="red" variant="light" size="sm" style={{ verticalAlign: 'middle' }}>SECURE v2.1</Badge>
                    </Title>
                    <Text c="dimmed" size="lg" mt={5}>{t('admin_dash_greeting')}</Text>
                </div>
                <Group>
                    <Button component={Link} href="/admin/hunter" size="md" color="black" variant="filled" leftSection={<IconSearch size={18} />}>
                        {t('admin_dash_btn_hunter')}
                    </Button>
                    <Button onClick={handleLogout} size="md" color="red" variant="light">
                        {t('admin_dash_btn_logout')}
                    </Button>
                </Group>
            </Group>

            {/* KPI Cards */}
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={40}>
                <StatsCard
                    title={t('admin_dash_kpi_pipeline')}
                    value={totalPipeline.toString()}
                    description={t('admin_dash_kpi_pipeline_desc')}
                    icon={IconUsers}
                    color="grape"
                    trend={t('admin_dash_kpi_trend_week')}
                />
                <StatsCard
                    title={t('admin_dash_kpi_active')}
                    value={activeLeads.toString()}
                    description={t('admin_dash_kpi_active_desc')}
                    icon={IconTrendingUp}
                    color="teal"
                    trend={t('admin_dash_kpi_trend_focus')}
                />
                <StatsCard
                    title={t('admin_dash_kpi_inquiries')}
                    value={stats.inquiries.total.toString()}
                    description={t('admin_dash_kpi_inquiries_desc')}
                    icon={IconMail}
                    color="blue"
                    trend={t('admin_dash_kpi_trend_resp')}
                />
            </SimpleGrid>

            {/* New Charts Section */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb={40}>
                <PipelineStatusChart data={stats.pipeline.statusCounts} />
                <InquiryTypeChart
                    data={stats.inquiries.categoryCounts || {}}
                />
            </SimpleGrid>

            {/* Specialized Tools: Greenhouse Design Integration - Slim Version */}
            <Paper radius="md" p="lg" withBorder bg="dark.7" mb={30} style={{
                backgroundImage: 'linear-gradient(135deg, #1A1B1E 0%, #2C2E33 100%)',
                borderColor: '#404040',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
                <Grid align="center" gutter="md">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Group gap="lg">
                            <ThemeIcon color="cyan" variant="light" size={48} radius="md">
                                <IconBuildingArch size={26} />
                            </ThemeIcon>
                            <Stack gap={2}>
                                <Group gap="xs">
                                    <Badge color="cyan" variant="filled" size="xs">{t('admin_dash_tool_badge')}</Badge>
                                    <Title order={3} c="white" style={{ fontSize: '1.2rem' }}>{t('admin_dash_tool_title')}</Title>
                                </Group>
                                <Text c="gray.5" size="sm">{t('admin_dash_tool_desc')}</Text>
                            </Stack>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Group gap="sm" justify="flex-end">
                            <Button
                                component="a"
                                href="http://www.nongsaro.go.kr"
                                target="_blank"
                                variant="light"
                                color="cyan"
                                size="xs"
                                leftSection={<IconDownload size={14} />}
                            >
                                {t('admin_dash_tool_btn_down')}
                            </Button>
                            <Button
                                variant="filled"
                                color="cyan"
                                size="xs"
                                leftSection={<IconFileAnalytics size={14} />}
                                onClick={() => notifications.show({ title: t('admin_dash_tool_btn_analyze'), message: 'GHModeler result files ready?', color: 'cyan' })}
                            >
                                {t('admin_dash_tool_btn_analyze')}
                            </Button>
                        </Group>
                    </Grid.Col>
                </Grid>
            </Paper>

            {/* Quick Actions & Recent Inquiries (Re-organized) */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Card withBorder radius="md" p="lg" bg="white">
                    <Title order={4} mb="md" c="dimmed" tt="uppercase" size="xs" fw={700}>{t('admin_dash_quick_actions')}</Title>
                    <SimpleGrid cols={2}>
                        <Button component={Link} href="/admin/studio" variant="light" color="orange" fullWidth leftSection={<IconMovie size={16} />}>
                            {t('admin_dash_action_video')}
                        </Button>
                        <Button component={Link} href="/admin/blog" variant="light" color="wasabi" fullWidth leftSection={<IconPencil size={16} />}>
                            {t('admin_dash_action_blog')}
                        </Button>
                        <Button component={Link} href="/admin/marketing" variant="light" color="grape" fullWidth leftSection={<IconShare size={16} />}>
                            {t('admin_dash_action_marketing')}
                        </Button>
                        <Button component={Link} href="/admin/inventory" variant="light" color="cyan" fullWidth leftSection={<IconBox size={16} />}>
                            {t('admin_dash_action_inventory')}
                        </Button>
                    </SimpleGrid>
                </Card>

                <Card withBorder radius="md" p="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>{t('admin_dash_recent_inquiries')}</Title>
                        <Button variant="subtle" size="xs" color="gray" disabled>{t('admin_dash_view_all')}</Button>
                    </Group>

                    {stats.inquiries.recent.length === 0 ? (
                        <Stack align="center" justify="center" h={150} c="dimmed">
                            <IconMail size={32} stroke={1.5} />
                            <Text size="sm">{t('admin_dash_no_inquiries')}</Text>
                        </Stack>
                    ) : (
                        <Stack gap="sm">
                            {stats.inquiries.recent.slice(0, 3).map((item: any, idx: number) => (
                                <Group key={idx} wrap="nowrap" align="flex-start">
                                    <Avatar color={item.type === 'Consulting' ? 'wasabi' : 'blue'} radius="xl">
                                        {item.name.charAt(0)}
                                    </Avatar>
                                    <div style={{ flex: 1 }}>
                                        <Group justify="space-between">
                                            <Text size="sm" fw={500}>{item.name}</Text>
                                            <Text size="xs" c="dimmed">{new Date(item.timestamp).toLocaleDateString()}</Text>
                                        </Group>
                                        <Text size="xs" c="dimmed" lineClamp={1}>
                                            {item.subject || item.title}
                                        </Text>
                                        <Badge size="xs" variant="outline" mt={4} color={item.type === 'Consulting' ? 'wasabi' : 'blue'}>
                                            {item.type}
                                        </Badge>
                                    </div>
                                </Group>
                            ))}
                        </Stack>
                    )}
                </Card>
            </SimpleGrid>
        </Container>
    );
}

// Sub-components for cleaner code
function StatsCard({ title, value, description, icon: Icon, color, trend }: any) {
    return (
        <Paper withBorder p="lg" radius="md" shadow="sm">
            <Group justify="space-between" align="flex-start" mb="xs">
                <div>
                    <Text c="dimmed" tt="uppercase" fw={700} size="xs" mb={4}>{title}</Text>
                    <Text fw={700} style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</Text>
                </div>
                <ThemeIcon color={color} variant="light" size={xl_rem(3)} radius="md">
                    <Icon size="1.8rem" stroke={1.5} />
                </ThemeIcon>
            </Group>
            <Group gap={8} mt="lg">
                <Badge variant="light" color={color} size="sm">{trend}</Badge>
                <Text size="xs" c="dimmed">{description}</Text>
            </Group>
        </Paper>
    );
}

// Helper for consistent sizing if needed, or simply use strings
function xl_rem(_base: number) { return '3rem'; }

function LegendItem({ color, label, value }: any) {
    return (
        <Group gap="sm">
            <Badge color={color.split('.')[0]} variant="filled" size="xs" circle />
            <Text size="sm" c="dimmed" style={{ flex: 1 }}>{label}</Text>
            <Text size="sm" fw={600}>{value}</Text>
        </Group>
    );
}
