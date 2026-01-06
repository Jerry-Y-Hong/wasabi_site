"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Text, Grid, Button, Group, Slider, Badge, Stack, Box, Center, ThemeIcon, Overlay, Title, Tabs, rem, PasswordInput, Divider } from '@mantine/core';
import { Play, Pause, Lock, CheckCircle, AlertTriangle, Activity, Droplet, Zap, LayoutDashboard, ArrowDown, Fan, ThermometerSnowflake, Wind } from 'lucide-react';

// --- Types ---
type SimulatorState = "IDLE" | "FILLING" | "DOSING" | "SUPPLYING";

// --- Logic Hook (Ref-based for Physics Loop stability) ---
const useNutrientSimulator = () => {
    // 1. Mutable State (The Physics Engine)
    const engine = useRef({
        state: "IDLE" as SimulatorState,
        subState: "",
        logMsg: "System Ready",
        autoMode: true,
        safetyLock: false,
        physics: {
            rawWaterLevel: 500, tankLevel: 0, tankA: 20, tankB: 20, tankAcid: 20,
            ec: 0.5, temp: 20.0, realPh: 7.0, sensorPh: 7.0,
            solarRad: 500, dosingTime: 0, totalA: 0, totalB: 0,
            phWaitTimer: 0, displayEc: 0.5, displayPh: 7.0, displayTemp: 20.0
        },
        env: {
            airTemp: 24.0, airHum: 60.0,
            bedTemp: 22.0, bedHum: 45.0
        },
        actuators: {
            rawPump: false, inletValve: false, mixingPump: false, supplyPump: false, // R-01 ~ R-03
            valveA: 0, valveB: 0, acidValve: 0,
            chiller: false, uvLamp: true, sandFilter: false
        },
        hvac: {
            fan_circ: false, // R-05
            fan_exh: false,  // R-06
            heater_bed: false // R-07
        },
        targets: { ec: 2.0, ph: 5.8, temp: 18.0, tolEc: 0.3, tolPh: 0.5, tolTemp: 2.0 }
    });

    // 2. React State (For Rendering)
    const [renderTick, setRenderTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const e = engine.current; // Shortcut
            const p = e.physics;
            const act = e.actuators;
            const env = e.env;
            const hvac = e.hvac;
            const t = e.targets;

            // --- 1. Physics Simulation ---
            if (act.rawPump) p.rawWaterLevel = Math.min(1000, p.rawWaterLevel + 2.0);
            if (act.inletValve && p.rawWaterLevel > 0) {
                p.tankLevel += 0.5; p.rawWaterLevel -= 0.5;
                if (p.tankLevel > 0) {
                    p.ec = (p.ec * (p.tankLevel - 0.5) + 0.5 * 0.5) / p.tankLevel;
                    p.realPh = (p.realPh * (p.tankLevel - 0.5) + 7.0 * 0.5) / p.tankLevel;
                }
            }
            if (act.supplyPump) p.tankLevel = Math.max(0, Math.min(200, p.tankLevel - 0.5));

            // Nutrient Temp
            const ambientTemp = e.env.airTemp; // Linked to Air Temp
            if (act.chiller) p.temp -= 0.1; else p.temp += (ambientTemp - p.temp) * 0.005;

            // Dosing
            if (act.valveA > 0) { p.tankA -= 0.01 * act.valveA; p.totalA += 0.01 * act.valveA; p.ec += 0.05 * act.valveA; }
            if (act.valveB > 0) { p.tankB -= 0.01 * act.valveB; p.totalB += 0.01 * act.valveB; p.ec += 0.05 * act.valveB; }
            if (act.acidValve > 0) { p.tankAcid -= 0.01 * act.acidValve; p.realPh -= 0.1 * act.acidValve; }

            p.sensorPh += (p.realPh - p.sensorPh) * 0.05;

            // Environmental Physics (Smart Bed)
            // 1. Air Physics
            if (hvac.fan_exh) env.airTemp -= 0.05; // Ventilation Cooling
            else env.airTemp += (p.solarRad / 25000); // Solar Heating

            // 2. Bed Physics
            if (act.supplyPump) {
                // Irrigation cools/warms bed to water temp
                env.bedTemp += (p.displayTemp - env.bedTemp) * 0.05; // Water Temp effect
                env.bedHum = Math.min(100, env.bedHum + 0.5); // Wetting
            } else {
                env.bedHum = Math.max(30, env.bedHum - 0.05); // Drying
            }
            if (hvac.heater_bed) env.bedTemp += 0.1; // Bed Heating
            env.bedTemp += (env.airTemp - env.bedTemp) * 0.002; // Thermal Equilibrium

            // Noise for display
            p.displayEc = p.ec + (Math.random() - 0.5) * 0.02;
            p.displayPh = p.sensorPh + (Math.random() - 0.5) * 0.04;
            p.displayTemp = p.temp + (Math.random() - 0.5) * 0.2;

            // --- 2. Control Logic ---
            if (e.autoMode) {
                // Solar Modes
                if (p.solarRad > 700) { t.ec = 2.4; e.logMsg = "Mode: Sunny (High EC)"; }
                else if (p.solarRad > 300) { t.ec = 2.0; e.logMsg = "Mode: Normal"; }
                else { t.ec = 1.6; e.logMsg = "Mode: Low Light"; }

                // Water Level
                if (p.rawWaterLevel < 200) act.rawPump = true; else if (p.rawWaterLevel > 900) act.rawPump = false;

                // Temp Control
                if (p.displayTemp > t.temp + t.tolTemp) act.chiller = true; else if (p.displayTemp < t.temp - 0.5) act.chiller = false;

                // State Machine
                act.valveA = 0; act.valveB = 0; act.acidValve = 0;
                const ecError = t.ec - p.displayEc;
                const phError = p.displayPh - t.ph;
                e.safetyLock = false;

                if (e.state === "IDLE") {
                    p.dosingTime = 0; act.mixingPump = false; act.supplyPump = false;
                    if (p.tankLevel < 20) e.state = "FILLING";
                } else if (e.state === "FILLING") {
                    act.inletValve = true;
                    if (p.tankLevel >= 160) { act.inletValve = false; e.state = "DOSING"; }
                } else if (e.state === "DOSING") {
                    p.dosingTime += 0.1; act.mixingPump = true;
                    // ... Dosing Logic Simplified ...
                    if (p.phWaitTimer > 0) {
                        p.phWaitTimer -= 1; e.subState = `⏳ pH Reacting... (${Math.ceil(p.phWaitTimer / 10)})`; e.safetyLock = true;
                    } else if (Math.abs(phError) > t.tolPh * 0.2) {
                        e.subState = "Acid Dosing"; act.acidValve = 1.0; p.phWaitTimer = 30; e.safetyLock = true;
                    } else if (ecError > t.tolEc * 0.2) {
                        const tick = Math.floor(Date.now() / 500);
                        if (tick % 2 === 0) { e.subState = "A-Sol Inject"; act.valveA = 1.0; }
                        else { e.subState = "B-Sol Inject"; act.valveB = 1.0; }
                        e.safetyLock = true;
                    } else { e.subState = "Stabilizing"; }

                    if (Math.abs(ecError) < 0.1 && Math.abs(phError) < 0.1 && p.phWaitTimer === 0) e.state = "SUPPLYING";

                } else if (e.state === "SUPPLYING") {
                    act.mixingPump = true; act.supplyPump = true;
                    if (p.tankLevel < 20) e.state = "IDLE";
                }
            }

            // Trigger Render
            setRenderTick(t => t + 1);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Helper functions to interact with the Mutable state
    const setSolar = (v: number) => { engine.current.physics.solarRad = v; };
    const setAuto = (v: boolean) => { engine.current.autoMode = v; };
    const toggleHvac = (key: keyof typeof engine.current.hvac) => { engine.current.hvac[key] = !engine.current.hvac[key]; };

    // Return the Immutable Snapshot for React Rendering
    return {
        ...engine.current,
        setSolar, setAuto, toggleHvac
    };
};

// --- Gauge Components ---
const MustangNeedle = ({ angle, color = "#e74c3c" }: { angle: number, color?: string }) => (
    <>
        <div style={{
            position: 'absolute', bottom: 0, left: '50%', width: 0, height: 0,
            borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
            borderBottom: `70px solid ${color}`,
            transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${angle}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 50, filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
        }} />
        <div style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
            width: 16, height: 16, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #555, #000)',
            border: '2px solid #333', zIndex: 60, boxShadow: '0 2px 5px rgba(0,0,0,0.8)'
        }}></div>
    </>
);

