'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Paper, Text, Title, Group, Badge } from '@mantine/core';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface PipelineChartProps {
    data: { [key: string]: number };
}

export function PipelineStatusChart({ data }: PipelineChartProps) {
    // Transform object { New: 5, Contacted: 2 } -> Array [{ name: 'New', value: 5 }, ...]
    const chartData = Object.keys(data).map((key) => ({
        name: key,
        value: data[key],
    }));

    if (chartData.length === 0) {
        return (
            <Paper withBorder p="md" radius="md" h="100%">
                <Text c="dimmed" ta="center">No data available</Text>
            </Paper>
        );
    }

    return (
        <Paper withBorder p="md" radius="md" h={300}>
            <Title order={4} mb="md">Partner Pipeline Status</Title>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }: { name?: string, percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
}

// Bar Chart for Inquiry Categories
interface InquiryTypeChartProps {
    data: Record<string, number>;
}

export function InquiryTypeChart({ data }: InquiryTypeChartProps) {
    const chartData = Object.keys(data).map(key => ({
        name: key,
        value: data[key]
    }));

    // Custom colors for different categories
    const COLORS: Record<string, string> = {
        'Product Inquiry': '#40C057', // green
        'Partnership': '#228BE6',      // blue
        'Farm Visit': '#FAB005',       // yellow
        'Investment': '#BE4BDB',       // grape
        'Other': '#868E96',            // gray
        'Consulting': '#F06595'        // pink
    };

    return (
        <Paper withBorder p="md" radius="md" h={300}>
            <Title order={4} mb="md">Inquiry Source</Title>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#8884d8">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#228BE6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
}
