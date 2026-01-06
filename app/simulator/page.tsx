"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Text, Grid, Button, Group, Slider, Badge, Stack, Box, Center, ThemeIcon, Overlay, Title, Tabs, rem, PasswordInput } from '@mantine/core';
import { Play, Pause, Lock, CheckCircle, AlertTriangle, Activity, Droplet, Zap } from 'lucide-react';

// --- Types ---
type SimulatorState = "IDLE" | "FILLING" | "DOSING" | "SUPPLYING";

// --- Logic Hook ---
const useNutrientSimulator = () => {
    const [state, setState] = useState<SimulatorState>("IDLE");
    const [subState, setSubState] = useState("");
    const [autoMode, setAutoMode] = useState(true);
    const [safetyLock, setSafetyLock] = useState(false);
    const [logMsg, setLogMsg] = useState("System Ready");

    const physics = useRef({
        rawWaterLevel: 500, tankLevel: 0, tankA: 20, tankB: 20, tankAcid: 20,
        ec: 0.5, temp: 20.0, realPh: 7.0, sensorPh: 7.0,
        solarRad: 500, dosingTime: 0, totalA: 0, totalB: 0,
        phWaitTimer: 0, displayEc: 0.5, displayPh: 7.0, displayTemp: 20.0,
    });

    const [actuators, setActuators] = useState({
        rawPump: false, inletValve: false, mixingPump: false, supplyPump: false,
        valveA: 0, valveB: 0, acidValve: 0, chiller: false, uvLamp: true, sandFilter: false,
    });

    const targets = useRef({ ec: 2.0, ph: 5.8, temp: 18.0, tolEc: 0.3, tolPh: 0.5, tolTemp: 2.0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const p = physics.current;
            const t = targets.current;
            const act = { ...actuators };

            // Physics
            if (act.rawPump) p.rawWaterLevel = Math.min(1000, p.rawWaterLevel + 2.0);
            if (act.inletValve && p.rawWaterLevel > 0) {
                p.tankLevel += 0.5; p.rawWaterLevel -= 0.5;
                if (p.tankLevel > 0) {
                    p.ec = (p.ec * (p.tankLevel - 0.5) + 0.5 * 0.5) / p.tankLevel;
                    p.realPh = (p.realPh * (p.tankLevel - 0.5) + 7.0 * 0.5) / p.tankLevel;
                }
            }
            if (act.supplyPump) p.tankLevel = Math.max(0, Math.min(200, p.tankLevel - 0.5));
            const ambientTemp = 20 + (p.solarRad / 100);
            if (act.chiller) p.temp -= 0.1; else p.temp += (ambientTemp - p.temp) * 0.005;
            if (act.valveA > 0) { p.tankA -= 0.01 * act.valveA; p.totalA += 0.01 * act.valveA; p.ec += 0.05 * act.valveA; }
            if (act.valveB > 0) { p.tankB -= 0.01 * act.valveB; p.totalB += 0.01 * act.valveB; p.ec += 0.05 * act.valveB; }
            if (act.acidValve > 0) { p.tankAcid -= 0.01 * act.acidValve; p.realPh -= 0.1 * act.acidValve; }
            p.sensorPh += (p.realPh - p.sensorPh) * 0.05;
            p.displayEc = p.ec + (Math.random() - 0.5) * 0.02;
            p.displayPh = p.sensorPh + (Math.random() - 0.5) * 0.04;
            p.displayTemp = p.temp + (Math.random() - 0.5) * 0.2;

            // Logic
            let nextState = state;
            let nextSubState = "";
            let isLocked = false;

            if (autoMode) {
                if (p.solarRad > 700) { t.ec = 2.4; setLogMsg("Mode: Sunny (High EC)"); }
                else if (p.solarRad > 300) { t.ec = 2.0; setLogMsg("Mode: Normal"); }
                else { t.ec = 1.6; setLogMsg("Mode: Low Light"); }

                if (p.rawWaterLevel < 200) act.rawPump = true; else if (p.rawWaterLevel > 900) act.rawPump = false;
                if (p.displayTemp > t.temp + t.tolTemp) act.chiller = true; else if (p.displayTemp < t.temp - 0.5) act.chiller = false;

                act.valveA = 0; act.valveB = 0; act.acidValve = 0;
                const ecError = t.ec - p.displayEc;
                const phError = p.displayPh - t.ph;

                if (state === "IDLE") {
                    p.dosingTime = 0; act.mixingPump = false; act.supplyPump = false;
                    if (p.tankLevel < 20) nextState = "FILLING";
                } else if (state === "FILLING") {
                    act.inletValve = true;
                    if (p.tankLevel >= 160) { act.inletValve = false; nextState = "DOSING"; }
                } else if (state === "DOSING") {
                    p.dosingTime += 0.1; act.mixingPump = true;
                    const isEcHigh = ecError < -t.tolEc;
                    const isPhLow = phError < -t.tolPh;
                    if (isEcHigh || isPhLow) {
                        if (p.tankLevel < 195) { nextSubState = "⚠️ DILUTING"; act.inletValve = true; isLocked = true; }
                        else { nextSubState = "🚨 TANK FULL"; isLocked = true; }
                    } else if (p.phWaitTimer > 0) {
                        p.phWaitTimer -= 1; nextSubState = `⏳ pH Reacting... (${Math.ceil(p.phWaitTimer / 10)})`; isLocked = true;
                    } else if (phError > (t.tolPh * 0.2)) {
                        nextSubState = "Acid Dosing"; act.acidValve = 1.0; p.phWaitTimer = 30; isLocked = true;
                    } else if (ecError > (t.tolEc * 0.2)) {
                        const tick = Math.floor(Date.now() / 500);
                        if (tick % 2 === 0) { nextSubState = "A-Sol Inject"; act.valveA = ecError > 0.5 ? 1.0 : 0.2; }
                        else { nextSubState = "B-Sol Inject"; act.valveB = ecError > 0.5 ? 1.0 : 0.2; }
                        isLocked = true;
                    } else { nextSubState = "Stabilizing"; }

                    if (Math.abs(ecError) < 0.1 && Math.abs(phError) < 0.1 && p.phWaitTimer === 0 && !isEcHigh && !isPhLow) {
                        nextState = "SUPPLYING";
                    }
                } else if (state === "SUPPLYING") {
                    act.mixingPump = true; act.supplyPump = true;
                    if (p.tankLevel < 20) nextState = "IDLE";
                }
            }
            setState(nextState); setSubState(nextSubState); setSafetyLock(isLocked); setActuators(act);
        }, 100);
        return () => clearInterval(interval);
    }, [state, autoMode, actuators]);
    return { state, subState, autoMode, setAutoMode, safetyLock, logMsg, physics: physics.current, actuators, targets: targets.current };
};