const GaugeBezel = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        position: 'relative', width: '180px', height: '100px', margin: '0 auto',
        padding: '10px',
        background: '#151515',
        borderRadius: '90px 90px 0 0',
        boxShadow: `inset 0 2px 5px rgba(255,255,255,0.2), 0 5px 15px rgba(0,0,0,0.8), 0 0 0 4px #2c3e50, 0 0 0 6px #555`,
        overflow: 'hidden'
    }}>{children}</div>
);

const SemiCircleGauge = ({ value, target, tol, label, unit, min, max, color }: any) => {
    const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const angle = -90 + (pct * 180);
    return (
        <div style={{ width: 180, margin: '0 auto' }}>
            <GaugeBezel>
                <div style={{ position: 'absolute', top: 10, left: 10, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #222 0%, #000 90%)', boxShadow: 'inset 0 0 20px #000' }} />
                <div style={{
                    position: 'absolute', top: 10, left: 10, width: 160, height: 160, borderRadius: '50%',
                    background: `conic-gradient(from 270deg, #3498db 0deg 60deg, #2ecc71 60deg 120deg, #e74c3c 120deg 180deg, transparent 180deg)`,
                    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", mask: "radial-gradient(transparent 55%, black 56%)", WebkitMask: "radial-gradient(transparent 55%, black 56%)", opacity: 0.9
                }}></div>
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        position: 'absolute', bottom: 0, left: '50%', width: 2, height: 80,
                        background: 'linear-gradient(to bottom, #fff 8px, transparent 8px)',
                        transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${-90 + (i / 4) * 180}deg)`, zIndex: 20, opacity: 0.8
                    }} />
                ))}
                <MustangNeedle angle={angle} color="#e74c3c" />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '90px 90px 0 0', pointerEvents: 'none', zIndex: 100 }} />
            </GaugeBezel>
            <div style={{ textAlign: 'center', marginTop: '-35px', position: 'relative', zIndex: 70 }}>
                <Text size={rem(24)} fw={900} c="white" style={{ textShadow: "0 0 10px rgba(52, 152, 219, 0.5)", fontFamily: "Impact, sans-serif", letterSpacing: 1 }}>{value.toFixed(2)}</Text>
                <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase', letterSpacing: 2 }}>{unit}</Text>
            </div>
        </div>
    )
}

const RainbowGauge = ({ value, target, tol }: any) => {
    const angle = -90 + (Math.max(0, Math.min(1, value / 14)) * 180);
    return (
        <div style={{ width: 180, margin: '0 auto' }}>
            <GaugeBezel>
                <div style={{ position: 'absolute', top: 10, left: 10, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #222 0%, #000 90%)', boxShadow: 'inset 0 0 20px #000' }} />
                <div style={{
                    position: 'absolute', top: 10, left: 10, width: 160, height: 160, borderRadius: '50%',
                    background: `conic-gradient(from 270deg, #e74c3c 0deg 51deg, #e67e22 51deg 77deg, #2ecc71 77deg 103deg, #3498db 103deg 128deg, #9b59b6 128deg 180deg, transparent 180deg)`,
                    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", mask: "radial-gradient(transparent 55%, black 56%)", WebkitMask: "radial-gradient(transparent 55%, black 56%)", opacity: 0.9
                }}></div>
                <MustangNeedle angle={angle} color="#3498db" />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '90px 90px 0 0', pointerEvents: 'none', zIndex: 100 }} />
            </GaugeBezel>
            <div style={{ textAlign: 'center', marginTop: '-35px', position: 'relative', zIndex: 70 }}>
                <Text size={rem(24)} fw={900} c="white" style={{ textShadow: "0 0 10px rgba(46, 204, 113, 0.5)", fontFamily: "Impact, sans-serif", letterSpacing: 1 }}>{value.toFixed(2)}</Text>
                <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase', letterSpacing: 2 }}>pH</Text>
            </div>
        </div>
    )
}

