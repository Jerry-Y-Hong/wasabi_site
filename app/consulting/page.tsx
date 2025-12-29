'use client';

import { Container, Title, Text, Button, Box, SimpleGrid, Paper, ThemeIcon, List, Badge, Stack, Group, Divider, Accordion } from '@mantine/core';
import { IconBuildingSkyscraper, IconWind, IconDroplet, IconCpu, IconChartBar, IconCheck, IconSettings, IconSun, IconRobot } from '@tabler/icons-react';
import Link from 'next/link';

export default function ConsultingPage() {
    return (
        <Box>
            {/* Upper Hero Section */}
            <Box bg="dark.7" py={80} style={{ borderBottom: '1px solid #373a40' }}>
                <Container size="lg">
                    <Stack align="center" gap="md">
                        <Badge color="wasabi" variant="filled" size="lg">TOTAL SOLUTION BLUEPRINT</Badge>
                        <Title c="white" order={1} size={42} ta="center">Smart Farm Equipment & Consulting</Title>
                        <Text c="gray.4" ta="center" maw={800} size="lg">
                            단순한 시설 구축을 넘어, 최신 공조/자동화/바이오 기술이 집약된
                            **K-Farm 토탈 솔루션**을 제안합니다. 복잡한 설비를 4개 핵심 분야로 체계화했습니다.
                        </Text>
                        <Link href="/consulting/inquiry">
                            <Button size="lg" color="wasabi" radius="xl" mt="md">맞춤형 견적 및 컨설팅 문의</Button>
                        </Link>
                    </Stack>
                </Container>
            </Box>

            <Container size="lg" py={80}>
                {/* 4 Pillars Grid */}
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40} mb={100}>
                    {/* Pillar 1: Infrastructure */}
                    <SolutionCard
                        icon={IconBuildingSkyscraper}
                        title="1. 인프라 및 기반 시설"
                        items={[
                            "내재해형 비닐하우스/온실 건축",
                            "고정식/이동식 배지 프레임 설비",
                            "수직농장용 적층형 구조물 제작",
                            "인공토양/고형 배지 시스템 구축"
                        ]}
                        color="blue"
                    />

                    {/* Pillar 2: Climate Control */}
                    <SolutionCard
                        icon={IconWind}
                        title="2. 환경제어 & 공조 시스템"
                        items={[
                            "고효율 히트펌프 냉난방 시스템",
                            "대류 및 공기 조화(HVAC) 설비",
                            "초정밀 온도/습도 조절 센싱",
                            "공기 순환 및 유동휀 최적화"
                        ]}
                        color="teal"
                    />

                    {/* Pillar 3: Life Support */}
                    <SolutionCard
                        icon={IconDroplet}
                        title="3. 양액 및 광원 시스템"
                        items={[
                            "원격 제어 용수 및 양액 공급 장치",
                            "담수식(DWC) / 분무식(Aeroponics) 시스템",
                            "식물 생장 전용 LED 광학 시스템",
                            "자연광 연동 태양광 투사 솔루션"
                        ]}
                        color="cyan"
                    />

                    {/* Pillar 4: Intelligence */}
                    <SolutionCard
                        icon={IconRobot}
                        title="4. 자동화 & 지능형 기술"
                        items={[
                            "자체 개발 소프트웨어(SaaS) 제어",
                            "스마트폰/PC 원격 모니터링 및 제어",
                            "방제/수확용 로봇 및 드론 시스템",
                            "빅데이터 기반 생육 리포트 제공"
                        ]}
                        color="grape"
                    />
                </SimpleGrid>

                <Divider my={60} label="컨설팅 진행 프로세스" labelPosition="center" />

                {/* Additional Detail - Process Section */}
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    <ProcessStep
                        step="01"
                        title="입지 및 타당성 분석"
                        desc="지역 기후 및 환경을 분석하여 최적의 건축 방식(비닐하우스 vs 수직농장)을 결정합니다."
                    />
                    <ProcessStep
                        step="02"
                        title="정밀 맞춤형 설계"
                        desc="양액 시스템부터 로봇 도입까지, 예산과 목표 수확량에 맞춘 상세 설계에 들어갑니다."
                    />
                    <ProcessStep
                        step="03"
                        title="시공 및 사후 관리"
                        desc="전문 엔지니어가 직접 설비를 구축하고, 운영 소프트웨어 매뉴얼을 전수합니다."
                    />
                </SimpleGrid>
            </Container>

            {/* Bottom CTA */}
            <Box bg="wasabi.0" py={60}>
                <Container size="sm" ta="center">
                    <Title order={2} mb="md">성공적인 스마트팜의 시작</Title>
                    <Text mb="xl" c="dimmed">
                        수많은 설비 중 우리 농장에는 무엇이 필요할까요? <br />
                        K-Farm의 전문가들이 공정별 최적의 조합을 찾아드립니다.
                    </Text>
                    <Group justify="center">
                        <Button component={Link} href="/consulting/inquiry" size="md" color="wasabi">Consultation Request</Button>
                    </Group>
                </Container>
            </Box>
        </Box>
    );
}

function SolutionCard({ icon: Icon, title, items, color }: { icon: any, title: string, items: string[], color: string }) {
    return (
        <Paper withBorder p="xl" radius="lg" shadow="sm">
            <Group mb="lg">
                <ThemeIcon size={50} radius="md" color={color} variant="light">
                    <Icon size={30} />
                </ThemeIcon>
                <Title order={3}>{title}</Title>
            </Group>
            <List
                spacing="sm"
                size="md"
                center
                icon={
                    <ThemeIcon color={color} size={20} radius="xl">
                        <IconCheck size={12} />
                    </ThemeIcon>
                }
            >
                {items.map((item, i) => (
                    <List.Item key={i}><Text fw={500}>{item}</Text></List.Item>
                ))}
            </List>
        </Paper>
    );
}

function ProcessStep({ step, title, desc }: { step: string, title: string, desc: string }) {
    return (
        <Paper p="xl" radius="md" withBorder bg="gray.0">
            <Text fw={900} size="xl" c="wasabi" mb="xs">{step}</Text>
            <Title order={4} mb="sm">{title}</Title>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>{desc}</Text>
        </Paper>
    );
}