// --- Gauges ---
const SemiCircleGauge = ({ value, target, tol, label, unit, min, max, color }: any) => {
    const range = max - min;
    const pct = Math.max(0, Math.min(1, (value - min) / range));
    const angle = 180 - (pct * 180);
    return (
        <div style={{ position: 'relative', width: '220px', height: '110px', overflow: 'hidden', margin: '0 auto' }}>
            <div style={{
                width: '100%', height: '100%', backgroundColor: '#2C2E33',
                borderRadius: '110px 110px 0 0', borderBottom: '3px solid #5C5F66'
            }}>
                {/* Ticks */}
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        position: 'absolute', bottom: 0, left: '50%', width: 2, height: 100,
                        backgroundColor: 'rgba(255,255,255,0.2)', transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(${180 - (i / 4) * 180}deg)`
                    }} />
                ))}
                {/* Needle */}
                <div style={{
                    position: 'absolute', bottom: 0, left: '50%', width: 4, height: 90,
                    backgroundColor: '#FA5252', transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${angle}deg)`, transition: 'transform 0.3s ease-out',
                    zIndex: 10, borderRadius: 4
                }} />
                <div style={{ position: 'absolute', bottom: -8, left: '50%', width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', transform: 'translateX(-50%)', zIndex: 20 }}></div>
                {/* Target */}
                <div style={{
                    position: 'absolute', bottom: 0, left: '50%', width: 2, height: 100,
                    borderLeft: '2px dashed rgba(255,255,255,0.5)', transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${180 - ((target - min) / range) * 180}deg)`, zIndex: 5
                }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: -40, position: 'relative', zIndex: 15 }}>
                <Text size="xl" fw={900} c="white">{value.toFixed(2)}</Text>
                <Text size="xs" c="dimmed">{unit}</Text>
            </div>
        </div>
    )
}

const RainbowGauge = ({ value, target, tol }: any) => {
    const angle = -90 + (Math.max(0, Math.min(1, value / 14)) * 180);
    return (
        <div style={{ position: 'relative', width: '220px', height: '110px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', margin: '0 auto' }}>
            <div style={{
                position: 'absolute', width: '220px', height: '220px', borderRadius: '50%',
                background: `conic-gradient(from 270deg, #e74c3c 0deg 51deg, #e67e22 51deg 77deg, #2ecc71 77deg 103deg, #3498db 103deg 128deg, #9b59b6 128deg 180deg, transparent 180deg)`,
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", opacity: 0.8
            }}></div>
            <div style={{ position: 'absolute', bottom: 0, width: '160px', height: '80px', backgroundColor: '#1A1B1E', borderRadius: '100px 100px 0 0' }}></div>
            <div style={{
                position: 'absolute', bottom: 0, width: 4, height: 100, backgroundColor: 'white',
                transformOrigin: 'bottom center', transform: `rotate(${angle}deg)`, transition: 'transform 0.5s', zIndex: 10
            }}></div>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 20, marginBottom: 10 }}>
                <Text size="xl" fw={900} c="white">{value.toFixed(2)}</Text>
                <Text size="xs" c="dimmed">pH</Text>
            </div>
        </div>
    )
}

