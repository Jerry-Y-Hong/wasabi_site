'use client';

import {
    Container, Title, Text, Button, Group,
    Paper, Stack, Box, Grid, Badge,
    Divider, Center, Slider, ActionIcon,
    Tooltip, List, ThemeIcon
} from '@mantine/core';
import {
    IconPlus, IconMinus, IconDoorEnter, IconDoorExit,
    IconArrowLeft, IconInfoCircle, IconBolt,
    IconDroplet, IconDeviceDesktop
} from '@tabler/icons-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ModularVisualizerPage() {
    const [moduleCount, setModuleCount] = useState(2);
    const [columnCount, setColumnCount] = useState(1);
    const [doorOpen, setDoorOpen] = useState(false);

    // Dimensions in mm
    const BASE_H = 550;
    const GROW_H = 500;
    const CROWN_H = 100; // Increased to 100mm for PCB & Hub
    const WIDTH = 600;

    // Scale factor for display
    const SCALE = 0.5;

    const totalHeight = BASE_H + (moduleCount * GROW_H) + CROWN_H;

    return (
        <Container size="xl" py={60}>
            <Group justify="space-between" mb={40}>
                <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<IconArrowLeft size={16} />}
                    component={Link}
                    href="/smartfarm/modular/assembly"
                >
                    매뉴얼로 돌아가기
                </Button>
                <Badge size="xl" variant="outline" color="wasabi.6">KF-MOD v4.0 INTERACTIVE MOCKUP</Badge>
            </Group>

            <Grid gutter={80}>
                {/* 1. 컨트롤 패널 */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Stack gap="xl">
                        <Box>
                            <Title order={1} mb="xs">아토믹 모듈러 <span style={{ color: 'var(--mantine-color-wasabi-6)' }}>시각화</span></Title>
                            <Text size="lg" c="dimmed">
                                550mm 높이의 전면 개폐형 허브와 500mm 적층 모듈의 실제 부피감을 인터랙티브하게 확인하세요.
                            </Text>
                        </Box>

                        <Paper withBorder p="xl" radius="md" shadow="sm">
                            <Stack gap="lg">
                                <Box>
                                    <Group justify="space-between" mb="sm">
                                        <Text fw={700}>재배 모듈 적층 수량: {moduleCount}단</Text>
                                        <Group gap="xs">
                                            <ActionIcon variant="light" color="gray" onClick={() => setModuleCount(Math.max(1, moduleCount - 1))}>
                                                <IconMinus size={16} />
                                            </ActionIcon>
                                            <ActionIcon variant="light" color="wasabi.6" onClick={() => setModuleCount(Math.min(5, moduleCount + 1))}>
                                                <IconPlus size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                    <Slider
                                        color="wasabi.6"
                                        label={null}
                                        value={moduleCount}
                                        onChange={setModuleCount}
                                        min={1}
                                        max={5}
                                    />
                                </Box>

                                <Box>
                                    <Group justify="space-between" mb="sm">
                                        <Text fw={700}>가로 확장 (열 수): {columnCount}열</Text>
                                        <Group gap="xs">
                                            <ActionIcon variant="light" color="gray" onClick={() => setColumnCount(Math.max(1, columnCount - 1))}>
                                                <IconMinus size={16} />
                                            </ActionIcon>
                                            <ActionIcon variant="light" color="blue.6" onClick={() => setColumnCount(Math.min(4, columnCount + 1))}>
                                                <IconPlus size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                    <Slider
                                        color="blue.6"
                                        label={null}
                                        value={columnCount}
                                        onChange={setColumnCount}
                                        min={1}
                                        max={4}
                                    />
                                </Box>

                                <Divider />

                                <Box>
                                    <Text fw={700} mb="sm">기기실 유지보수 (모든 마더 허브 도어)</Text>
                                    <Button
                                        fullWidth
                                        size="lg"
                                        variant={doorOpen ? "filled" : "outline"}
                                        color={doorOpen ? "wasabi.6" : "gray"}
                                        leftSection={doorOpen ? <IconDoorExit size={20} /> : <IconDoorEnter size={20} />}
                                        onClick={() => setDoorOpen(!doorOpen)}
                                    >
                                        {doorOpen ? "전면 유지보수 도어 닫기" : "전면 유지보수 도어 열기"}
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper p="xl" radius="md" bg="gray.0">
                            <Title order={4} mb="md">시스템 기술 사양 (Engineering Specs)</Title>
                            <List spacing="sm">
                                <List.Item icon={<ThemeIcon size={20} radius="xl" color="blue"><IconInfoCircle size={12} /></ThemeIcon>}>
                                    <b>마더 허브</b>: 600x600x550mm (전면 개폐형)
                                </List.Item>
                                <List.Item icon={<ThemeIcon size={20} radius="xl" color="green"><IconBolt size={12} /></ThemeIcon>}>
                                    <b>재배 모듈</b>: 600x600x500mm (독립 적층식)
                                </List.Item>
                                <List.Item icon={<ThemeIcon size={20} radius="xl" color="orange"><IconDroplet size={12} /></ThemeIcon>}>
                                    <b>내부 센서</b>: 초소형 배터리 무선 pH/EC (공간 최적화)
                                </List.Item>
                                <List.Item icon={<ThemeIcon size={20} radius="xl" color="grape"><IconDeviceDesktop size={12} /></ThemeIcon>}>
                                    <b>전체 높이</b>: {totalHeight} mm (현재 구성 기준)
                                </List.Item>
                            </List>
                        </Paper>
                    </Stack>
                </Grid.Col>

                {/* 2. 3D/2D 시각화 영역 */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Center style={{ height: '100%', minHeight: 600 }}>
                        <Box style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
                            {[...Array(columnCount)].map((_, colIdx) => (
                                <Box key={colIdx} style={{ position: 'relative', width: WIDTH * SCALE, height: totalHeight * SCALE }}>

                                    {/* Smart Crown (50mm) */}
                                    <Box
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100%',
                                            height: CROWN_H * SCALE,
                                            backgroundColor: '#1A1B1E',
                                            borderRadius: '4px 4px 0 0',
                                            borderBottom: '2px solid #2C2E33',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#51cf66',
                                            fontSize: 8,
                                            zIndex: 10,
                                            flexDirection: 'column',
                                            gap: 2
                                        }}
                                    >
                                        <Text size="10" fw={700} style={{ letterSpacing: 0.5 }}>UNIT {colIdx + 1} BRAIN</Text>
                                        <Text size="8" fw={500} c="wasabi.4">Control PCB / Hub</Text>
                                    </Box>

                                    {/* Grow Modules (500mm each) */}
                                    {[...Array(moduleCount)].map((_, i) => (
                                        <Box
                                            key={i}
                                            style={{
                                                position: 'absolute',
                                                top: (CROWN_H + (i * GROW_H)) * SCALE,
                                                width: '100%',
                                                height: GROW_H * SCALE - 4,
                                                backgroundColor: '#25262B',
                                                border: '2px solid #373A40',
                                                transition: 'all 0.5s ease'
                                            }}
                                        >
                                            <Center h="100%">
                                                <Text size="9" c="dimmed">{GROW_H}mm</Text>
                                            </Center>
                                        </Box>
                                    ))}

                                    {/* Mother Hub (550mm) */}
                                    <Box
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: '100%',
                                            height: BASE_H * SCALE,
                                            backgroundColor: '#141517',
                                            border: '3px solid #1A1B1E',
                                            borderRadius: '0 0 8px 8px',
                                            transition: 'all 0.5s ease',
                                            overflow: doorOpen ? 'visible' : 'hidden'
                                        }}
                                    >
                                        <Stack p="xs" gap={2}>
                                            <Text size="8" fw={700} c="wasabi.6">CORE HUB</Text>
                                            <Box h={40} style={{ border: '1px solid #2C2E33', borderRadius: 4 }} />
                                        </Stack>

                                        {/* Door */}
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: '#141517',
                                                border: '2px solid #373A40',
                                                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transformOrigin: 'left',
                                                transform: doorOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)',
                                                zIndex: 5,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                boxShadow: doorOpen ? '10px 0 20px rgba(0,0,0,0.5)' : 'none'
                                            }}
                                        >
                                            <Text size="9" fw={700} c="gray.7">FRONT DOOR</Text>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Center>
                </Grid.Col>
            </Grid>

            {/* 디자인 철학 안내 */}
            <Box mt={100} py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                <Grid gutter={40}>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack align="center" gap="sm">
                            <ThemeIcon size={40} radius="md" color="wasabi.6"><IconInfoCircle /></ThemeIcon>
                            <Text fw={700} size="lg">수직 유지보수 혁신</Text>
                            <Text ta="center" c="dimmed">위로 무한히 쌓여도 전면 도어를 통해 펌프와 탱크를 즉시 점검할 수 있는 상업용 설계를 적용했습니다.</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack align="center" gap="sm">
                            <ThemeIcon size={40} radius="md" color="wasabi.6"><IconBolt /></ThemeIcon>
                            <Text fw={700} size="lg">아토믹 큐브 모듈</Text>
                            <Text ta="center" c="dimmed">600x600x500mm의 규격화된 재배 모듈은 배송과 조립이 간편하며, 사용자의 공간에 맞게 수량을 자유롭게 조절합니다.</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack align="center" gap="sm">
                            <ThemeIcon size={40} radius="md" color="wasabi.6"><IconDroplet /></ThemeIcon>
                            <Text fw={700} size="lg">스마트 가전의 품격</Text>
                            <Text ta="center" c="dimmed">복잡한 배선과 센서를 마더 허브 내부로 숨기고, 상단 크라운 LCD를 통해 우아한 모니터링 환경을 제공합니다.</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Box>
        </Container>
    );
}
