import React from 'react';
import { Box, Text, Group } from '@mantine/core';

interface LogoProps {
    size?: number;
    withText?: boolean;
}

export function Logo({ size = 40, withText = true }: LogoProps) {
    return (
        <Group gap={10} align="center" wrap="nowrap">
            <Box style={{ width: size, height: size, position: 'relative' }}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Circular Background */}
                    <circle cx="50" cy="50" r="48" fill="#002b1f" stroke="#2f9e44" strokeWidth="2" />

                    {/* Stylized Wasabi Leaf */}
                    <path
                        d="M50 20 C65 20 78 35 78 55 C78 75 50 85 50 85 C50 85 22 75 22 55 C22 35 35 20 50 20 Z"
                        fill="url(#leafGradient)"
                    />

                    {/* Circuit Board Traces (Internal veins) */}
                    <path
                        d="M50 30 V80 M40 45 L50 40 L60 45 M35 60 L50 55 L65 60 M45 72 L50 70 L55 72"
                        stroke="#c0eb75"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeOpacity="0.8"
                    />

                    {/* Microchips nodes */}
                    <circle cx="50" cy="40" r="2" fill="#fff" />
                    <circle cx="40" cy="45" r="1.5" fill="#fff" />
                    <circle cx="60" cy="45" r="1.5" fill="#fff" />
                    <circle cx="35" cy="60" r="1.5" fill="#fff" />
                    <circle cx="65" cy="60" r="1.5" fill="#fff" />

                    <defs>
                        <linearGradient id="leafGradient" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2f9e44" />
                            <stop offset="1" stopColor="#b2d302" />
                        </linearGradient>
                    </defs>
                </svg>
            </Box>
            {withText && (
                <Box>
                    <Text
                        size="md"
                        fw={900}
                        style={{
                            lineHeight: 1,
                            color: '#fff',
                            letterSpacing: '-0.5px',
                            fontSize: size * 0.35,
                            textTransform: 'uppercase'
                        }}
                    >
                        K-Farm
                    </Text>
                    <Text
                        size="xs"
                        fw={500}
                        style={{
                            lineHeight: 1,
                            color: '#2f9e44',
                            fontSize: size * 0.2,
                            marginTop: '2px',
                            letterSpacing: '1px'
                        }}
                    >
                        Group
                    </Text>
                </Box>
            )}
        </Group>
    );
}
