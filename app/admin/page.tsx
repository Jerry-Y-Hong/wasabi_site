'use client';

import { Container, Title, Text, SimpleGrid, Paper, Group, Stack, Card, ThemeIcon, Badge, Button, Avatar } from '@mantine/core';
import { IconMail, IconTrendingUp, IconUsers, IconSearch, IconPencil, IconMovie, IconInbox, IconMessageCircle, IconSettings, IconShare } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/lib/actions';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PipelineStatusChart, InquiryTypeChart } from '@/components/DashboardCharts';

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
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const data = await getDashboardStats();
        setStats(data);
    };

    if (!stats) return (
        <Container py="xl" h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text c="dimmed" size="lg">Initializing Sales Command Center...</Text>
        </Container>
    );

    const totalPipeline = stats.pipeline.total;
    const proposalSent = stats.pipeline.statusCounts['Proposal Sent'] || 0;
    const proceeding = stats.pipeline.statusCounts['Proceeding'] || 0;
    const contracted = stats.pipeline.statusCounts['Contracted'] || 0;

    const activeLeads = proceeding + contracted;

    return (
        <Container size="xl" py={40} bg="gray.0" style={{ minHeight: '100vh', borderRadius: '16px' }}>
            {/* Header Section */}
            <Group justify="space-between" align="flex-end" mb={40}>
                <div>
                    <Badge variant="dot" color="wasabi" size="lg" mb="xs">Live Overview</Badge>
                    <Title order={1} style={{ fontSize: '2.2rem' }}>
                        Executive <Text span c="grape" inherit>Dashboard</Text> <Badge color="red" variant="light" size="sm" style={{ verticalAlign: 'middle' }}>SECURE v2.1</Badge>
                    </Title>
                    <Text c="dimmed" size="lg" mt={5}>Good morning, CEO. Your sales engine is running.</Text>
                </div>
                <Group>
                    <Button component={Link} href="/admin/hunter" size="md" color="black" variant="filled" leftSection={<IconSearch size={18} />}>
                        Open Hunter
                    </Button>
                    <Button onClick={handleLogout} size="md" color="red" variant="light">
                        Logout
                    </Button>
                </Group>
            </Group>

            {/* KPI Cards */}
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={40}>
                <StatsCard
                    title="Total Pipeline"
                    value={totalPipeline.toString()}
                    description="Potential partners discovered"
                    icon={IconUsers}
                    color="grape"
                    trend="+12% this week"
                />
                <StatsCard
                    title="Active Discussions"
                    value={activeLeads.toString()}
                    description="High potential deals"
                    icon={IconTrendingUp}
                    color="teal"
                    trend="Focus here"
                />
                <StatsCard
                    title="Inquiries Received"
                    value={stats.inquiries.total.toString()}
                    description="Incoming from website"
                    icon={IconMail}
                    color="blue"
                    trend="Response required"
                />
            </SimpleGrid>

            {/* New Charts Section */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb={40}>
                <PipelineStatusChart data={stats.pipeline.statusCounts} />
                <InquiryTypeChart
                    data={stats.inquiries.categoryCounts || {}}
                />
            </SimpleGrid>

            {/* Quick Actions & Recent Inquiries (Re-organized) */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Card withBorder radius="md" p="lg" bg="white">
                    <Title order={4} mb="md" c="dimmed" tt="uppercase" size="xs" fw={700}>Quick Actions</Title>
                    <SimpleGrid cols={2}>
                        <Button component={Link} href="/admin/studio" variant="light" color="orange" fullWidth leftSection={<IconMovie size={16} />}>
                            AI Video Producer
                        </Button>
                        <Button component={Link} href="/admin/blog" variant="light" color="wasabi" fullWidth leftSection={<IconPencil size={16} />}>
                            Write Blog (AI)
                        </Button>
                        <Button component={Link} href="/admin/marketing" variant="light" color="grape" fullWidth leftSection={<IconShare size={16} />}>
                            Smart Marketing
                        </Button>
                        <Button variant="light" color="gray" fullWidth leftSection={<IconSettings size={16} />} disabled>
                            Settings
                        </Button>
                    </SimpleGrid>
                </Card>

                <Card withBorder radius="md" p="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>Recent Inquiries</Title>
                        <Button variant="subtle" size="xs" color="gray" disabled>View All</Button>
                    </Group>

                    {stats.inquiries.recent.length === 0 ? (
                        <Stack align="center" justify="center" h={150} c="dimmed">
                            <IconMail size={32} stroke={1.5} />
                            <Text size="sm">No incoming inquiries yet.</Text>
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
function xl_rem(base: number) { return '3rem'; }

function LegendItem({ color, label, value }: any) {
    return (
        <Group gap="sm">
            <Badge color={color.split('.')[0]} variant="filled" size="xs" circle />
            <Text size="sm" c="dimmed" style={{ flex: 1 }}>{label}</Text>
            <Text size="sm" fw={600}>{value}</Text>
        </Group>
    );
}
