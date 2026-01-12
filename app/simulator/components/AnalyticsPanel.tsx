
import React from 'react';
import { Paper, Group, Stack, Badge, Box, Button, Text, SimpleGrid, ThemeIcon, rem } from '@mantine/core';
import { LayoutDashboard, Activity } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { TierData } from '../types';

export const HarvestPanel = ({ sim }: any) => {
    const { t, language } = useTranslation();
    const totalBiomass = sim.env.tiers.reduce((acc: number, t: TierData) => acc + (t.biomass || 0), 0) / 1000;
    const harvestReadyCount = sim.env.tiers.filter((t: TierData) => (t.biomass || 0) > 200).length;

    const rootRatio = 0.35;
    const leafRatio = 0.65;

    const rootWeight = totalBiomass * rootRatio;
    const leafWeight = totalBiomass * leafRatio;

    const rootPrice = 250000;
    const leafPrice = 30000;

    const rootValue = rootWeight * rootPrice;
    const leafValue = leafWeight * leafPrice;
    const totalValue = rootValue + leafValue;

    return (
        <Paper p="md" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40' }} mt="md">
            <Group justify="space-between" mb="sm">
                <Group gap={4}>
                    <ThemeIcon variant="light" color="green"><LayoutDashboard size={14} /></ThemeIcon>
                    <Text fw={700} c="white">HARVEST ANALYZER</Text>
                </Group>
                <Badge color="green" variant="dot">MULTI-CROP ROI</Badge>
            </Group>

            <SimpleGrid cols={2} spacing="xs">
                <Paper p="xs" bg="#141517" radius="md">
                    <Text size="xs" c="dimmed">Total Biomass</Text>
                    <Text fw={700} size="lg" c="lime">{totalBiomass.toFixed(2)} kg</Text>
                    <Group gap={4} mt={2}>
                        <Badge size="xs" variant="outline" color="orange" style={{ fontSize: 9, height: 16 }}>Root {(rootWeight).toFixed(1)}k</Badge>
                        <Badge size="xs" variant="outline" color="green" style={{ fontSize: 9, height: 16 }}>Leaf {(leafWeight).toFixed(1)}k</Badge>
                    </Group>
                </Paper>
                <Paper p="xs" bg="#141517" radius="md">
                    <Text size="xs" c="dimmed">Total Value ({language === 'ko' ? 'KRW' : 'USD'})</Text>
                    <Text fw={700} size="lg" c="yellow">
                        {language === 'ko' ? `₩${(totalValue / 10000).toFixed(0)}만` : `$${(totalValue / 1300).toFixed(0)}`}
                    </Text>
                    <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>
                        {language === 'ko'
                            ? `(뿌리: ${(rootValue / 10000).toFixed(0)} + 잎: ${(leafValue / 10000).toFixed(0)})`
                            : `(Root: ${(rootValue / 1300).toFixed(0)} + Leaf: ${(leafValue / 1300).toFixed(0)})`
                        }
                    </Text>
                </Paper>
            </SimpleGrid>

            {/* Robot Simulation */}
            <Paper p="xs" bg="#141517" mt="xs" radius="md" withBorder style={{ borderColor: '#333' }}>
                <Group justify="space-between" mb={4}>
                    <Text size="xs" c="dimmed" fw={700}>ROBOT SIMULATION</Text>
                    <Badge size="xs" color="dark" variant="outline">GHOST MODE</Badge>
                </Group>
                <Group justify="space-between" align="flex-end">
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Ready to Harvest</Text>
                        <Text size="sm" fw={700} c="white">{harvestReadyCount} / 25 Zones</Text>
                    </Stack>
                    <Stack gap={0} align="flex-end">
                        <Text size="xs" c="dimmed">Est. Cycle Time</Text>
                        <Text size="sm" fw={700} c="cyan">{(harvestReadyCount * 2.5).toFixed(1)} min</Text>
                    </Stack>
                </Group>
                <Button fullWidth size="xs" variant="light" color="cyan" mt="xs" rightSection={<Activity size={12} />}>
                    RUN PATHFINDING SIM
                </Button>
            </Paper>
        </Paper>
    );
};
