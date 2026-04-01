'use client';

import {
    Container, Title, Text, Stepper, Button, Group,
    Paper, Image, Stack, List, ThemeIcon, Box, Grid, Badge,
    Divider, Center
} from '@mantine/core';
import {
    IconCheck, IconSettings, IconPackage, IconLayoutGrid,
    IconChevronRight, IconChevronLeft, IconStack2, IconBolt,
    IconBrightnessUp, IconArrowLeft, IconDatabase, IconTool
} from '@tabler/icons-react';
import { useState } from 'react';
import Link from 'next/link';

// SVG Illustration Components
const RacewayIllustration = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="10" width="50" height="100" rx="4" fill="#2C2E33" />
        <rect x="45" y="10" width="30" height="100" fill="#141517" />
        <path d="M60 10V110" stroke="#51cf66" strokeWidth="4" strokeDasharray="10 5" />
        <circle cx="60" cy="30" r="3" fill="#51cf66" />
        <circle cx="60" cy="60" r="3" fill="#51cf66" />
        <circle cx="60" cy="90" r="3" fill="#51cf66" />
        <rect x="30" y="45" width="10" height="30" rx="2" fill="#373A40" />
        <rect x="80" y="45" width="10" height="30" rx="2" fill="#373A40" />
    </svg>
);

const SlideTrayIllustration = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="40" width="80" height="60" rx="4" fill="#2C2E33" />
        <rect x="25" y="45" width="70" height="50" rx="2" fill="#141517" />
        <g>
            <rect x="30" y="70" width="60" height="40" rx="2" fill="#373A40" stroke="#51cf66" strokeWidth="2" />
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 15" dur="2s" repeatCount="indefinite" />
        </g>
        <rect x="45" y="85" width="30" height="4" rx="2" fill="#51cf66" />
    </svg>
);

const WirelessStackingIllustration = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="70" width="60" height="40" rx="4" fill="#2C2E33" />
        <g>
            <rect x="30" y="20" width="60" height="40" rx="4" fill="#373A40" stroke="#51cf66" strokeWidth="2" />
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 10" dur="1.5s" repeatCount="indefinite" />
        </g>
        <circle cx="45" cy="65" r="3" fill="#FCC419" />
        <circle cx="75" cy="65" r="3" fill="#FCC419" />
        <path d="M45 60V30" stroke="#FCC419" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M75 60V30" stroke="#FCC419" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
);

import { useTranslation } from '@/lib/i18n';

