'use client';

import {
    Container,
    Title,
    Text,
    Group,
    Badge,
    SimpleGrid,
    Card,
    Paper,
    Stack,
    Button,
    Slider,
    Switch,
    ThemeIcon,
    Grid,
    Divider,
    Box,
    ActionIcon,
    Tooltip
} from '@mantine/core';
import {
    IconSettingsAutomation,
    IconFlame,
    IconSnowflake,
    IconDroplet,
    IconRefresh,
    IconPower,
    IconFlask,
    IconWind,
    IconStatusChange,
    IconDeviceAnalytics
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { useTranslation } from '@/lib/i18n';

// --- Configuration (Same as Analytics) ---
const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const TOPIC_SENSOR = 'k-farm/wasabi/jerry/sensors_v2';
const TOPIC_CONTROL = 'k-farm/wasabi/jerry/control_v2';

export default function ControlTowerPage() {
    const { t } = useTranslation();
    const [status, setStatus] = useState<"CONNECTING" | "CONNECTED" | "DISCONNECTED">("DISCONNECTED");
    const [sensors, setSensors] = useState<any>(null);
    const clientRef = useRef<mqtt.MqttClient | null>(null);

    // Initial Actuator States (Will be synced from sensors if possible)
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setStatus("CONNECTING");
        const client = mqtt.connect(BROKER_URL);
        clientRef.current = client;

        client.on('connect', () => {
            setStatus("CONNECTED");
            client.subscribe(TOPIC_SENSOR);
        });

        client.on('message', (topic, message) => {
            if (topic === TOPIC_SENSOR) {
                try {
                    const payload = JSON.parse(message.toString());
                    setSensors(payload);
                } catch (e) {
                    console.error("Parse Error:", e);
                }
            }
        });

        client.on('error', () => setStatus("DISCONNECTED"));

        return () => {
            if (client) client.end();
        };
    }, []);

    const sendCommand = (cmd: any) => {
        if (clientRef.current && status === "CONNECTED") {
            const key = Object.keys(cmd)[0];
            setLoading(prev => ({ ...prev, [key]: true }));

            clientRef.current.publish(TOPIC_CONTROL, JSON.stringify(cmd), { qos: 1 }, () => {
                // Clear loading after a short delay since we wait for sensor feedback
                setTimeout(() => {
                    setLoading(prev => ({ ...prev, [key]: false }));
                }, 500);
            });
        }
    };

    const isPumpOn = sensors?.pump === "ON";
    const isChillerOn = sensors?.chiller === "ON";
    const isHeaterOn = sensors?.heater === "ON";
    const isRawOn = sensors?.raw === "ON";
    const isInletOpen = sensors?.inlet === "ON";

    return (
        <Container size="xl" py={40} bg="gray.0" style={{ minHeight: '100vh', borderRadius: '16px' }}>
            <Group justify="space-between" align="flex-end" mb={40}>
                <div>
                    <Group gap="xs" mb={5}>
                        <Badge variant="filled" color="wasabi" size="lg">CONTROL ROOM</Badge>
                        <Badge color={status === 'CONNECTED' ? 'green' : 'red'}>{status}</Badge>
                        {sensors?.season && (
                            <Badge variant="outline" color="cyan" size="lg">ENVIRONMENT: {sensors.season}</Badge>
                        )}
                    </Group>
                    <Title order={1} style={{ fontSize: '2.2rem' }}>
                        Simulated <Text span c="grape" inherit>Control Tower</Text>
                    </Title>
                    <Text c="dimmed" size="lg" mt={5}>
                        Direct override and hardware stress-testing interface
                    </Text>
                </div>
                <Button
                    variant="light"
                    color="red"
                    leftSection={<IconRefresh size={18} />}
                    onClick={() => sendCommand({ reset: true })}
                >
                    Emergency Reset
                </Button>
            </Group>

            <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="lg">
                        {/* Primary Actuators */}
                        <Card withBorder radius="md" p="xl">
                            <Title order={4} mb="xl">Main Actuators</Title>
                            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                                <ControlSwitch
                                    label="Supply Pump"
                                    icon={IconDroplet}
                                    active={isPumpOn}
                                    onToggle={() => sendCommand({ pump: !isPumpOn })}
                                    loading={loading['pump']}
                                    color="blue"
                                />
                                <ControlSwitch
                                    label="Thermal Chiller"
                                    icon={IconSnowflake}
                                    active={isChillerOn}
                                    onToggle={() => sendCommand({ chiller: !isChillerOn })}
                                    loading={loading['chiller']}
                                    color="cyan"
                                />
                                <ControlSwitch
                                    label="Immersion Heater"
                                    icon={IconFlame}
                                    active={isHeaterOn}
                                    onToggle={() => sendCommand({ heater: !isHeaterOn })}
                                    loading={loading['heater']}
                                    color="orange"
                                />
                            </SimpleGrid>
                        </Card>

                        {/* Nutrient Dosing */}
                        <Card withBorder radius="md" p="xl">
                            <Title order={4} mb="xl">Nutrient Injection (Dosing Pumps)</Title>
                            <Stack gap="xl">
                                <DosingSlider
                                    label="Nutrient Solution A"
                                    value={sensors?.valveA || 0}
                                    onChange={(v: number) => sendCommand({ valveA: v })}
                                    color="red"
                                />
                                <DosingSlider
                                    label="Nutrient Solution B"
                                    value={sensors?.valveB || 0}
                                    onChange={(v: number) => sendCommand({ valveB: v })}
                                    color="indigo"
                                />
                                <DosingSlider
                                    label="Acid Neutralizer"
                                    value={sensors?.acid || 0}
                                    onChange={(v: number) => sendCommand({ acid: v })}
                                    color="yellow"
                                />
                            </Stack>
                        </Card>

                        {/* Water Supply */}
                        <Card withBorder radius="md" p="xl">
                            <Title order={4} mb="xl">Bulk Fluid Management</Title>
                            <Grid>
                                <Grid.Col span={6}>
                                    <ControlSwitch
                                        label="Raw Water Pump"
                                        icon={IconDroplet}
                                        active={isRawOn}
                                        onToggle={() => sendCommand({ raw: !isRawOn })}
                                        loading={loading['raw']}
                                        color="teal"
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <ControlSwitch
                                        label="Inlet Valve"
                                        icon={IconSettingsAutomation}
                                        active={isInletOpen}
                                        onToggle={() => sendCommand({ inlet: !isInletOpen })}
                                        loading={loading['inlet']}
                                        color="gray"
                                    />
                                </Grid.Col>
                            </Grid>
                        </Card>
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="lg">
                        {/* Real-time Status */}
                        <Card withBorder radius="md" p="xl" bg="dark.7" c="white">
                            <Group justify="space-between" mb="lg">
                                <Title order={4} c="white">Telemetry</Title>
                                <IconDeviceAnalytics size={20} />
                            </Group>

                            <Stack gap="md">
                                <TelemetryRow label="EC Level" value={sensors?.ec?.toFixed(2) || "0.00"} unit="mS/cm" color="wasabi" />
                                <TelemetryRow label="pH Balance" value={sensors?.ph?.toFixed(2) || "0.00"} unit="pH" color="yellow" />
                                <TelemetryRow label="Water Temp" value={sensors?.temp?.toFixed(1) || "0.0"} unit="°C" color="orange" />
                                <TelemetryRow label="Tank Level" value={sensors?.level?.toFixed(1) || "0.0"} unit="L" color="blue" />
                            </Stack>

                            <Divider my="xl" opacity={0.1} />

                            <Text size="xs" c="dimmed">
                                Topic: {TOPIC_SENSOR}<br />
                                Broker: {BROKER_URL}
                            </Text>
                        </Card>

                        {/* Safety Info */}
                        <Card withBorder radius="md" p="lg" bg="orange.1">
                            <Group gap="sm" mb="xs">
                                <IconStatusChange size={20} color="orange" />
                                <Text fw={700} c="orange.9">Watchdog Timer</Text>
                            </Group>
                            <Text size="sm" c="orange.8">
                                The simulator has a 5-second failsafe. If the dashboard loses connection, all dosing valves will automatically close.
                            </Text>
                        </Card>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Container>
    );
}

