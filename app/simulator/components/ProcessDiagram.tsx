import React from 'react';
import { Paper, Group, Stack, Text, Badge, Box, Divider, Button, rem, Tooltip } from '@mantine/core';
import { Activity, Droplet, Gauge, Layers, Zap, AlertTriangle, Layers as LayersIcon } from 'lucide-react';
import { EnvironmentBar } from './EnvironmentBar';
import { Sparkline } from './Sparkline';

interface ProcessDiagramProps {
    sim: any;
}

// --- Reusable Components ---
const Pipe = ({ active, vertical = false, length = 40, color = "#22b8cf" }: any) => (
    <Box
        w={vertical ? 4 : length}
        h={vertical ? length : 4}
        bg="#1A1B1E"
        style={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}
    >
        {active && (
            <Box
                className={vertical ? "flow-animation-v" : "flow-animation-h"}
                w="100%" h="100%"
                style={{
                    background: `linear-gradient(${vertical ? 'to bottom' : 'to right'}, ${color} 50%, transparent 50%)`,
                    backgroundSize: vertical ? '100% 20px' : '20px 100%',
                }}
            />
        )}
    </Box>
);

const Node = ({ label, active, intentActive, color = "#22b8cf", val, unit, subLabel, icon: Icon }: any) => (
    <Stack gap={4} align="center" style={{ position: 'relative' }}>
        <Paper
            w={80} h={80} radius="md" p={0}
            bg="#141517"
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${active ? color : (intentActive ? color : '#333')}`,
                boxShadow: active ? `0 0 15px ${color}40` : 'none',
                opacity: intentActive ? 1 : (active ? 1 : 0.6),
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
        >
            {Icon ? <Icon size={24} color={active ? color : "#555"} /> : <Zap size={24} color={active ? color : "#555"} />}
            <Text size={rem(10)} fw={700} mt={4} c={active ? "white" : "dimmed"}>{label}</Text>
            {val !== undefined && (
                <Text size={rem(12)} fw={900} c={color}>
                    {typeof val === 'number' ? Number(val).toFixed(0) : val}{unit}
                </Text>
            )}
            {subLabel && <Text size={rem(9)} c="dimmed">{subLabel}</Text>}
        </Paper>
        {/* Intent Indicator */}
        {intentActive && !active && (
            <Badge size="xs" variant="filled" color="yellow" className="pulsate" style={{ position: 'absolute', top: -10, right: -10 }}>
                cmd
            </Badge>
        )}
    </Stack>
);

export const ProcessDiagram = ({ sim }: ProcessDiagramProps) => {
    const { physics, actuators, feedback, aeroponics } = sim;
    const intent = actuators;

    return (
        <Paper p="xs" bg="#101113" radius="lg">

            {/* 0. GLOBAL HEADER (Environment) */}
            <EnvironmentBar sim={sim} physics={physics} intent={intent} />

            <Stack align="center" gap={18} py={5}>

                {/* 1. SOURCE & MIXING */}
                <Box>
                    <Group align="center" gap={0}>
                        <Node label="SOURCE" active={true} color="#228be6" val="tab" unit="" icon={Droplet} />
                        <Pipe active={intent.rawPump} length={50} />
                        <Node label="raw PUMP" active={feedback.rawPump} intentActive={intent.rawPump} color="#228be6" icon={Activity} />
                        <Pipe active={intent.rawPump} length={80} />

                        {/* Mixer Complex */}
                        <div style={{ position: 'relative' }}>
                            {/* Dosing Lamps (A/B/Acid) */}
                            <Group gap={4} style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 'max-content', zIndex: 10 }}>
                                <Tooltip label="Nutrient A"><Box w={12} h={12} bg={intent.valveA ? "#be4bdb" : "#333"} style={{ borderRadius: '50%', border: intent.valveA ? '2px solid white' : '1px solid #555', boxShadow: intent.valveA ? '0 0 8px #be4bdb' : 'none' }} /></Tooltip>
                                <Tooltip label="Nutrient B"><Box w={12} h={12} bg={intent.valveB ? "#be4bdb" : "#333"} style={{ borderRadius: '50%', border: intent.valveB ? '2px solid white' : '1px solid #555', boxShadow: intent.valveB ? '0 0 8px #be4bdb' : 'none' }} /></Tooltip>
                                <Tooltip label="pH Acid"><Box w={12} h={12} bg={intent.acidValve ? "#fab005" : "#333"} style={{ borderRadius: '50%', border: intent.acidValve ? '2px solid white' : '1px solid #555', boxShadow: intent.acidValve ? '0 0 8px #fab005' : 'none' }} /></Tooltip>
                            </Group>

                            <Node label="MIXER" active={intent.valveA || intent.valveB || intent.acidValve} intentActive={intent.valveA} color="#be4bdb" icon={Layers} />

                            <Stack gap={4} mt={-38} align="center" style={{ pointerEvents: 'none' }}>
                                <Badge size="xs" variant="filled" color="cyan" style={{ opacity: intent.valveA || intent.valveB ? 1 : 0.2, fontSize: 8, height: 14 }}>
                                    NUTRI
                                </Badge>
                                <Badge size="xs" variant="filled" color="lime" style={{ opacity: intent.acidValve ? 1 : 0.2, fontSize: 8, height: 14 }}>
                                    pH
                                </Badge>
                            </Stack>
                            <Stack gap={0} mt={4} align="center">
                                <Badge size="xs" variant="outline" color="cyan" style={{ fontFamily: 'monospace', letterSpacing: 0, fontSize: 9 }}>
                                    EC {Number(physics.ec || 0).toFixed(2)}
                                </Badge>
                                <Badge size="xs" variant="outline" color="lime" style={{ fontFamily: 'monospace', letterSpacing: 0, fontSize: 9 }}>
                                    pH {Number(physics.realPh || 0).toFixed(1)}
                                </Badge>
                            </Stack>
                        </div>

                        <Pipe active={intent.rawPump || feedback.rawPump} length={50} />

                        {/* TANK Node */}
                        <Node label="TANK" active={physics.tankLevel > 1} intentActive={intent.inletValve || intent.rawPump} color={physics.tankLevel < 20 ? (intent.inletValve ? "orange" : "#fa5252") : "#22b8cf"} val={physics.tankLevel} unit="L" />

                        <Pipe active={intent.supplyPump || feedback.pump || sim.aeroponics.isSpraying} color="#15aabf" />
                        <Node label="SUPPLY" active={feedback.pump || sim.aeroponics.isSpraying} intentActive={intent.supplyPump || sim.aeroponics.isSpraying} color="#15aabf" />
                        <Pipe active={intent.supplyPump || feedback.pump || sim.aeroponics.isSpraying} length={40} color="#15aabf" />

                        {/* Racks Distribution */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Pipe active={intent.supplyPump || feedback.pump || sim.aeroponics.isSpraying} length={120} vertical color="#15aabf" />
                            <Stack gap={10} style={{ marginLeft: -3, position: 'absolute', left: 0 }}>
                                {[0, 1, 2, 3, 4].map((idx: number) => {
                                    const isRackActive = sim.aeroponics.activeRack === idx;
                                    const hasFlow = (intent.supplyPump || feedback.pump) && isRackActive;
                                    return (
                                        <Group key={idx} gap={0} wrap="nowrap">
                                            <Pipe active={hasFlow} length={60} color="#22b8cf" />
                                            <Paper px={8} py={4} bg={isRackActive ? "rgba(64, 192, 87, 0.2)" : "#141517"} style={{ border: `1px solid ${isRackActive ? '#40c057' : '#333'}`, boxShadow: isRackActive ? '0 0 10px rgba(64, 192, 87, 0.4)' : 'none', transition: 'all 0.3s' }} >
                                                <Text size={rem(9)} fw={900} c={isRackActive ? 'white' : 'dimmed'}>RACK 0{idx + 1}</Text>
                                            </Paper>
                                        </Group>
                                    );
                                })}
                            </Stack>
                        </div>
                    </Group>
                </Box>

                {/* --- ULTRA SLIM TREND BAR --- */}
                <Paper p={4} px={10} bg="rgba(0,0,0,0.2)" radius="md" style={{ border: '1px solid #333', width: '100%' }}>
                    <Group justify="space-around" gap={10}>
                        {/* Water Temp Trend */}
                        <Group gap={6}>
                            <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>WATER</Text>
                            <Sparkline data={sim.history?.waterTemp || []} color="#fa5252" min={15} max={25} width={60} height={15} />
                            <Text size="xs" c="#fa5252" fw={700} style={{ fontSize: 10 }}>{physics.displayTemp?.toFixed(1)}°</Text>
                        </Group>
                        {/* Air Temp Trend */}
                        <Group gap={6}>
                            <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>AIR</Text>
                            <Sparkline data={sim.history?.temp || []} color="#fab005" min={10} max={30} width={60} height={15} />
                            <Text size="xs" c="#fab005" fw={700} style={{ fontSize: 10 }}>{sim.env.airTemp.toFixed(1)}°</Text>
                        </Group>
                        {/* EC Trend */}
                        <Group gap={6}>
                            <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>EC</Text>
                            <Sparkline data={sim.history?.ec || []} color="#22b8cf" min={0} max={3} width={40} height={15} />
                            <Text size="xs" c="#22b8cf" fw={700} style={{ fontSize: 10 }}>{physics.ec?.toFixed(2)}</Text>
                        </Group>
                        {/* pH Trend */}
                        <Group gap={6}>
                            <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>pH</Text>
                            <Sparkline data={sim.history?.ph || []} color="#82c91e" min={4} max={8} width={40} height={15} />
                            <Text size="xs" c="#82c91e" fw={700} style={{ fontSize: 10 }}>{physics.realPh?.toFixed(1)}</Text>
                        </Group>
                    </Group>
                </Paper>

                {(physics.tankLevel < 20) && (
                    <Button size="xs" color="red" variant="filled" leftSection={<AlertTriangle size={14} />} onClick={() => sim.triggerHardReset()}>RESET SYSTEM</Button>
                )}
            </Stack>

            <style dangerouslySetInnerHTML={{
                __html: `
                /* FLOW ANIMATIONS */
                @keyframes flowRight {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 0; }
                }
                @keyframes flowUp {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 40px; }
                }
                .flow-animation-h { animation: flowRight 0.5s linear infinite; }
                .flow-animation-v { animation: flowUp 0.5s linear infinite; }
                .pulsate { animation: pulse 1.0s infinite; }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}} />
        </Paper>
    );
};