export default function SimulatorPage() {
    const sim = useNutrientSimulator();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [authError, setAuthError] = useState(false);

    if (!isAuthorized) {
        return (
            <Container fluid bg="#141517" h="100vh" p={0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stack align="center" gap="lg" style={{ animate: 'fade-in 0.5s' }}>
                    <ThemeIcon size={100} radius="xl" color="dark" variant="light" style={{ border: '2px solid #373A40' }}>
                        <Lock size={50} color="#C1C2C5" />
                    </ThemeIcon>
                    <div style={{ textAlign: 'center' }}>
                        <Title c="white" order={2} style={{ letterSpacing: 1 }}>K-WASABI SIMULATOR</Title>
                        <Badge color="red" variant="dot" size="lg" mt="xs">RESTRICTED ACCESS</Badge>
                        <Text c="dimmed" size="sm" mt="md">Proprietary Technology. Authorized Personnel Only.</Text>
                    </div>
                    <Paper p="xl" radius="lg" bg="#25262B" w={340} withBorder style={{ borderColor: '#373A40', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (inputCode === "1234") setIsAuthorized(true);
                            else { setAuthError(true); setInputCode(""); }
                        }}>
                            <Stack>
                                <PasswordInput
                                    size="md"
                                    placeholder="Enter Access Code"
                                    value={inputCode}
                                    onChange={(e) => { setInputCode(e.currentTarget.value); setAuthError(false); }}
                                    error={authError ? "Invalid Code" : null}
                                    styles={{
                                        input: { backgroundColor: '#1A1B1E', color: 'white', borderColor: '#373A40', textAlign: 'center', fontSize: 18, letterSpacing: 4 },
                                        innerInput: { textAlign: 'center' }
                                    }}
                                />
                                <Button type="submit" fullWidth color="green" size="md" variant="light" mt="xs">
                                    ACCESS SYSTEM
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Stack>
            </Container>
        );
    }

    const [activeTab, setActiveTab] = useState("DASH");

    return (
        <Container fluid bg="#1A1B1E" h="100vh" p={0} style={{ overflow: 'auto', color: '#C1C2C5' }}>
            {/* Header */}
            <Paper p="md" bg="#25262B" radius={0} shadow="sm">
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size="lg" radius="md" color="green" variant="filled"><Zap size={20} /></ThemeIcon>
                        <div>
                            <Title order={3} c="white">K-WASABI Simulator <Badge color="green" variant="light">v12.0 Web</Badge></Title>
                            <Text size="xs" c="dimmed">Integrated Nutrient Control System</Text>
                        </div>
                    </Group>
                    <Button
                        color={sim.autoMode ? "green" : "orange"}
                        onClick={() => sim.setAutoMode(!sim.autoMode)}
                        leftSection={sim.autoMode ? <Play size={16} /> : <Pause size={16} />}
                    >
                        {sim.autoMode ? "AUTO MODE" : "MANUAL MODE"}
                    </Button>
                </Group>
            </Paper>

            <Container size="xl" py="xl">
                {/* Tabs */}
                <Group mb="lg">
                    <Button
                        variant={activeTab === "DASH" ? "light" : "subtle"}
                        color={activeTab === "DASH" ? "blue" : "gray"}
                        radius="xl"
                        onClick={() => setActiveTab("DASH")}
                    >
                        📊 DASHBOARD
                    </Button>
                    <Button
                        variant={activeTab === "NUTRI" ? "light" : "subtle"}
                        color={activeTab === "NUTRI" ? "blue" : "gray"}
                        radius="xl"
                        onClick={() => setActiveTab("NUTRI")}
                    >
                        🧪 NUTRIENT
                    </Button>
                    <Button
                        variant={activeTab === "WATER" ? "light" : "subtle"}
                        color={activeTab === "WATER" ? "blue" : "gray"}
                        radius="xl"
                        onClick={() => setActiveTab("WATER")}
                    >
                        💧 WATER
                    </Button>
                </Group>

                {/* Dashboard Tab */}
                {activeTab === "DASH" && (
                    <Stack>
                        {/* Status Panel */}
                        <Paper p="xl" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40' }}>
                            <Grid align="center">
                                <Grid.Col span={{ base: 12, md: 8 }}>
                                    <Text size="sm" c="dimmed" fw={700}>SYSTEM STATUS</Text>
                                    <Group align="center" gap="md">
                                        <Text size={rem(60)} fw={900} c="white" style={{ lineHeight: 1 }}>{sim.state}</Text>
                                        {sim.subState && <Badge size="xl" color="yellow" variant="dot">{sim.subState}</Badge>}
                                    </Group>
                                    <Group mt="md">
                                        <Badge leftSection={<CheckCircle size={12} />} variant="outline" color="gray">Pump Ready</Badge>
                                        <Badge leftSection={<CheckCircle size={12} />} variant="outline" color="gray">Sensors Online</Badge>
                                    </Group>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                    <Paper p="md" bg="#1A1B1E" radius="md">
                                        <Text c="green" fw={700} size="lg" ta="right">{sim.logMsg}</Text>
                                        <Text size="xs" c="dimmed" ta="right" mb="sm">Target EC: {sim.targets.ec.toFixed(1)} | Target pH: {sim.targets.ph.toFixed(1)}</Text>
                                        <Text size="xs" mb={4}>Solar Rad Simulation</Text>
                                        <Slider
                                            color="green"
                                            min={0} max={1200} step={100} defaultValue={500}
                                            onChange={(v) => sim.physics.solarRad = v}
                                        />
                                    </Paper>
                                </Grid.Col>
                            </Grid>
                        </Paper>

                        {/* Gauges */}
                        <Grid>
                            {/* EC */}
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 320 }}>
                                    <Group justify="space-between" mb="xl">
                                        <Text fw={700} c="dimmed"><Activity size={16} style={{ verticalAlign: 'middle' }} /> EC LEVEL</Text>
                                        <Badge color="green" variant="light">REALTIME</Badge>
                                    </Group>
                                    <Center>
                                        <SemiCircleGauge value={sim.physics.displayEc} target={sim.targets.ec} tol={sim.targets.tolEc} unit="mS/cm" min={0} max={4} />
                                    </Center>
                                    <Center mt="md">
                                        <Text size="xs" c="dimmed">Safe Range: {(sim.targets.ec - sim.targets.tolEc).toFixed(1)} ~ {(sim.targets.ec + sim.targets.tolEc).toFixed(1)}</Text>
                                    </Center>
                                </Paper>
                            </Grid.Col>

                            {/* pH */}
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 320, position: 'relative', overflow: 'hidden' }}>
                                    <Overlay center blur={2} opacity={0.9} color="#1A1B1E" zIndex={10} display={sim.safetyLock ? 'flex' : 'none'}>
                                        <Stack align="center" gap="xs">
                                            <Lock size={40} color="#FA5252" />
                                            <Text c="red" fw={900}>SAFETY LOCK</Text>
                                            <Text c="white" size="sm">{sim.subState}</Text>
                                        </Stack>
                                    </Overlay>
                                    <Group justify="space-between" mb="xl">
                                        <Text fw={700} c="dimmed"><Droplet size={16} style={{ verticalAlign: 'middle' }} /> pH LEVEL</Text>
                                        <Badge color="yellow" variant="light">SMART WAIT</Badge>
                                    </Group>
                                    <Center>
                                        <RainbowGauge value={sim.physics.displayPh} target={sim.targets.ph} />
                                    </Center>
                                    <Stack gap={2} mt="md" align="center">
                                        <Text size="xs" c="dimmed">Wait Timer</Text>
                                        <Box w={`${(sim.physics.phWaitTimer / 30) * 100}%`} h={6} bg="dark.4" style={{ borderRadius: 6, overflow: 'hidden' }}>
                                            <Box w="100%" h="100%" bg="yellow" style={{ transition: 'width 0.5s' }} />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid.Col>

                            {/* Temp */}
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 320 }}>
                                    <Text fw={700} c="dimmed" mb="xl">🌡️ TEMPERATURE</Text>
                                    <Center>
                                        <div style={{ position: 'relative', width: 60, height: 160, backgroundColor: '#2C2E33', borderRadius: 30, padding: 4 }}>
                                            <div style={{ width: '100%', height: '100%', borderRadius: 28, backgroundColor: '#1A1B1E', position: 'relative', overflow: 'hidden' }}>
                                                <div style={{
                                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                                    height: `${(sim.physics.displayTemp / 40) * 100}%`,
                                                    background: 'linear-gradient(to top, blue, red)', opacity: 0.6,
                                                    transition: 'height 0.5s'
                                                }} />
                                                <Center h="100%" style={{ position: 'relative', zIndex: 10 }}>
                                                    <Text fw={900} size="lg" c="white">{sim.physics.displayTemp.toFixed(1)}°</Text>
                                                </Center>
                                            </div>
                                        </div>
                                    </Center>
                                    <Group justify="center" mt="xl">
                                        <Badge color={sim.actuators.chiller ? "blue" : "gray"} variant="filled">Chiller</Badge>
                                        <Badge color="gray" variant="filled">Heater</Badge>
                                    </Group>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                )}

                {/* Coming Soon Placeholder */}
                {activeTab !== "DASH" && (
                    <Paper p="xl" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack align="center">
                            <ThemeIcon size={80} radius="xl" color="yellow" variant="light">
                                <AlertTriangle size={40} />
                            </ThemeIcon>
                            <Title order={2} c="white">Coming Soon</Title>
                            <Text c="dimmed">The {activeTab === "NUTRI" ? "Nutrient Mixing" : "Water Treatment"} module is currently under development.</Text>
                            <Text c="dimmed" size="xs">Please use the Python Simulator for full features.</Text>
                        </Stack>
                    </Paper>
                )}
            </Container>
        </Container>
    );
}
