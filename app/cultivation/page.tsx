'use client';

import { Container, Title, Text, SimpleGrid, ThemeIcon, Paper, Image, Stack, Box, Tabs, List, Badge, Group, Divider } from '@mantine/core';
import { IconFlask, IconMist, IconCpu, IconBox, IconCheck } from '@tabler/icons-react';

export default function CultivationPage() {
    return (
        <Box>
            {/* Hero Section */}
            <Box bg="dark.8" py={80} style={{ borderBottom: '1px solid #373a40' }}>
                <Container size="lg">
                    <Stack align="center" gap="xs">
                        <Badge color="wasabi" variant="filled" size="lg">PROCESS MAP v2.0</Badge>
                        <Title c="white" order={1} size={42} ta="center">K-Farm End-to-End Solution</Title>
                        <Text c="gray.4" ta="center" maw={800} size="lg">
                            복잡한 스마트팜 설비 기술을 4가지 핵심 모듈로 체계화했습니다.
                            종자 생산부터 가공까지, K-Farm만의 독자적인 수직 농업 프로세스를 확인하세요.
                        </Text>
                    </Stack>
                </Container>
            </Box>

            <Container size="lg" py={60}>
                <Tabs defaultValue="lab" color="wasabi" variant="pills" radius="md">
                    <Tabs.List justify="center" mb={50}>
                        <Tabs.Tab value="lab" leftSection={<IconFlask size={18} />} p="md">1. 조직배양 연구소</Tabs.Tab>
                        <Tabs.Tab value="cultivate" leftSection={<IconMist size={18} />} p="md">2. 에어로포닉 재배</Tabs.Tab>
                        <Tabs.Tab value="control" leftSection={<IconCpu size={18} />} p="md">3. 통합 환경제어</Tabs.Tab>
                        <Tabs.Tab value="process" leftSection={<IconBox size={18} />} p="md">4. 수확 및 가공</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="lab">
                        <ProcessStage
                            title="바이오 랩: 무병 우량 종묘 생산"
                            subtitle="Virus-Free Seedlings Lab"
                            description="와사비 재배의 성패는 건강한 종묘에서 결정됩니다. K-Farm은 자체 조직배양 기술을 통해 병원균이 없는 '클린 종묘'를 대량 생산합니다."
                            image="/images/tissue-culture.jpg"
                            features={[
                                "생장점 배양 기술 (Virus-Free)",
                                "유전적 형질 고정 및 품질 균일화",
                                "외부 오염 완벽 차단 (Clean Room)",
                                "연간 100만 주 이상의 생산 캐파"
                            ]}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="cultivate">
                        <ProcessStage
                            title="하이퍼-사이클 에어로포닉 시스템"
                            subtitle="Hyper-Cycle Aeroponics"
                            description="흙과 고여있는 물 없이 공기 중에 뿌리를 노출시켜 미세 영양 미스트를 분사합니다. 전통적인 방식보다 25배 높은 생산성을 자랑합니다."
                            image="/images/smart-farm-interior.jpg"
                            features={[
                                "뿌리 산소 공급 극대화",
                                "재배 기간 단축 (24개월 → 9개월)",
                                "양액 정밀 순환 시스템 (물 90% 절감)",
                                "수직 적층형 구조로 공간 효율 극대화"
                            ]}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="control">
                        <ProcessStage
                            title="AI 데이터 기반 환경 최적화"
                            subtitle="Smart Control & Automation"
                            description="단순 자동화를 넘어 AI가 생육 단계별로 EC, pH, LED 파장을 조절합니다. 와사비의 핵심 성분인 알릴이소티오시아네이트 함량을 극대화합니다."
                            image="/images/tech-blueprint.jpg"
                            features={[
                                "IoT 센서 기반 실시간 모니터링",
                                "생육 단계별 맞춤형 LED 스펙트럼",
                                "냉방 및 습도 정밀 제어 (공조 시스템)",
                                "원격 통합 관리 대시보드 제공"
                            ]}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="process">
                        <ProcessStage
                            title="프리미엄 후처리와 보존 기술"
                            subtitle="Post-Harvest & Cold Chain"
                            description="수확 즉시 세척 및 가공(Clean-Room)에 들어가 신선도를 유지합니다. 생와사비부터 기능성 원료까지 다양한 제품군으로 가공됩니다."
                            image="/images/wasabi_food_processing_detailed.jpg"
                            features={[
                                "저온 세척 및 살균 시스템",
                                "콜드체인 기반 신선 유통망",
                                "B2B 대용량 공급 및 가공 솔루션",
                                "식품 안전 인증(HACCP) 기준 설비"
                            ]}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </Box>
    );
}

function ProcessStage({ title, subtitle, description, image, features }: { title: string, subtitle: string, description: string, image: string, features: string[] }) {
    return (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60} py="xl">
            <Box>
                <Badge color="wasabi" variant="light" mb="xs">{subtitle}</Badge>
                <Title order={2} mb="md">{title}</Title>
                <Text c="dimmed" size="lg" mb="xl" style={{ lineHeight: 1.6 }}>
                    {description}
                </Text>

                <List
                    spacing="sm"
                    size="md"
                    center
                    icon={
                        <ThemeIcon color="wasabi" size={24} radius="xl">
                            <IconCheck size={16} />
                        </ThemeIcon>
                    }
                >
                    {features.map((f, i) => (
                        <List.Item key={i}><Text fw={500}>{f}</Text></List.Item>
                    ))}
                </List>
            </Box>
            <Paper shadow="xl" radius="lg" withBorder style={{ overflow: 'hidden' }}>
                <Image
                    src={image}
                    alt={title}
                    fallbackSrc="https://placehold.co/600x400?text=K-Farm+Technology"
                    style={{ transition: 'transform 0.5s ease' }}
                />
            </Paper>
        </SimpleGrid>
    )
}
