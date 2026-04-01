'use client';

import React from 'react';
import { Container, Title, Text, Center, Stack, Badge, Loader, Box, Group } from '@mantine/core';
import { useTranslation } from '@/lib/i18n';
import { IconCpu, Icon3dCubeSphere, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SimulatorPage() {
    const { t } = useTranslation();

    return (
        <Box style={{ backgroundColor: '#000', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
            <Container size="xl" py="xl">
                <Link href="/" style={{ textDecoration: 'none', color: 'var(--mantine-color-gray-5)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
                    <IconArrowLeft size={16} />
                    <Text size="sm">{t('back_to_home', '메인화면으로')}</Text>
                </Link>

                <Center style={{ height: '70vh' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <Stack align="center" gap="xl">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                            >
                                <Icon3dCubeSphere size={100} color="var(--mantine-color-wasabi-5)" stroke={1} />
                            </motion.div>

                            <Stack align="center" gap="xs">
                                <Badge color="wasabi" variant="light" size="lg" leftSection={<IconCpu size={14} />}>
                                    {t('simulator_status', '3D 엔진 로딩 중...')}
                                </Badge>
                                
                                <Title order={1} style={{ color: '#fff', fontSize: '3rem', fontWeight: 900, textAlign: 'center' }}>
                                    {t('simulator_title', '케이팜 3D 스마트 모듈 시뮬레이터')}
                                </Title>
                                
                                <Text size="lg" c="dimmed" style={{ maxWidth: 600, textAlign: 'center', marginTop: 10 }}>
                                    {t('simulator_desc', 'V3 아키텍처에 맞춘 최신 3D 렌더링 환경을 준비하고 있습니다. 그래픽 리소스 초기화를 위해 잠시만 기다려 주세요.')}
                                </Text>
                            </Stack>

                            <Group mt="xl" gap="md">
                                <Loader color="wasabi" type="bars" />
                                <Text size="sm" c="wasabi.4" fw={700}>
                                    ENGINE INITIALIZING...
                                </Text>
                            </Group>
                        </Stack>
                    </motion.div>
                </Center>
            </Container>
        </Box>
    );
}
