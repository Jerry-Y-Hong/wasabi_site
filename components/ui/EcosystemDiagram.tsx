'use client';

import { Box, Paper, Text, Stack, Group, ThemeIcon, Title } from '@mantine/core';
import {
    IconLeaf, IconFlask, IconCup, IconHospital, IconTent,
    IconWorld, IconUsers, IconCpu, IconBuildingStore
} from '@tabler/icons-react';

const ecosystemNodes = [
    { label: 'Smart Farm (ICT)', icon: IconCpu, color: 'blue' },
    { label: 'Tissue Culture', icon: IconFlask, color: 'teal' },
    { label: 'Global Exports', icon: IconWorld, color: 'orange' },
    { label: 'Bakery Cafes', icon: IconCup, color: 'grape' },
    { label: 'Medical & Bio', icon: IconHospital, color: 'red' },
    { label: 'Theme Parks', icon: IconTent, color: 'cyan' },
    { label: 'Social Welfare', icon: IconUsers, color: 'indigo' },
    { label: 'Regional Growth', icon: IconBuildingStore, color: 'yellow' },
];

export function EcosystemDiagram() {
    return (
        <Box pos="relative" py={40} style={{ overflow: 'hidden' }}>
            {/* Center Node */}
            <Box
                ta="center"
                pos="relative"
                style={{
                    zIndex: 2,
                    maxWidth: 600,
                    margin: '0 auto'
                }}
            >
                <Paper
                    shadow="xl"
                    p="xl"
                    radius="100%"
                    withBorder
                    bg="wasabi.6"
                    style={{
                        width: 140,
                        height: 140,
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        border: '4px solid white',
                        boxShadow: '0 0 20px rgba(130, 201, 30, 0.4)'
                    }}
                >
                    <IconLeaf size={40} />
                    <Text fw={800} size="xl">WASABI</Text>
                    <Text size="xs" style={{ opacity: 0.8 }}>PLATFORM</Text>
                </Paper>
            </Box>

            {/* Orbiting Nodes */}
            <Box mt={40}>
                <Stack gap="xl">
                    <Group justify="center" gap="xl">
                        <NodeItem label="ICT Smart Farm" icon={IconCpu} color="blue" description="Aeroponic Automation" />
                        <NodeItem label="Bio-Technology" icon={IconFlask} color="teal" description="Tissue Culture Seedlings" />
                        <NodeItem label="Global Hub" icon={IconWorld} color="orange" description="Exporting to US & EU" />
                    </Group>
                    <Group justify="center" gap="xl">
                        <NodeItem label="Gourmet Food" icon={IconCup} color="grape" description="Bakery & Franchise" />
                        <NodeItem label="Social Impact" icon={IconUsers} color="indigo" description="Regional Revitalization" />
                    </Group>
                    <Group justify="center" gap="xl">
                        <NodeItem label="Medical & Bio" icon={IconHospital} color="red" description="Pharma Raw Materials" />
                        <NodeItem label="Agri-Tourism" icon={IconTent} color="cyan" description="Wasabi Theme Parks" />
                        <NodeItem label="Regional Welfare" icon={IconBuildingStore} color="yellow" description="Rural Value Creation" />
                    </Group>
                </Stack>
            </Box>

            {/* Connecting Lines Decoration (Visual only) */}
            <Box
                pos="absolute"
                top="20%"
                left="50%"
                style={{
                    zIndex: 1,
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '60%',
                    border: '2px dashed #e9ecef',
                    borderRadius: '50%',
                    opacity: 0.5
                }}
            />
        </Box>
    );
}

function NodeItem({ label, icon: Icon, color, description }: { label: string; icon: any; color: string; description: string }) {
    return (
        <Paper
            shadow="sm"
            p="md"
            radius="md"
            withBorder
            bg="white"
            style={{
                width: 220,
                transition: 'transform 0.2s ease',
                cursor: 'default'
            }}
            className="ecosystem-node"
        >
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color={color} size="lg" radius="md">
                    <Icon size={20} />
                </ThemeIcon>
                <Box>
                    <Text fw={700} size="sm">{label}</Text>
                    <Text size="xs" c="dimmed">{description}</Text>
                </Box>
            </Group>
        </Paper>
    );
}
