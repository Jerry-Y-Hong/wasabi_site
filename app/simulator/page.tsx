"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Paper, Text, Grid, Button, Group, Badge, Stack, Title, Divider, ThemeIcon, SimpleGrid, SegmentedControl, Code, ScrollArea } from '@mantine/core';
import { Zap, Play, Pause, Activity, Download, AlertTriangle, LayoutDashboard, Droplet, Layers, Radio } from 'lucide-react';
import { useLocalStorage } from '@mantine/hooks';

// --- New Architecture Imports ---
import { useNutrientSimulator } from './hooks/useSimulatorLogic';
import { ProcessDiagram } from './components/ProcessDiagram';
import { RecyclingPanel, AeroponicPanel, TierMonitorRow } from './components/ControlPanels';
import { HarvestPanel } from './components/AnalyticsPanel';
import { LiveTrendChart } from './components/ChartComponent';

export default function SimulatorPage() {
    const router = useRouter();
    const sim = useNutrientSimulator();
    const [chartMode, setChartMode] = useState<string>("NUTRIENT");
    const [mounted, setMounted] = useState(false);

    // UI-only state derived from storage
    const [liveMode, setLiveMode] = useLocalStorage({ key: 'sf-live-mode', defaultValue: false });

    // [New] Effect to sync Live Mode state to the hook logic if needed (Hook reads storage directly but UI needs to toggle)
    useEffect(() => {
        console.log("SimulatorPage Mounted - Logic Loaded");
        setMounted(true);
    }, []);

    const toggleLiveMode = () => {
        const newVal = !liveMode;
        setLiveMode(newVal);
        sim.setLiveMode(newVal); // Notify hook for log msg
        // Storage update is handled by useLocalStorage automatically
        // But hook reads inside interval, so it might need a re-read or just rely on storage
        // Since hook reads localStorage.getItem inside interval, it will pick up change in next tick
    };

    if (!mounted) return null;

    return (
        <Container fluid p={0} bg="#1A1B1E" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* 1. Header Bar */}
            <Paper p="md" bg="#25262B" radius={0} shadow="sm" style={{ borderBottom: '1px solid #333' }}>
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size="lg" radius="md" color="green" variant="filled"><Zap size={20} /></ThemeIcon>
                        <div>
                            <Title order={3} c="white">K-WASABI Simulator <Badge color={liveMode ? "red" : "green"} variant="light">v14.3 {liveMode ? "LIVE" : "SIM"}</Badge></Title>
                            <Group gap={4}>
                                <Text size="xs" c="dimmed">25-Zone Precision Aeroponics</Text>
                                <Divider orientation="vertical" />
                                <Badge size="xs" color={sim.systemStatus.health === "OK" ? "green" : sim.systemStatus.health === "WARNING" ? "yellow" : "red"} variant="filled">{sim.systemStatus.message}</Badge>
                                {sim.physics.vpd !== undefined ? (
                                    <Badge size="xs" variant="light" color={(sim.physics.vpd >= 0.8 && sim.physics.vpd <= 1.2) ? "teal" : "orange"}>
                                        VPD {sim.physics.vpd.toFixed(2)} kPa
                                    </Badge>
                                ) : null}
                                <Badge size="xs" variant="dot" color={sim.systemStatus.mqttStatus === "CONNECTED" ? "teal" : "red"}>
                                    MQTT: {sim.systemStatus.mqttStatus || "CONNECTING..."}
                                </Badge>
                            </Group>
                        </div>
                    </Group>
                    <Group>
                        <Button
                            variant={liveMode ? "filled" : "outline"}
                            color={liveMode ? "red" : "gray"}
                            onClick={toggleLiveMode}
                            leftSection={<Radio size={16} className={liveMode ? "pulsate" : ""} />}
                        >
                            {liveMode ? "LIVE LINK ACTIVE" : "ACTIVATE LIVE LINK"}
                        </Button>

                        <Button variant="outline" color="cyan" onClick={() => router.push('/admin/analytics')} leftSection={<Activity size={16} />}>
                            ANALYTIC PRO
                        </Button>
                        <Button color={sim.autoMode ? "green" : "orange"} onClick={sim.toggleAutoMode} leftSection={sim.autoMode ? <Play size={16} /> : <Pause size={16} />}>
                            {sim.autoMode ? "AUTO MODE" : "MANUAL MODE"}
                        </Button>
                        <Button variant="default" onClick={() => console.log("Export")} leftSection={<Download size={16} />}>
                            EXPORT CSV
                        </Button>
                        <Button
                            variant={(sim.systemStatus.health !== "OK" || sim.physics.tankLevel < 20) ? "filled" : "subtle"}
                            color={(sim.systemStatus.health !== "OK" || sim.physics.tankLevel < 20) ? "red" : "gray"}
                            size="xs"
                            onClick={sim.triggerHardReset}
                            leftSection={(sim.systemStatus.health !== "OK" || sim.physics.tankLevel < 20) ? <AlertTriangle size={14} /> : <Activity size={14} />}
                        >
                            {(sim.systemStatus.health !== "OK" || sim.physics.tankLevel < 20) ? "FIX ERROR" : "RESET"}
                        </Button>
                    </Group>
                </Group>
            </Paper>

            <Stack gap="md" p="md" style={{ flex: 1, overflow: 'visible' }}>
                {/* 1. MAIN PROCESS VISUALIZATION */}
                <ProcessDiagram sim={sim} />

                <Grid gutter="md">
                    {/* LEFT COLUMN: MAIN VISUALIZATION (THE FARM) */}
                    <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
                        {/* 25-TIER GRID */}
                        <Paper p="md" bg="#1A1B1E" withBorder style={{ borderColor: '#333' }}>
                            <Group justify="space-between" mb="xs">
                                <Group gap="xs">
                                    <ThemeIcon color="green" variant="light"><LayoutDashboard size={14} /></ThemeIcon>
                                    <Text size="sm" fw={700} c="dimmed" style={{ letterSpacing: 1 }}>REAL-TIME FARM MONITORING</Text>
                                </Group>
                                {sim.autoMode && <Badge size="sm" color="cyan" variant="filled" leftSection={<Activity size={12} />}>PRECISION MODE</Badge>}
                            </Group>

                            <SimpleGrid cols={5} spacing={6} verticalSpacing={6}>
                                {[0, 1, 2, 3, 4].map(rack => {
                                    const isActive = sim.aeroponics.activeRack === rack;
                                    const rackTiers = sim.env.tiers.slice(rack * 5, (rack + 1) * 5);
                                    return (
                                        <Stack key={rack} gap={4}>
                                            <Badge
                                                fullWidth
                                                color={isActive ? "cyan" : "dark"}
                                                variant={isActive ? "filled" : "light"}
                                                radius="xs"
                                                style={{ border: isActive ? '1px solid #22b8cf' : '1px solid #444', transition: 'all 0.3s', height: 18, fontSize: 10 }}
                                                leftSection={isActive ? <Droplet size={8} className="pulsate" /> : <Layers size={8} />}
                                            >
                                                RACK 0{rack + 1}
                                            </Badge>
                                            <Stack gap={2}>
                                                {rackTiers && rackTiers.length > 0 ? (
                                                    [...rackTiers].reverse().map((tier, i) => (
                                                        <TierMonitorRow
                                                            key={`r${rack}-t${i}`}
                                                            sim={sim}
                                                            index={rack * 5 + (4 - i)}
                                                            tier={tier}
                                                            isSpraying={isActive}
                                                            lightPos={sim.lighting.pos}
                                                            lightMode={sim.lighting.mode}
                                                            lightSides={sim.lighting.sides}
                                                        />
                                                    ))
                                                ) : <Text size="xs" c="dimmed">No Data</Text>}
                                            </Stack>
                                        </Stack>
                                    );
                                })}
                            </SimpleGrid>
                        </Paper>

                        {/* Analytics and Harvest Panel */}
                        <Grid mt="md">
                            <Grid.Col span={12}>
                                <HarvestPanel sim={sim} />
                            </Grid.Col>
                        </Grid>

                    </Grid.Col>

                    {/* RIGHT COLUMN: CONTROL PANELS */}
                    <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
                        <Stack gap="md">
                            <SegmentedControl
                                value={chartMode}
                                onChange={setChartMode}
                                data={[
                                    { label: 'Nutrients', value: 'NUTRIENT' },
                                    { label: 'Environment', value: 'ENV' }
                                ]}
                                size="xs"
                                fullWidth
                                styles={{ root: { backgroundColor: '#141517' } }}
                            />

                            {chartMode === 'NUTRIENT' ? (
                                <LiveTrendChart
                                    title="EC / pH TREND"
                                    data={sim.history} // The hook maintains history
                                    keys={['ec', 'ph']}
                                    colors={['#fcc419', '#22b8cf']}
                                    min={0} max={10}
                                    unit=""
                                />
                            ) : (
                                <LiveTrendChart
                                    title="TEMP / HUMIDITY"
                                    data={sim.history}
                                    keys={['temp', 'hum']}
                                    colors={['#ff6b6b', '#20c997']}
                                    min={0} max={100}
                                    unit=""
                                />
                            )}

                            <RecyclingPanel sim={sim} />

                            <AeroponicPanel sim={sim} />

                            {/* [ADDED] Log Console */}
                            <Paper p="xs" bg="#111" radius="md" withBorder style={{ borderColor: '#333' }}>
                                <Text size="xs" c="dimmed" mb={4}>SYSTEM LOG</Text>
                                <ScrollArea h={60}>
                                    <Code block color="dark" style={{ fontSize: 10, lineHeight: 1.2 }}>
                                        {`[${new Date().toLocaleTimeString()}] ${sim.logMsg}\n`}
                                        {`[SYS] Health: ${sim.systemStatus.health}\n`}
                                        {`[MQTT] ${sim.systemStatus.mqttStatus || "Checking..."}`}
                                    </Code>
                                </ScrollArea>
                            </Paper>

                        </Stack>
                    </Grid.Col>
                </Grid>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes flow {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .flow-animation {
                        animation: flow 1.0s linear infinite;
                    }
                    .pulsate {
                        animation: pulse 1.5s infinite;
                    }
                    @keyframes pulse {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(1.05); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    .spin-fast {
                        animation: spin 0.5s linear infinite;
                    }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                `}} />
            </Stack>
        </Container>
    );
}