const MustangVerticalGauge = ({ value, min, max, unit }: any) => {
    const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return (
        <div style={{ width: 180, margin: '0 auto' }}>
            <GaugeBezel>
                <div style={{ position: 'absolute', top: 10, left: 10, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #222 0%, #000 90%)', boxShadow: 'inset 0 0 20px #000' }} />
                <div style={{ position: 'absolute', top: 40, left: 30, width: 30, height: 2, background: '#333', boxShadow: '0 10px 0 #333, 0 20px 0 #333' }} />
                <div style={{ position: 'absolute', top: 40, right: 30, width: 30, height: 2, background: '#333', boxShadow: '0 10px 0 #333, 0 20px 0 #333' }} />
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 16, height: 85, borderRadius: '10px 10px 0 0', background: '#222', boxShadow: 'inset 0 0 5px #000', zIndex: 10 }} />
                <div style={{ position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)', width: 10, height: `${pct * 65}px`, borderRadius: 10, background: 'linear-gradient(to top, #3498db, #e74c3c)', transition: 'height 0.5s', boxShadow: '0 0 10px rgba(231, 76, 60, 0.5)', zIndex: 11 }} />
                <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b)', boxShadow: '0 0 10px rgba(231, 76, 60, 0.6), inset 0 2px 5px rgba(255,255,255,0.4)', zIndex: 20 }} />
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 85, borderRadius: 10, background: 'rgba(255,255,255,0.1)', pointerEvents: 'none', zIndex: 15 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '90px 90px 0 0', pointerEvents: 'none', zIndex: 100 }} />
            </GaugeBezel>
            <div style={{ textAlign: 'center', marginTop: '-35px', position: 'relative', zIndex: 70 }}>
                <Text size={rem(24)} fw={900} c="white" style={{ textShadow: "0 0 10px rgba(231, 76, 60, 0.5)", fontFamily: "Impact, sans-serif", letterSpacing: 1 }}>{value.toFixed(1)}</Text>
                <Text size="xs" c="dimmed" fw={700}>{unit}</Text>
            </div>
        </div>
    )
}