function ControlSwitch({ label, icon: Icon, active, onToggle, loading, color }: any) {
    return (
        <Paper withBorder p="md" radius="md" style={{ position: 'relative' }}>
            <Stack align="center" gap="xs">
                <ThemeIcon size="xl" radius="md" variant={active ? 'filled' : 'light'} color={color}>
                    <Icon size={24} />
                </ThemeIcon>
                <Text size="sm" fw={600}>{label}</Text>
                <Switch
                    checked={active}
                    onChange={onToggle}
                    disabled={loading}
                    color={color}
                    size="md"
                />
            </Stack>
        </Paper>
    );
}

function DosingSlider({ label, value, onChange, color }: any) {
    return (
        <Box>
            <Group justify="space-between" mb={5}>
                <Group gap="xs">
                    <IconFlask size={16} color={color} />
                    <Text size="sm" fw={600}>{label}</Text>
                </Group>
                <Badge color={color} variant="light">{(value * 100).toFixed(0)}% Flow</Badge>
            </Group>
            <Slider
                value={value * 100}
                onChange={(v: number) => onChange(v / 100)}
                color={color}
                step={10}
                marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                ]}
            />
        </Box>
    );
}

function TelemetryRow({ label, value, unit, color }: any) {
    return (
        <Group justify="space-between">
            <Text size="sm" c="gray.4">{label}</Text>
            <Group gap={5}>
                <Text fw={700} size="lg" c={color}>{value}</Text>
                <Text size="xs" c="dimmed">{unit}</Text>
            </Group>
        </Group>
    );
}
