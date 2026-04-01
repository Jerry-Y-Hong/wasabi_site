'use client';

import { Container, Title, Text, Group, Badge, ThemeIcon, SimpleGrid, Card, Paper, Stack, RingProgress, Center, Button } from '@mantine/core'; // [MANTINE] Button added
import { IconChartDots, IconPlant, IconTemperature, IconCloud, IconAlertTriangle, IconSun, IconLeaf, IconArrowLeft } from '@tabler/icons-react'; // [TABLER] IconArrowLeft added
import { useTranslation } from '@/lib/i18n';
import { useRouter } from 'next/navigation'; // [NEXT] Navigation added
import { useEffect, useState, useRef } from 'react';
import mqtt from 'mqtt';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, AreaChart, Area } from 'recharts';

// --- Configuration ---
const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt'; // Public Secure WebSocket Broker
const TOPIC_SENSOR = 'k-farm/wasabi/jerry/sensors_v2';

interface SensorData {
    timestamp: number;
    vpd: number;
    temp: number;
    hum: number;
    ppfd: number;
}

export default function AnalyticsPage() {
    const router = useRouter(); // [NEW] Navigation
    const { t } = useTranslation();
    const [status, setStatus] = useState<"CONNECTING" | "CONNECTED" | "DISCONNECTED">("DISCONNECTED");
    const [data, setData] = useState<SensorData[]>([]);
    const [currentVPD, setCurrentVPD] = useState<number>(0);
    const [currentPPFD, setCurrentPPFD] = useState<number>(0);
    const [estimatedDLI, setEstimatedDLI] = useState<number>(0);
    const [growthScore, setGrowthScore] = useState<number>(0);
    const [currentSeason, setCurrentSeason] = useState<string>("Initializing...");
    const clientRef = useRef<mqtt.MqttClient | null>(null);

    // --- VPD Calculation Logic ---
    const calculateVPD = (temp: number, hum: number) => {
        const svp = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
        const avp = (hum / 100) * svp;
        return Math.max(0, svp - avp);
    };

    // --- DLI Estimation ---
    const calculateProjectedDLI = (ppfd: number) => {
        const hours = 14;
        return (ppfd * 3600 * hours) / 1000000;
    };

    // --- Growth Efficiency Model (The "Brain") ---
    const calculateGrowthEfficiency = (vpd: number, ppfd: number) => {
        let score = 100;

        // 1. VPD Penalty (Stomatal Conductance)
        if (vpd > 1.2) {
            score -= 40; // Severe Stress (Stomata Closed)
        } else if (vpd > 0.8) {
            score -= (vpd - 0.8) * 100; // Linear penalty
        } else if (vpd < 0.2) {
            score -= 30; // Fungal Risk / Transpiration Stop
        } else if (vpd < 0.4) {
            score -= (0.4 - vpd) * 50;
        }

        // 2. Light Penalty (Photosynthesis Rate)
        if (ppfd < 50) {
            score -= 50; // Pitch Black
        } else if (ppfd < 200) {
            score -= (200 - ppfd) * 0.1; // Low light
        }

        return Math.max(0, Math.min(100, Math.round(score)));
    };

    useEffect(() => {

        setStatus("CONNECTING");

        const client = mqtt.connect(BROKER_URL);
        clientRef.current = client;

        client.on('connect', () => {

            setStatus("CONNECTED");
            client.subscribe(TOPIC_SENSOR, (err) => {
                if (!err) { }
            });
        });

        client.on('message', (topic, message) => {
            if (topic === TOPIC_SENSOR) {
                try {
                    const payload = JSON.parse(message.toString());

                    let avgTemp = 0;
                    let avgHum = 0;
                    const ppfd = payload.ppfd || 0;
                    const season = payload.season || "MANUAL"; // Read Season

                    if (payload.tiers && payload.tiers.length > 0) {
                        const samples = payload.tiers.slice(0, 5);
                        avgTemp = samples.reduce((acc: number, t: any) => acc + t.temp, 0) / samples.length;
                        avgHum = samples.reduce((acc: number, t: any) => acc + t.hum, 0) / samples.length;
                    } else {
                        avgTemp = payload.temp;
                        avgHum = 50;
                    }

                    const vpd = calculateVPD(avgTemp, avgHum);

                    // Calc Factors
                    const eff = calculateGrowthEfficiency(vpd, ppfd);

                    // Update State
                    setCurrentVPD(Number(vpd.toFixed(2)));
                    setCurrentPPFD(Number(ppfd.toFixed(0)));
                    setEstimatedDLI(Number(calculateProjectedDLI(ppfd).toFixed(1)));
                    setGrowthScore(eff);
                    setCurrentSeason(season);

                    // Update Chart Data (Keep last 60 points)
                    setData(prev => {
                        const newPoint = {
                            timestamp: Date.now(),
                            vpd: Number(vpd.toFixed(2)),
                            temp: Number(avgTemp.toFixed(1)),
                            hum: Number(avgHum.toFixed(1)),
                            ppfd: Number(ppfd.toFixed(0))
                        };
                        const updated = [...prev, newPoint];
                        if (updated.length > 60) updated.shift();
                        return updated;
                    });

                } catch (e) {
                    console.error("Data Parse Error:", e);
                }
            }
        });

        client.on('error', (err) => {
            console.error("MQTT Error:", err);
            setStatus("DISCONNECTED");
        });

        return () => {
            if (client) client.end();
        };
    }, []);

    // Format X Axis
    const formatTime = (ts: number) => {
        const date = new Date(ts);
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    return (
        <Container size="xl" py={40} bg="gray.0" style={{ minHeight: '100vh', borderRadius: '16px' }}>
            {/* Header */}
            <Group justify="space-between" align="flex-end" mb={40}>
                <div>
                    <Group gap="xs" mb={5}>
                        <Badge variant="gradient" gradient={{ from: 'violet', to: 'grape' }} size="lg">BETA LAB</Badge>
                        <Badge color={status === 'CONNECTED' ? 'green' : 'red'}>{status}</Badge>
                        <Badge variant="outline" color="cyan" size="lg" leftSection={<IconCloud size={14} />}>
                            MODE: {currentSeason}
                        </Badge>
                    </Group>
                    <Title order={1} style={{ fontSize: '2rem' }}>
                        Growth Analytics <Text span c="grape" inherit>Pro</Text>
                    </Title>
                    <Text c="dimmed" size="lg" mt={5}>
                        LetsGrow Architecture Benchmark - Real-time Physiology
                    </Text>
                </div>
            </Group>

            {/* Main VPD Chart */}
            <Card withBorder padding="lg" radius="md" mb={30}>
                <Group justify="space-between" mb="md">
                    <div>
                        <Text fw={700} size="lg">VPD (Vapor Pressure Deficit)</Text>
                        <Text size="sm" c="dimmed">Target: 0.4 - 0.8 kPa (Safe Zone)</Text>
                    </div>
                    <Stack gap={0} align="flex-end">
                        <Text fw={900} size="xl" c="grape">{currentVPD} kPa</Text>
                        <Text size="xs" c={currentVPD > 0.8 ? 'red' : currentVPD < 0.4 ? 'blue' : 'green'}>
                            {currentVPD > 0.8 ? 'Too Dry (Stressed)' : currentVPD < 0.4 ? 'Too Humid (Risk)' : 'Optimal Growth'}
                        </Text>
                    </Stack>
                </Group>

                <Paper withBorder h={300} style={{ position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="timestamp" tickFormatter={formatTime} hide />
                            <YAxis domain={[0, 1.5]} allowDataOverflow={false} />
                            <Tooltip labelFormatter={formatTime} />
                            <ReferenceArea y1={0.4} y2={0.8} fill="green" fillOpacity={0.1} label="Optimal" />
                            <Line type="monotone" dataKey="vpd" stroke="#8884d8" strokeWidth={3} dot={false} animationDuration={300} />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Card>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                {/* Temp & Hum Sub-charts */}
                <Card withBorder padding="lg" radius="md">
                    <Text fw={500} mb="xs">Environment Factors</Text>
                    <Paper withBorder h={150}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis hide />
                                <YAxis yAxisId="left" domain={['auto', 'auto']} hide />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} hide />
                                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff7300" dot={false} strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="hum" stroke="#82ca9d" dot={false} strokeWidth={2} />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                    <Group mt="xs" justify="center">
                        <Badge color="orange" variant="light">Temp</Badge>
                        <Badge color="green" variant="light">Hum</Badge>
                    </Group>
                </Card>

                {/* DLI Card */}
                <Card withBorder padding="lg" radius="md">
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>DLI (Projected)</Text>
                        <ThemeIcon color="yellow" variant="light">
                            <IconSun size={20} />
                        </ThemeIcon>
                    </Group>
                    <Paper withBorder h={150} mb="xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPpfd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffd43b" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ffd43b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis hide />
                                <YAxis domain={[0, 500]} hide />
                                <Tooltip />
                                <Area type="monotone" dataKey="ppfd" stroke="#ffd43b" fillOpacity={1} fill="url(#colorPpfd)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                    <Group justify="space-between" align="flex-end">
                        <div>
                            <Text size="xs" c="dimmed">Instant PPFD</Text>
                            <Text fw={700}>{currentPPFD} µmol</Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Text size="xs" c="dimmed">Daily Integral</Text>
                            <Text fw={700} c={estimatedDLI > 12 ? 'green' : 'orange'}>{estimatedDLI} mol</Text>
                        </div>
                    </Group>
                </Card>

                {/* Growth Efficiency - NOW LIVE */}
                <Card withBorder padding="lg" radius="md">
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Growth Efficiency</Text>
                        <ThemeIcon color="green" variant="light">
                            <IconPlant size={20} />
                        </ThemeIcon>
                    </Group>
                    <Paper h={150} bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack align="center" gap={0}>
                            <Group align="center" justify="center" gap="xs">
                                <RingProgress
                                    size={100}
                                    thickness={10}
                                    roundCaps
                                    sections={[{ value: growthScore, color: growthScore > 80 ? 'green' : growthScore > 50 ? 'orange' : 'red' }]}
                                    label={
                                        <Center>
                                            <IconLeaf size={24} color={growthScore > 80 ? 'green' : 'orange'} />
                                        </Center>
                                    }
                                />
                            </Group>
                            <Text fw={900} size="xl" c={growthScore > 80 ? 'green' : 'orange'}>{growthScore}%</Text>
                            <Text size="xs" c="dimmed">Photosynthesis Rate</Text>
                        </Stack>
                    </Paper>
                </Card>
            </SimpleGrid>

            {/* Seasonal Nature Emulation Profile (Restored Feature) */}
            < Card withBorder padding="lg" radius="md" mt="lg" >
                <Group mb="md">
                    <ThemeIcon color="teal" variant="light" size="lg">
                        <IconLeaf size={24} />
                    </ThemeIcon>
                    <div>
                        <Title order={4}>Seasonal Nature Emulation</Title>
                        <Text size="sm" c="dimmed">Bio-rhythm Simulation: Wind Turbulence & Soundscape Density</Text>
                    </div>
                </Group>

                <Paper h={300}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { month: 'Jan', season: 'Winter', wind: 30, sound: 15 },
                            { month: 'Feb', season: 'Winter', wind: 35, sound: 20 },
                            { month: 'Mar', season: 'Spring', wind: 50, sound: 60 },
                            { month: 'Apr', season: 'Spring', wind: 65, sound: 80 },
                            { month: 'May', season: 'Spring', wind: 70, sound: 90 },
                            { month: 'Jun', season: 'Summer', wind: 40, sound: 100 },
                            { month: 'Jul', season: 'Summer', wind: 30, sound: 85 },
                            { month: 'Aug', season: 'Summer', wind: 25, sound: 70 },
                            { month: 'Sep', season: 'Autumn', wind: 55, sound: 60 },
                            { month: 'Oct', season: 'Autumn', wind: 60, sound: 50 },
                            { month: 'Nov', season: 'Autumn', wind: 45, sound: 30 },
                            { month: 'Dec', season: 'Winter', wind: 35, sound: 20 },
                        ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#228BE6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#228BE6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSound" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#40C057" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#40C057" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <Tooltip />
                            <Area type="monotone" dataKey="wind" name="Wind Flow (CFM Pattern)" stroke="#228BE6" fillOpacity={1} fill="url(#colorWind)" />
                            <Area type="monotone" dataKey="sound" name="Nature Sound (dB Density)" stroke="#40C057" fillOpacity={1} fill="url(#colorSound)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                <Group mt="md" gap="xl" justify="center">
                    <Group gap={5}>
                        <Badge color="blue" variant="dot">Winter (Resting)</Badge>
                        <Text size="xs" c="dimmed">Low Wind / Silence</Text>
                    </Group>
                    <Group gap={5}>
                        <Badge color="green" variant="dot">Spring (Growth)</Badge>
                        <Text size="xs" c="dimmed">High Wind / Birds</Text>
                    </Group>
                    <Group gap={5}>
                        <Badge color="orange" variant="dot">Summer (Heat)</Badge>
                        <Text size="xs" c="dimmed">Gentle Breeze / Cicada</Text>
                    </Group>
                </Group>
            </Card >
        </Container >
    );
}
