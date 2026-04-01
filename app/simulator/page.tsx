'use client';

import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Center, Stack, Badge, Loader, Box, Group } from '@mantine/core';
import { useTranslation } from '@/lib/i18n';
import { IconCpu, Icon3dCubeSphere, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function SimulatorPage() {
    const { t } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatches completely by returning null on first server render if needed
    // but typically standard Mantine components are fine. We use isMounted just in case.
    if (!isMounted) {
        return (
            <Box style={{ backgroundColor: '#000', minHeight: '100vh', width: '100%' }}>
                <Center style={{ height: '100vh' }}>
                    <Loader color="wasabi" type="bars" />
                </Center>
            </Box>
        );
    }

    return (
        <Box style={{ backgroundColor: '#000', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
            <Container size="xl" py="xl">
                <Box mb={40}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Group gap="xs" style={{ color: 'var(--mantine-color-gray-5)' }}>
                            <IconArrowLeft size={16} />
                            <Text size="sm">{t('back_to_home', '메인화면으로 돌아가기')}</Text>
                        </Group>
                    </Link>
                </Box>

                <Center style={{ height: '60vh' }}>
                    <Stack align="center" gap="xl">
                        <Box style={{ 
                            animation: 'spin 20s linear infinite', 
                            display: 'flex', 
                            justifyContent: 'center' 
                        }}>
                            <Icon3dCubeSphere size={100} color="var(--mantine-color-wasabi-5)" stroke={1} />
                        </Box>
                        
                        <style>{`
                            @keyframes spin { 100% { transform: rotate(360deg); } }
                        `}</style>

                        <Stack align="center" gap="xs">
                            <Badge color="wasabi" variant="light" size="lg" leftSection={<IconCpu size={14} />}>
                                {t('simulator_status', '3D 엔진 로딩 중...')}
                            </Badge>
                            
                            <Title order={1} style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 900, textAlign: 'center' }}>
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
                </Center>
            </Container>
        </Box>
    );
}
