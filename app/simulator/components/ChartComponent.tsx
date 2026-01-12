
import React from 'react';
import { Paper, Group, Text, Center } from '@mantine/core';

export const LiveTrendChart = ({ data, keys, colors, min, max, title, unit }: any) => {
    // [FIX] Ensure data is an array
    const rawData = Array.isArray(data) ? data : [];
    // [FIX] If only 1 data point, duplicate it to draw a flat line instead of nothing
    const safeData = rawData.length === 1 ? [rawData[0], rawData[0]] : rawData;
    const hasData = safeData.length > 1;

    const width = 100;
    const height = 40;

    // [FIX] NaN protection
    const getY = (val: any) => {
        const v = typeof val === 'number' && !isNaN(val) ? val : min;
        return height - (Math.max(0, Math.min(1, (v - min) / (max - min))) * height);
    };

    return (
        <Paper p="sm" bg="#1A1B1E" radius="md" withBorder style={{ borderColor: '#373A40' }}>
            <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" fw={700}>{title}</Text>
                <Group gap="xs">
                    {keys.map((k: any, i: number) => {
                        const lastItem = safeData[safeData.length - 1];
                        const val = lastItem ? lastItem[k] : undefined;
                        return (
                            <Text key={k} size="xs" c={colors[i]} fw={700}>
                                {typeof val === 'number' ? val.toFixed(1) : '-'}{unit}
                            </Text>
                        );
                    })}
                </Group>
            </Group>
            <div style={{ position: 'relative', height: '60px', width: '100%' }}>
                {!hasData && (
                    <Center style={{ position: 'absolute', inset: 0 }}>
                        <Text size="xs" c="dimmed">Waiting for data...</Text>
                    </Center>
                )}
                <svg viewBox={`0 0 ${width} ${height} `} style={{ width: '100%', height: '100%', overflow: 'visible', opacity: hasData ? 1 : 0.2 }}>
                    <line x1="0" y1="0" x2={width} y2="0" stroke="#333" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#333" strokeWidth="0.5" />
                    <line x1="0" y1={height} x2={width} y2={height} stroke="#333" strokeWidth="0.5" />

                    {hasData && keys.map((k: string, idx: number) => (
                        <polyline
                            key={k}
                            points={safeData.map((d: any, i: number) => {
                                const y = getY(d[k]);
                                const x = (i / (safeData.length - 1)) * width;
                                return `${x},${y} `;
                            }).join(" ")}
                            fill="none"
                            stroke={colors[idx]}
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            </div>
        </Paper>
    );
};
