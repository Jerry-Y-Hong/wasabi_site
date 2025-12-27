'use client';

import { Container, Title, Text, SimpleGrid, Paper, Group, Stack, RingProgress, Card, ThemeIcon, Badge, Button, Grid, Avatar } from '@mantine/core';
import { IconMail, IconArrowRight, IconTrendingUp, IconUsers, IconSearch, IconPencil, IconSettings, IconMovie } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/lib/actions';
import Link from 'next/link';

interface DashboardStats {
    pipeline: {
        total: number;
        statusCounts: Record<string, number>;
    };
    inquiries: {
        total: number;
        recent: any[];
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);

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
    const contacted = stats.pipeline.statusCounts['Contacted'] || 0;
    const inDiscussion = stats.pipeline.statusCounts['In Discussion'] || 0;
    const partner = stats.pipeline.statusCounts['Partner'] || 0;

    // Calculate simple metrics
    const activeLeads = inDiscussion + partner;
    const conversionRate = totalPipeline > 0 ? ((activeLeads / totalPipeline) * 100).toFixed(1) : '0.0';

    return (
        <Container size="xl" py={40} bg="gray.0" style={{ minHeight: '100vh', borderRadius: '16px' }}>
            {/* Header Section */}
            <Group justify="space-between" align="flex-end" mb={40}>
                <div>
                    <Badge variant="dot" color="wasabi" size="lg" mb="xs">Live Overview</Badge>
                    <Title order={1} style={{ fontSize: '2.2rem' }}>
                        Executive <Text span c="grape" inherit>Dashboard</Text>
                    </Title>
                    <Text c="dimmed" size="lg" mt={5}>Good morning, CEO. Your sales engine is running.</Text>
                </div>
                <Button component={Link} href="/admin/hunter" size="md" color="black" variant="filled" leftSection={<IconSearch size={18} />}>
                    Open Hunter
                </Button>
            </Group>

            {/* KPI Cards */}
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb={40}>
                <StatsCard
                    title="Total Pipeline"
                    value={totalPipeline.toString()}
                    description="Potential partners discovered"
                    icon={IconUsers}
                    color="grape"
                    trend="+12% this week" // Simulated trend for visual
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

            <Grid gutter="lg">
                {/* Visual Pipeline Status */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Card withBorder radius="md" p="xl" h="100%">
                        <Group justify="space-between" mb="lg">
                            <Title order={3}>Pipeline Health</Title>
                            <Badge variant="light" color="gray"> Real-time</Badge>
                        </Group>
                        <Group align="center" justify="space-around" style={{ minHeight: '200px' }}>
                            <RingProgress
                                size={260}
                                thickness={28}
                                roundCaps
                                label={
                                    <Stack gap={0} align="center">
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Conversion</Text>
                                        <Text size="xl" fw={700}>{conversionRate}%</Text>
                                    </Stack>
                                }
                                sections={[
                                    { value: (stats.pipeline.statusCounts['New'] || 0) / (totalPipeline || 1) * 100, color: 'gray.4', tooltip: 'New' },
                                    { value: (contacted / (totalPipeline || 1)) * 100, color: 'blue.5', tooltip: 'Contacted' },
                                    { value: (inDiscussion / (totalPipeline || 1)) * 100, color: 'teal.5', tooltip: 'In Discussion' },
                                    { value: (partner / (totalPipeline || 1)) * 100, color: 'grape.6', tooltip: 'Partner' },
                                ]}
                            />
                            <Stack>
                                <LegendItem color="gray.5" label="New Opportunities" value={stats.pipeline.statusCounts['New'] || 0} />
                                <LegendItem color="blue.5" label="Contacted" value={contacted} />
                                <LegendItem color="teal.5" label="In Discussion" value={inDiscussion} />
                                <LegendItem color="grape.6" label="Partners Signed" value={partner} />
                            </Stack>
                        </Group>
                    </Card>
                </Grid.Col>

                {/* Quick Actions & Inquiries */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Stack gap="lg" h="100%">
                        {/* Quick Actions */}
                        <Card withBorder radius="md" p="lg" bg="white">
                            <Title order={4} mb="md" c="dimmed" tt="uppercase" size="xs" fw={700}>Quick Actions</Title>
                            <SimpleGrid cols={2}>
                                <Button component={Link} href="/admin/video" variant="light" color="orange" fullWidth leftSection={<IconMovie size={16} />}>
                                    AI Video Producer
                                </Button>
                                <Button component={Link} href="/admin/content" variant="light" color="pink" fullWidth leftSection={<IconPencil size={16} />}>
                                    Write Blog (AI)
                                </Button>
                                <Button variant="light" color="cyan" fullWidth leftSection={<IconMail size={16} />} disabled>
                                    Check Email
                                </Button>
                                <Button variant="light" color="gray" fullWidth leftSection={<IconSettings size={16} />} disabled>
                                    Settings
                                </Button>
                            </SimpleGrid>
                        </Card>

                        {/* Recent Inquiries List */}
                        <Card withBorder radius="md" p="lg" style={{ flex: 1 }}>
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
                    </Stack>
                </Grid.Col>
            </Grid>
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
