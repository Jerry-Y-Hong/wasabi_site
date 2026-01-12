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

export default function AssemblyManualPage() {
    const [active, setActive] = useState(0);

    const BASE_H = 550;
    const GROW_H = 500;
    const CROWN_H = 100; // Increased from 50mm to 100mm for Control PCB
    const WIDTH = 600;

    const steps = [
        {
            label: '1단계: 통합 코어 허브',
            description: '전면 개폐형 메인 패키지',
            title: 'Front-Access Core Hub (H 550mm)',
            content: '재배단의 수량에 관계없이 가장 기본이 되는 600x600x550mm(H) 통합 패키지입니다. 전면 마그네틱 도어를 통해 물통과 기기실에 쉽게 접근할 수 있어, 적층 후에도 유지보수가 간편합니다.',
            items: [
                '전면 개폐형 자석 도어 시스템 확인',
                '초소형 무선 pH/EC 센서 및 80L 탱크 안착',
                '상단 적층용 가이드 핀 및 유압 포트 점검'
            ],
            image: '/images/assembly/step1_v8.png'
        },
        {
            label: '2단계: 아토믹 모듈 적층',
            description: '600x600x500 독립 유닛',
            title: 'Atomic Module Stacking (H 500mm)',
            content: '소비자가 원하는 수량만큼 600x600x500mm(H) 독립 재배 모듈을 쌓아 올립니다. 각 모듈은 별개의 구성 유닛으로 제작되어 적층만으로 간단히 확장됩니다.',
            items: [
                '높이 500mm의 큐브형 재배 모듈 수직 적층',
                '정밀 가이드 핀을 이용한 모듈 간 체결',
                '무게감 있는 각 모듈의 안정적 고정 확인'
            ],
            image: '/images/assembly/step2_v8.png'
        },
        {
            label: '3단계: 모듈별 독립 공조',
            description: '마그네틱 스킨 및 팬',
            title: 'Independent Module Skin',
            content: '각 500mm 모듈 측면에 50x50mm 저소음 PC 팬이 장착된 외장 커버를 부착합니다. 자석 방식으로 간단히 탈부착하며 독립 공조 환경을 완성합니다.',
            items: [
                '모듈별 독립 50x50mm 환기 팬 전원 연결',
                '월넛/메탈 마그네틱 스킨 개별 부착',
                '모듈 단위의 최적 공환기 테스트'
            ],
            image: '/images/assembly/step3_v8.png'
        },
        {
            label: '4단계: 스마트 브레인 크라운 합체',
            description: '통합 제어 및 배선 허브',
            title: 'Control Center Crown (H 100mm)',
            content: '재배단 최상단에 마감되는 핵심 제어 모듈입니다. 메인 PCB와 연결된 배선은 알루미늄 프로파일 중앙의 관로(Internal Raceway)를 통해 하부까지 지저분한 선 노출 없이 깔끔하게 수직으로 연결됩니다.',
            items: [
                '100mm 높이의 제어 모듈(Brain) 통합 마감',
                '프로파일 중앙 관로를 활용한 히든 배선(Hidden Wiring) 연결',
                'T-슬롯 마그네틱 접점을 통한 측면 패널 전원 공급 확인'
            ],
            image: '/images/assembly/step4_v8.png'
        },
        {
            label: '5단계: 유연한 공간 배치',
            description: '수량별 최적화 완성',
            title: 'Flexible Space Integration',
            content: '적층형 모듈 시스템으로 완성된 KF-MOD입니다. 1단부터 다단까지 소비자의 공간에 맞춰 멋진 인테리어 오브제로 기능합니다.',
            items: [
                '공간과 목적에 맞춘 자유로운 적층 수량 완성',
                '프리미엄 인테리어 조화 및 고추냉이 재배 시작',
                '스마트 앱 연동을 통한 원격 모니터링 활성화'
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
                    href="/smartfarm/modular"
                >
                    돌아가기
                </Button>
                <Badge size="xl" variant="dot" color="wasabi.6">KF-MOD-2026 OFFICIAL GUIDE</Badge>
            </Group>

            <Stack gap="xs" mb={50}>
                <Title order={1} style={{ fontSize: '3rem', fontWeight: 900 }}>
                    조립 매뉴얼 <span style={{ color: 'var(--mantine-color-wasabi-6)' }}>실사 가이드</span>
                </Title>
                <Text size="xl" c="dimmed">
                    비전공자도 가구처럼 쉽게 조립할 수 있는 아토믹 모듈러 시스템의 단계별 가이드입니다.
                </Text>
                <Group mt="md">
                    <Button
                        variant="gradient"
                        gradient={{ from: 'wasabi.6', to: 'teal' }}
                        size="md"
                        component={Link}
                        href="/smartfarm/modular/visualizer"
                    >
                        인터랙티브 3D 적층 시뮬레이터 실행
                    </Button>
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
                                                {index === 4 ? '조립 완료 및 구동' : '다음 단계로'}
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
                        <Badge size="xl" variant="filled" color="wasabi.6">ENGINEERING EXCELLENCE</Badge>
                        <Title order={2} ta="center">지능형 농장을 위한 3대 혁신 설계</Title>
                        <Text c="dimmed" ta="center" maw={600}>
                            KF-MOD v4.5는 단순한 재배기를 넘어, 유지보수의 편리함과 공학적 완성도를 최우선으로 설계되었습니다.
                        </Text>
                    </Stack>

                    <Grid gutter={40}>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <Paper p="xl" radius="lg" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box mb="lg">
                                    <RacewayIllustration />
                                </Box>
                                <Stack align="center" gap="md">
                                    <Title order={4} ta="center">프로파일 내부 관로 (Internal Raceway)</Title>
                                    <Text ta="center" size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                        알루미늄 프로파일 중앙의 비어있는 공간을 활용해 브레인과 하부 펌프를 연결합니다. 외부 배선이 전혀 없는 <b>'히든 배선 미학'</b>을 실현합니다.
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
                                    <Title order={4} ta="center">슬라이드 아웃 기기 트레이</Title>
                                    <Text ta="center" size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                        전면 도어를 열고 레일을 당기면 탱크와 펌프가 앞으로 나옵니다. 좁은 공간에서도 무거운 장비를 들 필요 없는 <b>'혁신적 정비 구조'</b>입니다.
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
                                    <Title order={4} ta="center">포고 핀 무선 적층 (Wireless Stacking)</Title>
                                    <Text ta="center" size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                                        유닛을 쌓기만 하면 마그네틱 접점을 통해 전력과 데이터가 자동으로 연결됩니다. 번거로운 커넥터 연결 없이 <b>'단수 확장'</b>이 즉시 완료됩니다.
                                    </Text>
                                </Stack>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    <Center mt={80}>
                        <Stack align="center" gap="sm">
                            <Text fw={700}>기술 지원 및 조립 상담</Text>
                            <Text c="dimmed">본 매뉴얼을 따라 하던 중 어려움이 생기면 즉시 엔지니어링 팀에 문의하십시오.</Text>
                            <Group mt="md">
                                <Button variant="light" color="gray">매뉴얼 PDF 다운로드</Button>
                                <Button variant="filled" color="wasabi.6">1:1 기술 지원 요청</Button>
                            </Group>
                        </Stack>
                    </Center>
                </Container>
            </Box>
        </Container>
    );
}