// --- Smart Bed Monitor Component ---
const SmartBedMonitor = ({ sim }: any) => {
    const deltaTemp = sim.env.airTemp - sim.env.bedTemp;
    const deltaHum = sim.env.airHum - sim.env.bedHum;

    return (
        <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40' }}>
            <Group justify="space-between" mb="lg">
                <Group gap="xs">
                    <ThemeIcon color="teal" variant="light" size="lg"><LayoutDashboard size={20} /></ThemeIcon>
                    <Text fw={700} c="white">SMART BED MONITOR (Zone A)</Text>
                </Group>
                <Group gap="xs">
                    <Badge color="gray" variant="outline">ZONE A-1</Badge>
                    <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime' }}>SYSTEM ACTIVE</Badge>
                </Group>
            </Group>

            <Grid>
                {/* Upper: Air / Canopy */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper p="md" bg="#2C2E33" radius="md" style={{ borderLeft: '4px solid #3bc9db' }}>
                        <Group justify="space-between" mb={4}>
                            <Text size="xs" c="dimmed" fw={700}>🔼 UPPER (AIR/CANOPY)</Text>
                            <Wind size={14} color="#3bc9db" />
                        </Group>
                        <Group justify="space-between" align="flex-end">
                            <div>
                                <Text size="xl" fw={900} c="white">{sim.env.airTemp.toFixed(1)}°C</Text>
                                <Text size="xs" c="dimmed">Air Temp</Text>
                            </div>
                            <div>
                                <Text size="xl" fw={900} c="cyan">{sim.env.airHum.toFixed(1)}%</Text>
                                <Text size="xs" c="dimmed">Humidity</Text>
                            </div>
                        </Group>
                        <Divider my="sm" color="dark.4" />
                        <Group gap={8}>
                            <Button
                                size="xs" variant={sim.hvac.fan_circ ? "filled" : "default"} color="blue"
                                onClick={() => sim.toggleHvac('fan_circ')}
                            >
                                Circ. Fan (R-05) {sim.hvac.fan_circ ? "ON" : "OFF"}
                            </Button>
                            <Button
                                size="xs" variant={sim.hvac.fan_exh ? "filled" : "default"} color="orange"
                                onClick={() => sim.toggleHvac('fan_exh')}
                            >
                                Exh. Fan (R-06) {sim.hvac.fan_exh ? "ON" : "OFF"}
                            </Button>
                        </Group>
                    </Paper>
                </Grid.Col>

                {/* Delta Info (Middle) */}
                <Grid.Col span={{ base: 12, md: 2 }}>
                    <Stack align="center" justify="center" h="100%" gap={8}>
                        <ArrowDown size={32} color="#555" />
                        <Badge color={Math.abs(deltaTemp) > 5 ? "red" : "gray"} variant="filled" size="lg">
                            ΔT {deltaTemp > 0 ? "+" : ""}{deltaTemp.toFixed(1)}
                        </Badge>
                        <Badge color="gray" variant="outline">
                            ΔH {deltaHum > 0 ? "+" : ""}{deltaHum.toFixed(0)}%
                        </Badge>
                    </Stack>
                </Grid.Col>

                {/* Lower: Bed / Root */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper p="md" bg="#231f1f" radius="md" style={{ borderLeft: '4px solid #eebbbc' }}>
                        <Group justify="space-between" mb={4}>
                            <Text size="xs" c="dimmed" fw={700}>🔽 LOWER (BED/ROOT)</Text>
                            <ThermometerSnowflake size={14} color="#eebbbc" />
                        </Group>
                        <Group justify="space-between" align="flex-end">
                            <div>
                                <Text size="xl" fw={900} c="white">{sim.env.bedTemp.toFixed(1)}°C</Text>
                                <Text size="xs" c="dimmed">Bed Temp</Text>
                            </div>
                            <div>
                                <Text size="xl" fw={900} c="teal">{sim.env.bedHum.toFixed(1)}%</Text>
                                <Text size="xs" c="dimmed">Moisture</Text>
                            </div>
                        </Group>
                        <Divider my="sm" color="dark.4" />
                        <Group gap={8}>
                            <Button
                                size="xs" variant={sim.hvac.heater_bed ? "filled" : "default"} color="red"
                                onClick={() => sim.toggleHvac('heater_bed')}
                            >
                                Bed Heat (R-07) {sim.hvac.heater_bed ? "ON" : "OFF"}
                            </Button>
                            <Badge color={sim.actuators.supplyPump ? "blue" : "gray"} variant="dot">
                                {sim.actuators.supplyPump ? "Irrigating..." : "Bed Status: Good"}
                            </Badge>
                        </Group>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

export default function SimulatorPage() {
    const sim = useNutrientSimulator();
    const [activeTab, setActiveTab] = useState("DASH");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [authError, setAuthError] = useState(false);

    if (!isAuthorized) {
        return (
            <Container fluid bg="#141517" h="100vh" p={0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stack align="center" gap="lg">
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
                                    size="md" placeholder="Enter Access Code" value={inputCode}
                                    onChange={(e) => { setInputCode(e.currentTarget.value); setAuthError(false); }}
                                    error={authError ? "Invalid Code" : null}
                                    styles={{ input: { backgroundColor: '#1A1B1E', color: 'white', borderColor: '#373A40', textAlign: 'center', fontSize: 18, letterSpacing: 4 }, innerInput: { textAlign: 'center' } }}
                                />
                                <Button type="submit" fullWidth color="green" size="md" variant="light" mt="xs">ACCESS SYSTEM</Button>
                            </Stack>
                        </form>
                    </Paper>
                </Stack>
            </Container>
        );
    }

    return (
        <Container fluid bg="#1A1B1E" h="100vh" p={0} style={{ overflow: 'auto', color: '#C1C2C5' }}>
            <Paper p="md" bg="#25262B" radius={0} shadow="sm">
                <Group justify="space-between">
                    <Group>
                        <ThemeIcon size="lg" radius="md" color="green" variant="filled"><Zap size={20} /></ThemeIcon>
                        <div>
                            <Title order={3} c="white">K-WASABI Simulator <Badge color="green" variant="light">v12.0 Web</Badge></Title>
                            <Text size="xs" c="dimmed">Integrated Nutrient Control System</Text>
                        </div>
                    </Group>
                    <Button color={sim.autoMode ? "green" : "orange"} onClick={() => sim.setAuto(!sim.autoMode)} leftSection={sim.autoMode ? <Play size={16} /> : <Pause size={16} />}>
                        {sim.autoMode ? "AUTO MODE" : "MANUAL MODE"}
                    </Button>
                </Group>
            </Paper>

            <Container size="xl" py="xl">
                <Group mb="lg">
                    {["DASH", "NUTRI", "WATER"].map(t => (
                        <Button key={t} variant={activeTab === t ? "light" : "subtle"} color={activeTab === t ? "blue" : "gray"} radius="xl" onClick={() => setActiveTab(t)}>
                            {t === "DASH" ? "📊 DASHBOARD" : t === "NUTRI" ? "🧪 NUTRIENT" : "💧 WATER"}
                        </Button>
                    ))}
                </Group>

                {activeTab === "DASH" && (
                    <Stack gap="lg">
                        <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40' }}>
                            <Group justify="space-between" align="center">
                                <div>
                                    <Text size="sm" c="dimmed" fw={700}>SYSTEM STATUS</Text>
                                    <Group align="center" gap="md" mt={4}>
                                        <Text size={rem(48)} fw={900} c="white" style={{ lineHeight: 1 }}>{sim.state}</Text>
                                        {sim.subState && <Badge size="lg" color="yellow" variant="dot">{sim.subState}</Badge>}
                                    </Group>
                                </div>
                                <Stack align="flex-end" gap={4}>
                                    <Text c="green" fw={700} size="md" ta="right">{sim.logMsg}</Text>
                                    <Group gap="xs">
                                        <Badge leftSection={<CheckCircle size={10} />} color="gray" variant="light">Pump Ready</Badge>
                                        <Badge leftSection={<CheckCircle size={10} />} color="gray" variant="light">Sensors OK</Badge>
                                    </Group>
                                </Stack>
                            </Group>
                        </Paper>

                        <Paper p="md" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40' }}>
                            <Stack gap={4}>
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <ThemeIcon color="orange" variant="light"><Zap size={16} /></ThemeIcon>
                                        <Text fw={700} c="orange">SOLAR RADIATION SIMULATION</Text>
                                    </Group>
                                    <Text fw={700} c="white">{sim.physics.solarRad} W/㎡</Text>
                                </Group>
                                <Slider color="orange" size="lg" min={0} max={1200} step={100} defaultValue={500} onChange={sim.setSolar} label={(val) => `${val} W/㎡`} marks={[{ value: 0, label: 'Night' }, { value: 500, label: 'Cloudy' }, { value: 1000, label: 'Sunny' }]} styles={{ markLabel: { color: '#909296', fontSize: 10 } }} />
                            </Stack>
                        </Paper>

                        <Grid>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Group justify="center" mb="md"><Text fw={700} c="dimmed"><Activity size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> EC LEVEL</Text></Group>
                                    <SemiCircleGauge value={sim.physics.displayEc} target={sim.targets.ec} tol={sim.targets.tolEc} unit="mS/cm" min={0} max={4} />
                                    <Center mt="md"><Badge color="blue" variant="outline">Target: {sim.targets.ec.toFixed(1)}</Badge></Center>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 250, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Overlay center blur={2} opacity={0.9} color="#1A1B1E" zIndex={100} display={sim.safetyLock ? 'flex' : 'none'}><Stack align="center" gap="xs"><Lock size={40} color="#FA5252" /><Text c="red" fw={900}>SAFETY WAIT</Text></Stack></Overlay>
                                    <Group justify="center" mb="md"><Text fw={700} c="dimmed"><Droplet size={16} style={{ verticalAlign: 'middle', marginRight: 5 }} /> pH LEVEL</Text></Group>
                                    <RainbowGauge value={sim.physics.displayPh} target={sim.targets.ph} />
                                    <Center mt="md"><Badge color="green" variant="outline">Target: {sim.targets.ph.toFixed(1)}</Badge></Center>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <Paper p="lg" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Group justify="center" mb="md"><Text fw={700} c="dimmed">🌡️ TEMPERATURE</Text></Group>
                                    <MustangVerticalGauge value={sim.physics.displayTemp} min={0} max={40} unit="°C" />
                                    <Center mt="md"><Group gap="xs"><Badge color={sim.actuators.chiller ? "blue" : "gray"} variant="filled">Chiller</Badge><Badge color="gray" variant="filled">Heater</Badge></Group></Center>
                                </Paper>
                            </Grid.Col>
                        </Grid>

                        {/* NEW: Smart Bed Monitor */}
                        <SmartBedMonitor sim={sim} />

                    </Stack>
                )}
                {activeTab !== "DASH" && (
                    <Paper p="xl" bg="#25262B" radius="lg" withBorder style={{ borderColor: '#373A40', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack align="center">
                            <ThemeIcon size={80} radius="xl" color="yellow" variant="light"><AlertTriangle size={40} /></ThemeIcon>
                            <Title order={2} c="white">Coming Soon</Title>
                            <Text c="dimmed">This module is under development.</Text>
                        </Stack>
                    </Paper>
                )}
            </Container>
        </Container>
    );
}
