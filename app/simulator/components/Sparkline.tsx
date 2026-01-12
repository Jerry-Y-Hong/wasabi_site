import React from 'react';
import { Box } from '@mantine/core';

export const Sparkline = ({ data = [], color, width = 60, height = 20, min, max }: any) => {
    if (!data || data.length === 0) {
        return <Box w={width} h={height} bg="rgba(255,255,255,0.05)" style={{ borderRadius: 2 }} />;
    }

    // Ensure we don't break with short arrays, slice last 40 points
    const points = data.slice(-40).map((d: number, i: number) => {
        const x = (i / 39) * width;
        const norm = (d - min) / (max - min);
        // Invert Y because SVG origin is top-left
        const y = height - (Math.min(1, Math.max(0, norm)) * height);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            {/* Gradient Fill Area */}
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline points={`${0},${height} ${points} ${width},${height}`} fill={`url(#grad-${color.replace('#', '')})`} stroke="none" />

            {/* Main Line */}
            <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
