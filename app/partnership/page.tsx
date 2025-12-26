'use client';

import { Container, Title, Text, SimpleGrid, Card, ThemeIcon, Stack, Group, Box, Button, List, ThemeIcon as MantineThemeIcon, Paper } from '@mantine/core';
import { IconSchool, IconMicroscope, IconWorld, IconCertificate, IconArrowRight, IconMessage2, IconDeviceAnalytics, IconUsers, IconTent } from '@tabler/icons-react';
import Link from 'next/link';

export default function PartnershipPage() {
    return (
        <Container size="xl" py={80}>
            {/* Hero Section for Partnership */}
            <Box ta="center" mb={80}>
                <Badge variant="dot" color="wasabi" size="xl" mb="md">Joint Innovation</Badge>
                <Title order={1} size="48px" mb="xl">Global R&D & Strategic Partnership</Title>
                <Text c="dimmed" size="xl" maw={900} mx="auto">
                    We invite global universities, research institutes, and agri-tech pioneers to join us in
                    revolutionizing the wasabi industry through data-driven biotechnology and specialized smart farming.
                </Text>
            </Box>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80} mb={100}>
                <Stack gap="xl">
                    <Box>
                        <Title order={2} mb="lg" c="wasabi.8">Collaboration Pillars</Title>
                        <Text size="lg" mb="xl">
                            We offer our state-of-the-art Aeroponic facilities as a global test-bed for cutting-edge agricultural research.
                        </Text>
                    </Box>

                    <CollaborationItem
                        icon={IconMicroscope}
                        title="Biotech & Genetic Research"
                        description="Joint studies on maximizing 6-MSITC content and developing virus-resistant wasabi strains through tissue culture optimization."
                    />
                    <CollaborationItem
                        icon={IconWorld}
                        title="Global Test-Bed Program"
                        description="Establishing collaborative pilot plants in various climatic regions to validate technology scalability and localized nutrient recipes."
                    />
                    <CollaborationItem
                        icon={IconUsers}
                        title="Social Enterprise & Regional Welfare"
                        description="Developing social welfare models that integrate smart farming with regional job creation and senior employment programs."
                    />
                    <CollaborationItem
                        icon={IconTent}
                        title="Theme Park & 6th Industry"
                        description="Designing 'Experience Centers' and 'Healing Camps' that combine education, tourism, and consumption of fresh wasabi products."
                    />
                </Stack>

                <Card padding="xl" radius="lg" withBorder shadow="md" bg="var(--mantine-color-gray-0)">
                    <Title order={3} mb="xl">Strategic Proposals for Partners</Title>
                    <Stack gap="md">
                        <Paper p="md" radius="md" withBorder>
                            <Group>
                                <ThemeIcon color="wasabi" size="lg" radius="xl"><IconCertificate /></ThemeIcon>
                                <Box>
                                    <Text fw={700}>Tech Licensing</Text>
                                    <Text size="sm" c="dimmed">License our Aeroponic system designs and AI control software for localized research projects.</Text>
                                </Box>
                            </Group>
                        </Paper>
                        <Paper p="md" radius="md" withBorder>
                            <Group>
                                <ThemeIcon color="blue" size="lg" radius="xl"><IconSchool /></ThemeIcon>
                                <Box>
                                    <Text fw={700}>Academic Exchange</Text>
                                    <Text size="sm" c="dimmed">Internship programs and residency opportunities for PhD candidates specializing in vertical farming.</Text>
                                </Box>
                            </Group>
                        </Paper>
                        <Paper p="md" radius="md" withBorder>
                            <Group>
                                <ThemeIcon color="orange" size="lg" radius="xl"><IconWorld /></ThemeIcon>
                                <Box>
                                    <Text fw={700}>International Joint Ventures</Text>
                                    <Text size="sm" c="dimmed">Co-developing premium wasabi processing facilities in overseas markets through institutional funding.</Text>
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
                        Request Partnership Proposal
                    </Button>
                </Card>
            </SimpleGrid>

            {/* Global Vision Section */}
            <Box ta="center" py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Title order={2} mb="lg">Our Global Network Vision</Title>
                <Text c="dimmed" mb={40} maw={700} mx="auto">
                    By 2030, we aim to establish high-tech wasabi hubs in North America, Europe, and Southeast Asia
                    through synergy with local research leaders.
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    <StatCard label="Target Partners" value="20+" color="blue" />
                    <StatCard label="Global Hubs" value="5 Cities" color="wasabi" />
                    <StatCard label="Joint Patents" value="15+" color="orange" />
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

import { Badge } from '@mantine/core';
