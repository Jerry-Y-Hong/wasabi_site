
'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Tabs, Paper, SimpleGrid, Card, Group, Button, Badge, Stack, ThemeIcon, rem } from '@mantine/core';
import { CreativeDirectorDashboard } from '@/components/AI/CreativeDirectorDashboard';
import { DesignArchitectDashboard } from '@/components/AI/DesignArchitectDashboard';
import { DataAnalystDashboard } from '@/components/AI/DataAnalystDashboard';
import { StrategyCSODashboard } from '@/components/AI/StrategyCSODashboard';
import { PipelineStatusChart, InquiryTypeChart } from '@/components/DashboardCharts';
import { IconPalette, IconSettings, IconChartBar, IconLayout, IconBriefcase, IconHierarchy, IconUsers, IconTrendingUp, IconMail, IconRocket, IconLogout, IconCircleCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import { getDashboardStats } from '@/lib/actions';
import { useTranslation } from '@/lib/i18n';

export default function AdminDashboard() {
    const { t } = useTranslation();
    const router = useRouter();
    const [pipelineData, setPipelineData] = useState<{ [key: string]: number }>({});
    const [inquiryData, setInquiryData] = useState<Record<string, number>>({});
    const [kpis, setKpis] = useState({
        totalPartners: 0,
        activeDeals: 0,
        monthlyInquiries: 0,
        verifiedPartners: 0
    });

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    useEffect(() => {
        const loadStats = async () => {
            const stats = await getDashboardStats();
            if (stats) {
                setPipelineData(stats.pipeline.statusCounts);
                setInquiryData(stats.inquiries.categoryCounts);
                
                // Calculate high potential for KPI
                const total = stats.pipeline.total || 0;
                const active = stats.pipeline.statusCounts['Contacted'] || 0;
                
                setKpis({
                    totalPartners: total,
                    activeDeals: active + (stats.pipeline.statusCounts['Negotiating'] || 0),
                    monthlyInquiries: stats.inquiries.total,
                    verifiedPartners: stats.pipeline.verifiedCount || 0
                });
            }
        };
        
        loadStats();
    }, []);

    return (
        <Container size="xl" py="xl">
            <Paper p="xl" radius="md" mb="xl" bg="indigo.0">
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={1} c="indigo.9">{t('admin_dashboard_title')}</Title>
                        <Text c="dimmed">{t('admin_dashboard_subtitle')}</Text>
                    </div>
                    <Group>
                        <Button
                            component={Link}
                            href="/admin/hunter"
                            size="lg"
                            leftSection={<IconRocket size={20} />}
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                        >
                            {t('admin_dashboard_run_hunter')}
                        </Button>
                        <Button
                            onClick={handleLogout}
                            size="lg"
                            leftSection={<IconLogout size={20} />}
                            variant="light"
                            color="red"
                        >
                            {t('admin_dashboard_logout')}
                        </Button>
                    </Group>
                </Group>
            </Paper>

            {/* Business KPIs Section */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>{t('admin_dashboard_kpi_total')}</Text>
                        <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                            <IconUsers size={20} />
                        </ThemeIcon>
                    </Group>
                    <Text size="xl" fw={700}>{kpis.totalPartners}</Text>
                    <Text size="xs" c="dimmed" mt="xs">{t('admin_dashboard_kpi_total_desc')}</Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>{t('admin_dashboard_kpi_active')}</Text>
                        <ThemeIcon color="green" variant="light" size="lg" radius="md">
                            <IconBriefcase size={20} />
                        </ThemeIcon>
                    </Group>
                    <Text size="xl" fw={700}>{kpis.activeDeals}</Text>
                    <Text size="xs" c="dimmed" mt="xs">{t('admin_dashboard_kpi_active_desc')}</Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>{t('admin_dashboard_kpi_monthly')}</Text>
                        <ThemeIcon color="orange" variant="light" size="lg" radius="md">
                            <IconMail size={20} />
                        </ThemeIcon>
                    </Group>
                    <Text size="xl" fw={700}>{kpis.monthlyInquiries}</Text>
                    <Text size="xs" c="dimmed" mt="xs">{t('admin_dashboard_kpi_monthly_desc')}</Text>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder bg="indigo.0">
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>{t('admin_dashboard_kpi_verified')}</Text>
                        <ThemeIcon color="grape" variant="light" size="lg" radius="md">
                            <IconCircleCheck size={20} />
                        </ThemeIcon>
                    </Group>
                    <Text size="xl" fw={700} c="grape.9">{kpis.verifiedPartners}</Text>
                    <Text size="xs" c="dimmed" mt="xs">{t('admin_dashboard_kpi_verified_desc')}</Text>
                </Card>
            </SimpleGrid>

            {/* Charts Section */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
                <PipelineStatusChart data={pipelineData} />
                <InquiryTypeChart data={inquiryData} />
            </SimpleGrid>

            {/* AI Agents Tabs */}

            <Tabs defaultValue="strategy" variant="outline" color="blue">
                <Tabs.List mb="md">
                    <Tabs.Tab value="strategy" leftSection={<IconHierarchy size={16} />}>
                        Control Tower (CSO)
                    </Tabs.Tab>
                    <Tabs.Tab value="creative" leftSection={<IconPalette size={16} />}>
                        Creative (CD)
                    </Tabs.Tab>
                    <Tabs.Tab value="architecture" leftSection={<IconLayout size={16} />}>
                        Architecture (DA)
                    </Tabs.Tab>
                    <Tabs.Tab value="analysis" leftSection={<IconChartBar size={16} />}>
                        Intelligence (BI)
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="strategy">
                    <StrategyCSODashboard />
                </Tabs.Panel>

                <Tabs.Panel value="creative">
                    <CreativeDirectorDashboard />
                </Tabs.Panel>

                <Tabs.Panel value="architecture">
                    <DesignArchitectDashboard />
                </Tabs.Panel>

                <Tabs.Panel value="analysis">
                    <DataAnalystDashboard />
                </Tabs.Panel>
            </Tabs>
        </Container >
    );
}
