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
                <Title order={2} ta="center" mb={50}>Technical Equipment Inventory</Title>

                <Stack gap={40}>
                    {/* Pillar 1: Infrastructure */}
                    <DetailedSolutionSection
                        icon={IconBuildingSkyscraper}
                        title="01. 하드웨어 및 기반 설비 (Infrastructure)"
                        color="blue"
                        groups={[
                            {
                                label: "건축 및 구조물",
                                items: ["내재해형 연동 비닐하우스", "정밀 유리온실 (Venlo type)", "수직농장용 고강도 알루미늄 프로파일", "내부 단열 및 암막 스크린"]
                            },
                            {
                                label: "재배 시스템",
                                items: ["다단식 고정 베드 시스템", "공간 절약형 슬라이딩 베드", "벤치형 그로우 테이블", "수직 적층형 식물공장 모듈"]
                            },
                            {
                                label: "배지 솔루션",
                                items: ["친환경 인공토양 (바이오차)", "코코피트/피트모스 혼합 배지", "무균 암면 배지 (Rockwool)", "에어로포닉 전용 뿌리 고지대"]
                            }
                        ]}
                    />

                    {/* Pillar 2: Climate Control */}
                    <DetailedSolutionSection
                        icon={IconWind}
                        title="02. 환경제어 및 공조 시스템 (Climate)"
                        color="teal"
                        groups={[
                            {
                                label: "냉난방 장치",
                                items: ["공기열/지열 히트펌프", "전기 온수 보일러 시스템", "팬코일 유닛 (FCU)", "축열조 에너지 세이빙 솔루션"]
                            },
                            {
                                label: "공기 조화 (HVAC)",
                                items: ["대용량 공기조화기 (AHU)", "제습 및 가습 통합 컨트롤러", "바이러스 살균 덕트 시스템", "미세먼지 필터링 환기 설비"]
                            },
                            {
                                label: "대류 제어",
                                items: ["BLDC 고효율 유동휀", "에어 커튼 시스템", "수직 기류 제어 장치", "온실 전용 천창/측창 자동 개폐"]
                            }
                        ]}
                    />

                    {/* Pillar 3: Life Support */}
                    <DetailedSolutionSection
                        icon={IconDroplet}
                        title="03. 양액 및 광원 솔루션 (Life Support)"
                        color="cyan"
                        groups={[
                            {
                                label: "수경/분무 양액기",
                                items: ["다채널 자동 양액 공급기", "EC/pH 정밀 보정 탱크", "원수 여과 및 연수 시스템", "폐양액 UV 살균 재활용"]
                            },
                            {
                                label: "관수 및 분무",
                                items: ["고압 포그 미스트 노즐", "에어로포닉 하이퍼-미스트", "점적 관수 드립퍼 라인", "뿌리 온도 최적화 공급기"]
                            },
                            {
                                label: "조명 및 에너지",
                                items: ["식물 생장 전용 LED (Full Spectrum)", "PPFD 조절 디밍 시스템", "자연광 연동 광센서 제어", "태양광 하이브리드 발전 설비"]
                            }
                        ]}
                    />

                    {/* Pillar 4: Intelligence */}
                    <DetailedSolutionSection
                        icon={IconRobot}
                        title="04. AI 자동화 및 지능형 기술 (Intelligence)"
                        color="grape"
                        groups={[
                            {
                                label: "소프트웨어 및 제어",
                                items: ["K-Farm OS 중앙 제어 서버", "클라우드 기반 데이터 로깅", "실시간 모바일 관제 앱", "이상 징후 AI 알림 엔진"]
                            },
                            {
                                label: "IoT 하드웨어",
                                items: ["통합 센서 노드 (온/습/CO2/광)", "5G/LTE 산업용 게이트웨이", "무선 통신 중계기", "정밀 모터 드라이버 박스"]
                            },
                            {
                                label: "로봇 및 무인화",
                                items: ["AI 이미지 처리 수확 로봇", "자율주행 약제 방제 드론", "무인 반송 로봇 (AGV)", "고해상도 실시간 모니터링 CCTV"]
                            }
                        ]}
                    />
                </Stack>
            </Container>

            <Divider my={60} label="컨설팅 진행 프로세스" labelPosition="center" />

            {/* Additional Detail - Process Section */}
            <Container size="lg" py={80}>
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
        </Box >
    );
}

function DetailedSolutionSection({ icon: Icon, title, groups, color }: { icon: any, title: string, groups: { label: string, items: string[] }[], color: string }) {
    return (
        <Paper withBorder p="xl" radius="lg" shadow="sm">
            <Group mb="xl">
                <ThemeIcon size={52} radius="md" color={color} variant="filled">
                    <Icon size={32} />
                </ThemeIcon>
                <Title order={3}>{title}</Title>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                {groups.map((group, idx) => (
                    <Stack key={idx} gap="xs">
                        <Text fw={700} size="sm" c={color} style={{ letterSpacing: 1 }}>{group.label.toUpperCase()}</Text>
                        <Divider color={color} size="xs" opacity={0.3} mb="xs" />
                        <List
                            spacing={8}
                            size="sm"
                            icon={
                                <ThemeIcon color={color} size={18} radius="xl" variant="light">
                                    <IconCheck size={12} />
                                </ThemeIcon>
                            }
                        >
                            {group.items.map((item, i) => (
                                <List.Item key={i}>
                                    <Text size="sm" fw={500}>{item}</Text>
                                </List.Item>
                            ))}
                        </List>
                    </Stack>
                ))}
            </SimpleGrid>
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
