
import React from 'react';
import { Paper, Group, Stack, Badge, Button, Text, SimpleGrid, ThemeIcon, Slider, rem, ActionIcon } from '@mantine/core';
import { Droplet, Zap, Magnet, Wind, AlertTriangle, Fan, Activity } from 'lucide-react';
import { TierData } from '../types';

export const RecyclingPanel = ({ sim }: any) => {
    const rec = sim.recycling || {};
    const act = sim.actuators || {};

    const isSandClogged = (rec.filterPressureIn - rec.filterPressureOut) > 1.2;
    const isCarbonClogged = (rec.carbonPressureIn - rec.carbonPressureOut) > 0.8;
    const isSandWashing = !!act.autoValveSand;
    const isCarbonWashing = !!act.autoValveCarbon;

    const StatusRow = ({ label, isWashing, isClogged, val1, val2 }: any) => (
        <Group justify="space-between" mb={4}>
            <Group gap={4}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isWashing ? '#fcc419' : isClogged ? '#fa5252' : '#40c057' }} />
                <Text size="xs" c="dimmed">{label}</Text>
            </Group>
            {isWashing ? <Text size="xs" c="yellow" fw={700}>WASHING</Text> :
                isClogged ? <Text size="xs" c="red" fw={700}>CLOGGED</Text> :
                    <Text size="xs" c="dimmed" style={{ fontSize: 9 }}>{val1.toFixed(1)}/{val2.toFixed(1)}bar</Text>
            }
        </Group>
    );

    return (
        <Paper p="xs" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40', height: '100%' }}>
            <Group justify="space-between" mb="xs">
                <Group gap={4}>
                    <ThemeIcon size="xs" color="blue" variant="transparent"><Droplet size={14} /></ThemeIcon>
                    <Text fw={600} size="sm" c="white">WATER CYCLE</Text>
                </Group>
                <Text size="xs" c="dimmed">{Math.floor(sim.env.time)}:{(Math.floor((sim.env.time % 1) * 60)).toString().padStart(2, '0')}</Text>
            </Group>

            <Paper p="xs" bg="#141517" radius="md" mb="xs">
                <Text size="xs" c="dimmed" fw={600} mb={4}>FILTRATION</Text>
                <StatusRow label="Sand Filter" isWashing={isSandWashing} isClogged={isSandClogged} val1={rec.filterPressureIn} val2={rec.filterPressureOut} />
                <StatusRow label="Carbon Filter" isWashing={isCarbonWashing} isClogged={isCarbonClogged} val1={rec.carbonPressureIn} val2={rec.carbonPressureOut} />
            </Paper>

            <SimpleGrid cols={2} spacing={4}>
                <Button fullWidth size="compact-xs"
                    color="grape" variant="light"
                    leftSection={<Zap size={10} />}
                    style={{ justifyContent: 'space-between' }}
                >
                    UV 99%
                </Button>
                <Button fullWidth size="compact-xs"
                    color={rec.magneticMode ? "lime" : "gray"}
                    variant={rec.magneticMode ? "light" : "outline"}
                    onClick={sim.toggleMagnetic}
                    leftSection={<Magnet size={10} />}
                >
                    {rec.magneticMode ? "MAG ON" : "MAG OFF"}
                </Button>
            </SimpleGrid>
        </Paper>
    );
};

export const AeroponicPanel = ({ sim }: any) => {
    const activeRack = sim.aeroponics.activeRack;
    const statusText = sim.aeroponics.activeRack !== null ? `SPRAYING Z${activeRack + 1}` : `PRESSURIZING`;

    return (
        <Paper p="xs" bg="#1A1B1E" radius="lg" withBorder style={{ borderColor: '#373A40', height: '100%' }}>
            <Group justify="space-between" mb="xs">
                <Group gap={4}>
                    <ThemeIcon size="xs" color="cyan" variant="transparent"><Wind size={14} /></ThemeIcon>
                    <Text fw={600} size="sm" c="white">AEROPONICS</Text>
                </Group>
                <Badge size="xs" variant="outline" color={activeRack !== null ? "cyan" : "gray"}>{statusText}</Badge>
            </Group>

            <Group gap={4} mb="sm" justify="center">
                {[0, 1, 2, 3, 4].map(idx => (
                    <div key={idx} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: activeRack === idx ? '#22b8cf' : '#333',
                        transition: 'all 0.2s'
                    }} />
                ))}
            </Group>

            <Group grow align="flex-start">
                <Stack gap={0}>
                    <Text size="xs" c="dimmed">Metering Pres.</Text>
                    <Text size="xl" fw={600} c="white" style={{ lineHeight: 1 }}>{sim.aeroponics.pressure.toFixed(1)} <span style={{ fontSize: 10, color: '#888' }}>bar</span></Text>
                </Stack>
                <Stack gap={4}>
                    <Group grow gap={4}>
                        <Button
                            size="compact-xs"
                            color={sim.actuators.supplyPumpMode === "A" ? (sim.actuators.supplyPump ? "green" : "teal") : "dark"}
                            variant={sim.actuators.supplyPumpMode === "A" ? "filled" : "default"}
                            onClick={() => sim.toggleActuator('supplyPumpMode')}
                        >
                            METERING A
                        </Button>
                        <Button
                            size="compact-xs"
                            color={sim.actuators.supplyPumpMode === "B" ? (sim.actuators.supplyPump ? "green" : "teal") : "dark"}
                            variant={sim.actuators.supplyPumpMode === "B" ? "filled" : "default"}
                            onClick={() => sim.toggleActuator('supplyPumpMode')}
                        >
                            METERING B
                        </Button>
                    </Group>
                    <Button
                        fullWidth size="compact-xs"
                        color={sim.actuators.mixingPump ? "grape" : "dark"}
                        variant={sim.actuators.mixingPump ? "filled" : "default"}
                        onClick={() => sim.toggleActuator('mixingPump')}
                        style={{ border: sim.actuators.mixingPump ? '1px solid #be4bdb' : '1px solid #333' }}
                    >
                        AGIT PUMP (MIXING) {sim.actuators.mixingPump ? "(ON)" : ""}
                    </Button>
                </Stack>
            </Group>
            <Group justify="space-between" mt="xs" align="center" gap="xs">
                <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>Rest Interval: <span style={{ color: 'white', fontWeight: 600 }}>{(sim.aeroponics.offDuration / 10).toFixed(0)}s</span></Text>
                <Slider style={{ flex: 1 }} size="xs" color="blue" min={10} max={120} step={5} value={sim.aeroponics.offDuration / 10} onChange={sim.setIntervalTime} label={null} />
            </Group>
        </Paper>
    );
};