export default function AssemblyManualPage() {
    const { t } = useTranslation();
    const [active, setActive] = useState(0);

    const BASE_H = 550;
    const GROW_H = 500;
    const CROWN_H = 100; // Increased from 50mm to 100mm for Control PCB
    const WIDTH = 600;

    const steps = [
        {
            label: t('as_step1_label'),
            description: t('as_step1_desc'),
            title: t('as_step1_title'),
            content: t('as_step1_content'),
            items: [
                t('as_step1_item1'),
                t('as_step1_item2'),
                t('as_step1_item3')
            ],
            image: '/images/assembly/step1_v8.png'
        },
        {
            label: t('as_step2_label'),
            description: t('as_step2_desc'),
            title: t('as_step2_title'),
            content: t('as_step2_content'),
            items: [
                t('as_step2_item1'),
                t('as_step2_item2'),
                t('as_step2_item3')
            ],
            image: '/images/assembly/step2_v8.png'
        },
        {
            label: t('as_step3_label'),
            description: t('as_step3_desc'),
            title: t('as_step3_title'),
            content: t('as_step3_content'),
            items: [
                t('as_step3_item1'),
                t('as_step3_item2'),
                t('as_step3_item3')
            ],
            image: '/images/assembly/step3_v8.png'
        },
        {
            label: t('as_step4_label'),
            description: t('as_step4_desc'),
            title: t('as_step4_title'),
            content: t('as_step4_content'),
            items: [
                t('as_step4_item1'),
                t('as_step4_item2'),
                t('as_step4_item3')
            ],
            image: '/images/assembly/step4_v8.png'
        },
        {
            label: t('as_step5_label'),
            description: t('as_step5_desc'),
            title: t('as_step5_title'),
            content: t('as_step5_content'),
            items: [
                t('as_step5_item1'),
                t('as_step5_item2'),
                t('as_step5_item3')
            ],
            image: '/images/assembly/step5_v8.png'
        }
    ];

    return (
        <Container size="xl" py={60}>
            <Group justify="space-between" mb={40}>
                <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<IconArrowLeft size={16} />}
                    component={Link}
                    href="/tech/smartfarm/modular"
                >
                    {t('as_back')}
                </Button>
                <Badge size="xl" variant="dot" color="wasabi.6">{t('as_badge')}</Badge>
            </Group>

            <Stack gap="xs" mb={50}>
                <Title order={1} style={{ fontSize: '3rem', fontWeight: 900 }}>
                    {t('as_title_main')} <span style={{ color: 'var(--mantine-color-wasabi-6)' }}>{t('as_title_sub')}</span>
                </Title>
                <Text size="xl" c="dimmed">
                    {t('as_desc')}
                </Text>
                <Group mt="md">
                </Group>
            </Stack>

            <Stepper active={active} onStepClick={setActive} color="wasabi.6" size="md">
                {steps.map((step, index) => (
                    <Stepper.Step
                        key={index}
                        label={step.label}
                        description={step.description}
                        icon={index === 0 ? <IconPackage size={18} /> : index === 1 ? <IconSettings size={18} /> : index === 2 ? <IconStack2 size={18} /> : <IconBrightnessUp size={18} />}
                    >
                        <Box mt={40}>
                            <Grid gutter={50}>
                                <Grid.Col span={{ base: 12, md: 7 }}>
                                    <Paper shadow="xl" radius="lg" style={{ overflow: 'hidden' }}>
                                        <Image src={step.image} alt={step.title} style={{ transition: 'transform 0.5s ease' }} />
                                    </Paper>
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 5 }}>
                                    <Stack gap="xl">
                                        <Box>
                                            <Text c="wasabi.6" fw={700} tt="uppercase" mb="xs">Step {index + 1}</Text>
                                            <Title order={2} mb="md">{step.title}</Title>
                                            <Text size="lg" mb="xl" style={{ lineHeight: 1.6 }}>{step.content}</Text>
                                        </Box>

                                        <List
                                            spacing="md"
                                            size="md"
                                            center
                                            icon={
                                                <ThemeIcon color="wasabi.6" size={24} radius="xl">
                                                    <IconCheck size={16} />
                                                </ThemeIcon>
                                            }
                                        >
                                            {step.items.map((item, i) => (
                                                <List.Item key={i}>{item}</List.Item>
                                            ))}
                                        </List>

                                        {/* The following Box element was part of the instruction but seems to be for a different component or context.
                                            It contains `colIdx` which is not defined here.
                                            If it was intended to be a general description for the "Brain" step, it should be adapted.
                                            For now, it's omitted to maintain syntactical correctness.
                                            <Box
                                                style={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    left: 10,
                                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                                    padding: '4px 8px',
                                                    borderRadius: 4,
                                                    color: '#51cf66',
                                                    fontSize: 8,
                                                    zIndex: 10,
                                                    flexDirection: 'column',
                                                    gap: 4
                                                }}
                                            >
                                                <Text size="10" fw={700} style={{ letterSpacing: 0.5 }}>UNIT {colIdx + 1} BRAIN</Text>
                                                <Badge size="xs" variant="outline" color="wasabi.4">Control PCB inside</Badge>
                                            </Box>
                                        */}

                                        <Group mt="xl">
                                            <Button
                                                size="lg"
                                                color="wasabi.6"
                                                onClick={() => setActive((current) => (current < 4 ? current + 1 : current))}
                                            >
                                                {index === 4 ? t('as_btn_done') : t('as_btn_next')}
                                            </Button>
                                        </Group>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Stepper.Step>
                ))}
            </Stepper>

            {/* Engineering Highlights Section */}
            <Box mt={100} py={80} style={{ borderTop: '2px solid var(--mantine-color-gray-1)', backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '24px 24px 0 0' }}>
                <Container size="xl">
                    <Stack align="center" mb={60}>
                        <Badge size="xl" variant="filled" color="wasabi.6">{t('as_eng_badge')}</Badge>
                        <Title order={2} ta="center">{t('as_eng_title')}</Title>
                        <Text c="dimmed" ta="center" maw={600}>
                            {t('as_eng_desc')}
                        </Text>
                    </Stack>

                    <Grid gutter={40}>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Paper p="xl" radius="lg" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box mb="lg">
                                    <RacewayIllustration />
                                </Box>
                                <Stack align="center" gap="md">
                                    <Title order={4} ta="center">{t('as_h1_title')}</Title>
                                    <Text ta="center" size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                        {t('as_h1_desc').split('<b>').map((part: string, i: number) => {
                                            if (part.includes('</b>')) {
                                                const [bold, normal] = part.split('</b>');
                                                return <span key={i}><b>{bold}</b>{normal}</span>;
                                            }
                                            return part;
                                        })}
                                    </Text>
                                </Stack>
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Paper p="xl" radius="lg" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box mb="lg">
                                    <SlideTrayIllustration />
                                </Box>
                                <Stack align="center" gap="md">
                                    <Title order={4} ta="center">{t('as_h2_title')}</Title>
                                    <Text ta="center" size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                        {t('as_h2_desc').split('<b>').map((part: string, i: number) => {
                                            if (part.includes('</b>')) {
                                                const [bold, normal] = part.split('</b>');
                                                return <span key={i}><b>{bold}</b>{normal}</span>;
                                            }
                                            return part;
                                        })}
                                    </Text>
                                </Stack>
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Paper p="xl" radius="lg" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box mb="lg">
                                    <WirelessStackingIllustration />
                                </Box>
                                <Stack align="center" gap="md">
                                    <Title order={4} ta="center">{t('as_h3_title')}</Title>
                                    <Text ta="center" size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                        {t('as_h3_desc').split('<b>').map((part: string, i: number) => {
                                            if (part.includes('</b>')) {
                                                const [bold, normal] = part.split('</b>');
                                                return <span key={i}><b>{bold}</b>{normal}</span>;
                                            }
                                            return part;
                                        })}
                                    </Text>
                                </Stack>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    <Center mt={80}>
                        <Stack align="center" gap="sm">
                            <Text fw={700}>{t('as_srv_title')}</Text>
                            <Text c="dimmed">{t('as_srv_desc')}</Text>
                            <Group mt="md">
                                <Button variant="light" color="gray">{t('as_srv_btn_pdf')}</Button>
                                <Button variant="filled" color="wasabi.6">{t('as_srv_btn_tech')}</Button>
                            </Group>
                        </Stack>
                    </Center>
                </Container>
            </Box>
        </Container>
    );
}

