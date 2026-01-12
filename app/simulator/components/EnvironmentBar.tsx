import React from 'react';
import { Paper, Group, Text, Divider, Tooltip, ActionIcon, rem } from '@mantine/core';
import { Sun, Thermometer, Cloudy, Wind, RefreshCw, ThermometerSnowflake, Flame, Activity } from 'lucide-react';

interface EnvironmentBarProps {
    sim: any;
    physics: any;
    intent: any;
}

export const EnvironmentBar = ({ sim, physics, intent }: EnvironmentBarProps) => {
    return (
        <Paper p="xs" radius="xl" bg="#1A1B1E" style={{ border: '1px solid #2C2E33', marginBottom: 15, width: 'fit-content', margin: '0 auto 15px auto' }}>
            <Group gap={20} px={10}>
                {/* Header Icon */}
                <Group gap={6}>
                    <Activity size={12} className="pulsate" color="#228be6" />
                    <Text size={rem(10)} fw={700} c="dimmed" style={{ letterSpacing: 1 }}>ENV</Text>
                </Group>

                <Divider orientation="vertical" style={{ height: 15 }} />

                {/* 1. OUTSIDE */}
                <Group gap={6}>
                    <Sun size={14} color="#fab005" />
                    <Text size={rem(11)} fw={700} c="orange">{sim.env.externalTemp.toFixed(1)}°</Text>
                </Group>

                <Divider orientation="vertical" style={{ height: 15 }} />

                {/* 2. AIR (HVAC) */}
                <Group gap={10}>
                    <Group gap={4}>
                        <Thermometer size={14} color="#fa5252" />
                        <Tooltip label="Target: 20-22°C" withArrow>
                            <Text size={rem(11)} fw={700} c="white" style={{ cursor: 'help' }}>{sim.env.airTemp.toFixed(1)}°</Text>
                        </Tooltip>
                    </Group>
                    <Group gap={4}>
                        <Cloudy size={14} color="#228be6" />
                        <Tooltip label={sim.hvac.fan_exh ? "Status: Ventilating (High Humidity)" : "Target: < 70%"} withArrow>
                            <Text size={rem(11)} fw={700} c={sim.hvac.fan_exh ? "#339af0" : "cyan"} style={{ cursor: 'help' }}>
                                {sim.env.airHum.toFixed(1)}%
                            </Text>
                        </Tooltip>
                    </Group>
                    <Group gap={2}>
                        <Tooltip label="Exhaust Fan (Ventilation)" withArrow>
                            <ActionIcon size="xs" variant={sim.hvac.fan_exh ? "filled" : "subtle"} color="blue" onClick={() => sim.toggleHvac('fan_exh')}><Wind size={10} /></ActionIcon>
                        </Tooltip>
                        <Tooltip label="Circulation Fan (Air Mix)" withArrow>
                            <ActionIcon size="xs" variant={sim.hvac.fan_circ ? "filled" : "subtle"} color="green" onClick={() => sim.toggleHvac('fan_circ')}><RefreshCw size={10} /></ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                <Divider orientation="vertical" style={{ height: 15 }} />

                {/* 3. WATER TEMP */}
                <Group gap={8}>
                    <Tooltip label={`Target: ${sim.targets.temp.toFixed(1)}°C`} withArrow>
                        <Text size={rem(11)} fw={700} c={intent.chiller ? "#339af0" : (intent.heater ? "#ff6b6b" : "cyan")} style={{ cursor: 'help' }}>
                            Water: {physics.displayTemp?.toFixed(1)}°C
                        </Text>
                    </Tooltip>
                    <Group gap={2}>
                        <ActionIcon size="xs" variant={intent.chiller ? "filled" : "subtle"} color="blue" onClick={() => sim.toggleActuator('chiller')}><ThermometerSnowflake size={10} /></ActionIcon>
                        <ActionIcon size="xs" variant={intent.heater ? "filled" : "subtle"} color="red" onClick={() => sim.toggleActuator('heater')}><Flame size={10} /></ActionIcon>
                    </Group>
                </Group>
            </Group>
        </Paper>
    );
};
