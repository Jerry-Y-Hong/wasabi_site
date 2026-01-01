'use client';

import { Container, Title, Text, Button, Group, Paper, Badge, ThemeIcon, Box, SimpleGrid } from '@mantine/core';
import { IconDownload, IconChartPie, IconDeviceLaptop, IconFileText, IconLeaf } from '@tabler/icons-react';
import Link from 'next/link';

export default function InvestPage() {
    return (
        <Box bg="#f8f9fa">
            {/* Header Section */}
            <Box bg="white" py={80} style={{ borderBottom: '1px solid #e9ecef' }}>
                <Container size="lg">
                    <Group justify="center" mb="lg">
                        <Badge variant="filled" color="dark" size="lg">INVESTOR RELATIONS</Badge>
                    </Group>
                    <Title order={1} ta="center" fw={900} style={{ fontSize: '3.5rem', letterSpacing: '-2px', lineHeight: 1.1 }}>
                        The Green Gold Revolution
                    </Title>
                    <Text ta="center" mt="md" size="xl" c="dimmed" maw={700} mx="auto">
                        Join the future of high-tech agriculture. We are scaling the world's most advanced smart farm technology.
                    </Text>

                    <Group justify="center" mt={50}>
                        <Button
                            component="a"
                            href="/assets/brochure_full.pdf"
                            download
                            size="xl"
                            color="wasabi"
                            rightSection={<IconDownload size={24} />}
                            style={{ boxShadow: '0 10px 20px rgba(43, 138, 62, 0.2)' }}
                        >
                            Download IR Deck (PDF)
                        </Button>
                        <Button component={Link} href="/contact" size="xl" variant="default" leftSection={<IconDeviceLaptop size={24} />}>
                            Contact IR Team
                        </Button>
                    </Group>
                </Container>
            </Box>

            {/* Key Metrics Section */}
            <Container size="lg" py={80}>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30}>
                    <MetricCard
                        icon={IconChartPie}
                        title="Market Growth"
                        value="13.5%"
                        desc="CAGR projected through 2030 in global functional food market."
                    />
                    <MetricCard
                        icon={IconLeaf}
                        title="Production Yield"
                        value="950g"
                        desc="Average yield per plant using our hyper-cycle aeroponic system."
                    />
                    <MetricCard
                        icon={IconFileText}
                        title="IP Assets"
                        value="12+"
                        desc="Patents filed for smart control logic and LED optimization."
                    />
                </SimpleGrid>
            </Container>

            {/* Footer CTA */}
            <Box bg="dark.9" py={60} c="white">
                <Container size="md" ta="center">
                    <Title order={3} mb="md">Ready to discuss details?</Title>
                    <Text c="gray.5" mb="xl">
                        We are currently open for Series A funding discussions. Access our data room.
                    </Text>
                    <Button component="a" href="mailto:ir@k-wasabi.kr" variant="white" color="dark" size="lg">
                        Email: ir@k-wasabi.kr
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

function MetricCard({ icon: Icon, title, value, desc }: any) {
    return (
        <Paper p="xl" radius="md" withBorder style={{ transition: 'transform 0.2s', cursor: 'default' }}>
            <ThemeIcon size={50} radius="md" variant="light" color="wasabi" mb="md">
                <Icon size={30} stroke={1.5} />
            </ThemeIcon>
            <Text size="sm" tt="uppercase" c="dimmed" fw={700}>{title}</Text>
            <Text size="3rem" fw={900} c="dark.9" style={{ lineHeight: 1 }}>{value}</Text>
            <Text mt="sm" c="gray.6">{desc}</Text>
        </Paper>
    );
}
