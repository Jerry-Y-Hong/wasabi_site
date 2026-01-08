"use client";

import React from 'react';
import { Container, Title, Text, SimpleGrid, ThemeIcon, Paper, List, Badge, Group, Button, Overlay, Grid } from '@mantine/core';
import { Magnet, Zap, Sprout, Droplet, ArrowRight, Activity, Microscope, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

import { useTranslation } from '@/lib/i18n';

export default function MagneticTechPage() {
    const { t } = useTranslation();

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'Inter, sans-serif' }}>
            {/* HER0 SECTION */}
            <div style={{ position: 'relative', height: '60vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, #2b1d3d 0%, #0a0a0a 70%)',
                    zIndex: 0
                }}></div>
                {/* Magnetic Wave Animation (CSS) */}
                <div className="magnetic-waves">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `${300 + i * 150}px`, height: `${300 + i * 150}px`,
                            border: '1px solid rgba(130, 201, 30, 0.1)',
                            borderRadius: '50%',
                            animation: `pulse-wave ${4 + i}s infinite ease-in-out`
                        }}></div>
                    ))}
                </div>

                <Container size="lg" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <Badge size="lg" variant="outline" color="lime" mb="md">K-FARM CORE TECHNOLOGY</Badge>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <Title c="white" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>
                            The Physics of Growth:<br />
                            <span style={{ color: '#82c91e', textShadow: '0 0 40px rgba(130,201,30,0.5)' }}>Magnetic Stimulation</span>
                        </Title>
                    </motion.div>
                    <Text c="dimmed" size="xl" mt="lg" maw={600} mx="auto">
                        {t('mag_desc')}
                    </Text>
                </Container>
            </div>

            {/* KEY MECHANISMS GRID */}
            <Container size="xl" py={80}>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
                    <TechCard
                        icon={<Sprout size={32} />}
                        title={t('mag_card1_title')}
                        color="lime"
                        delay={0.1}
                    >
                        <List spacing="sm" size="sm" center icon={<ThemeIcon color="lime" size={16} radius="xl"><ArrowRight size={10} /></ThemeIcon>}>
                            <List.Item>{t('mag_card1_item1')}</List.Item>
                            <List.Item>{t('mag_card1_item2')}</List.Item>
                        </List>
                    </TechCard>

                    <TechCard
                        icon={<Droplet size={32} />}
                        title={t('mag_card2_title')}
                        color="cyan"
                        delay={0.2}
                    >
                        <List spacing="sm" size="sm" center icon={<ThemeIcon color="cyan" size={16} radius="xl"><ArrowRight size={10} /></ThemeIcon>}>
                            <List.Item>{t('mag_card2_item1')}</List.Item>
                            <List.Item>{t('mag_card2_item2')}</List.Item>
                        </List>
                    </TechCard>

                    <TechCard
                        icon={<BrainCircuit size={32} />}
                        title={t('mag_card3_title')}
                        color="grape"
                        delay={0.3}
                    >
                        <List spacing="sm" size="sm" center icon={<ThemeIcon color="grape" size={16} radius="xl"><ArrowRight size={10} /></ThemeIcon>}>
                            <List.Item>{t('mag_card3_item1')}</List.Item>
                            <List.Item>{t('mag_card3_item2')}</List.Item>
                        </List>
                    </TechCard>

                    <TechCard
                        icon={<Activity size={32} />}
                        title={t('mag_card4_title')}
                        color="red"
                        delay={0.4}
                    >
                        <List spacing="sm" size="sm" center icon={<ThemeIcon color="red" size={16} radius="xl"><ArrowRight size={10} /></ThemeIcon>}>
                            <List.Item>{t('mag_card4_item1')}</List.Item>
                            <List.Item>{t('mag_card4_item2')}</List.Item>
                        </List>
                    </TechCard>
                </SimpleGrid>
            </Container>

            {/* DEEP DIVE SECTION */}
            <div style={{ background: '#111', padding: '100px 0' }}>
                <Container size="lg">
                    <Grid gutter={50}>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Title order={2} c="white" mb="md">{t('mag_why_title')}</Title>
                            <Text c="dimmed" mb="xl">
                                {t('mag_why_desc')}
                            </Text>
                            <div style={{ padding: 20, borderLeft: '4px solid #82c91e', background: 'rgba(130,201,30,0.1)' }}>
                                <Text size="sm" fs="italic" c="white">
                                    "{t('mag_quote')}"
                                </Text>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Paper radius="md" p="xl" bg="#0a0a0a" withBorder style={{ borderColor: '#333', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg, transparent 0deg, #82c91e20 360deg)', animation: 'spin-slow 10s linear infinite' }}></div>
                                <Magnet size={64} color="#82c91e" style={{ zIndex: 1 }} />
                                <Title order={3} mt="md" c="white" style={{ zIndex: 1 }}>1,500 Gauss</Title>
                                <Text size="sm" c="dimmed" style={{ zIndex: 1 }}>{t('mag_optimal')}</Text>
                            </Paper>
                        </Grid.Col>
                    </Grid>
                </Container>
            </div>

            <style jsx global>{`
                @keyframes pulse-wave {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    50% { opacity: 0.3; }
                    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// Sub-component for clean code
function TechCard({ icon, title, children, color, delay }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.5 }}>
            <Paper p="xl" radius="lg" bg="#1A1B1E" withBorder style={{ borderColor: '#2C2E33', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: 20, opacity: 0.1 }}>
                    <ThemeIcon size={80} color={color} variant="transparent">{icon}</ThemeIcon>
                </div>
                <Group mb="lg">
                    <ThemeIcon size="xl" radius="md" color={color} variant="light">
                        {icon}
                    </ThemeIcon>
                    <Title order={3} c="white" style={{ fontSize: '1.25rem' }}>{title}</Title>
                </Group>
                {children}
            </Paper>
        </motion.div>
    );
}