export const TierMonitorRow = ({ sim, index, tier, isSpraying, lightPos, lightMode, lightSides }: any) => {
    if (!tier) return <div style={{ height: 34, background: '#222', borderRadius: 4 }}></div>;

    const isAuto = sim.autoMode;
    const tierLevel = index % 5;
    const colorA = '#ffd43b';
    const colorB = '#4dabf7';

    let isLitA = false;
    let isLitB = false;

    if (!lightMode || lightMode === "FIXED") {
        isLitA = true;
        if (lightSides === "DOUBLE") isLitB = true;
    } else {
        const distA = Math.abs(tierLevel - lightPos);
        if (Math.exp(-Math.pow(distA / 0.6, 2)) > 0.3) isLitA = true;

        if (lightSides === "DOUBLE") {
            const posB = 4.0 - lightPos;
            const distB = Math.abs(tierLevel - posB);
            if (Math.exp(-Math.pow(distB / 0.6, 2)) > 0.3) isLitB = true;
        }
    }

    const sideStyle = (isActive: boolean, color: string, isLeft: boolean) => {
        let borderRight = isLeft ? '1px solid #2C2E33' : 'none';
        let borderLeft = 'none';

        if (isActive) {
            if (isLeft) borderLeft = `3px solid ${color}`;
            else borderRight = `3px solid ${color}`;
        }

        return {
            flex: 1,
            height: '100%',
            background: isActive
                ? `linear-gradient(${isLeft ? '90deg' : '-90deg'}, ${color} 0%, ${color}4D 100%)`
                : '#141517',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' as any,
            transition: 'background 0.1s, box-shadow 0.1s',
            boxShadow: isActive ? `inset 0 0 30px ${color}80` : 'none',
            borderLeft: borderLeft,
            borderRight: borderRight
        };
    };

    return (
        <div style={{
            height: 38,
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #2C2E33',
            position: 'relative',
            background: '#101113'
        }}>
            <div style={sideStyle(isLitA, colorA, true)}></div>
            <div style={sideStyle(isLitB, colorB, false)}></div>

            {isSpraying && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, rgba(34, 184, 207, 0.2) 0%, rgba(34, 184, 207, 0.0) 50%, rgba(34, 184, 207, 0.2) 100%)',
                    zIndex: 1, pointerEvents: 'none'
                }} />
            )}

            {tier.pest && (
                <div style={{
                    position: 'absolute', inset: 0,
                    border: '2px dashed #fa5252',
                    zIndex: 5, pointerEvents: 'none',
                    animation: 'pulse 0.5s infinite',
                    boxShadow: 'inset 0 0 15px rgba(250, 82, 82, 0.4)'
                }} />
            )}

            {sim.lighting.isFiring && (index % 5 === Math.round(sim.lighting.pos)) && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(rgba(81, 207, 102, 0.4), rgba(81, 207, 102, 0.2))',
                    borderLeft: '4px solid #51cf66',
                    borderRight: '4px solid #51cf66',
                    zIndex: 6, pointerEvents: 'none',
                    boxShadow: '0 0 20px #51cf66'
                }} />
            )}

            <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 8px'
            }}>
                <Group gap={6}>
                    <Badge size="xs" color="dark" variant="filled" circle style={{ border: '1px solid #444' }}>
                        {tierLevel + 1}
                    </Badge>
                    <Stack gap={0}>
                        <Text size={rem(11)} fw={700} c="white" style={{ lineHeight: 1, textShadow: '0 1px 2px black' }}>{tier.temp.toFixed(1)}°</Text>
                        <Group gap={2}>
                            <Text size={rem(9)} c="dimmed" style={{ lineHeight: 1 }}>{tier.hum.toFixed(0)}%</Text>
                            {tier.pest && <Activity size={8} color="red" />}
                        </Group>
                    </Stack>
                </Group>

                <ActionIcon
                    size="sm"
                    variant={tier.fan ? "filled" : "subtle"}
                    color={tier.pest ? "red" : (tier.fan ? "cyan" : "gray")}
                    disabled={isAuto}
                    onClick={() => sim.toggleTierFan(index)}
                    style={{ opacity: isAuto ? 0.5 : 1 }}
                >
                    {tier.pest ? <AlertTriangle size={12} /> : <Fan size={12} className={tier.fan ? "spin-fast" : ""} />}
                </ActionIcon>
            </div>
        </div>
    );
};
