'use client';

import {
    Container, Title, Text, Stack, Group, Paper, Grid, ThemeIcon,
    Button, Badge, Divider, List, Box, Center, Image, Card, SimpleGrid
} from '@mantine/core';
import {
    IconSettings, IconActivity, IconCpu, IconCloudComputing,
    IconChartBar, IconDeviceAnalytics, IconDownload, IconArrowRight,
    IconPlugConnected, IconShieldCheck, IconBrain, IconTopologyRing,
    IconDevices, IconDatabase, IconFileText
} from '@tabler/icons-react';
import Link from 'next/link';

export default function IntegratedControlSystemPage() {
    return (
        <Container size="xl" py={80}>
            {/* Hero Section */}
            <Stack align="center" mb={100} gap="xl">
                <Badge size="xl" variant="dot" color="wasabi.6">SOLUTION: KF-ICMS v4.2</Badge>
                <Title order={1} style={{ fontSize: '3.5rem', fontWeight: 900, textAlign: 'center' }}>
                    통합 지능형 <span style={{ color: 'var(--mantine-color-wasabi-6)' }}>제어 시스템</span>
                </Title>
                <Text size="xl" c="dimmed" ta="center" maw={800}>
                    단순한 자동화를 넘어, AI가 작물의 생육 상태를 실시간으로 분석하고 설비를 자율 제어하는
                    K-Farm만의 독자적인 통합 관리 솔루션을 파트너사에게 제안합니다.
                </Text>
                <Group mt="lg">
                    <Button
                        size="xl"
                        radius="md"
                        color="wasabi.6"
                        rightSection={<IconArrowRight size={20} />}
                        component={Link}
                        href="/simulator"
                    >
                        라이브 시뮬레이터 실행하기
                    </Button>
                    <Button
                        variant="outline"
                        size="xl"
                        radius="md"
                        color="gray"
                        leftSection={<IconDownload size={20} />}
                    >
                        기술 제안서 PDF 다운로드
                    </Button>
                </Group>
            </Stack>

            {/* Core Architecture */}
            <Grid gutter={50} align="center" mb={120}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xl">
                        <Box>
                            <Badge color="blue" variant="light" mb="xs">SYSTEM ARCHITECTURE</Badge>
                            <Title order={2} mb="md">HW와 SW가 완벽히 결합된 공학적 정점</Title>
                            <Text size="lg" c="dimmed" style={{ lineHeight: 1.7 }}>
                                센서 데이터의 수집부터 액추에이터의 정밀 제어, 그리고 클라우드를 통한 실시간 대시보드 연동까지.
                                모든 프로세스가 지능형 알고리즘에 의해 최적화됩니다.
                            </Text>
                        </Box>

                        <List
                            spacing="lg"
                            size="md"
                            center
                            icon={
                                <ThemeIcon color="wasabi.6" size={28} radius="xl">
                                    <IconShieldCheck size={18} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>
                                <b>하이퍼-사이클 에어로포닉 통제:</b> 분사 주기와 압력을 MHz 단위로 조절하여 뿌리 산소 농도 극대화
                            </List.Item>
                            <List.Item>
                                <b>PID 정밀 양액 믹싱:</b> EC ±0.1mS/cm, pH ±0.1 범위 내의 극한의 정밀도 유지
                            </List.Item>
                            <List.Item>
                                <b>자율 에너지 관리:</b> LED 열량과 공조 부하를 계산하여 동적 전력 최적화 실행
                            </List.Item>
                        </List>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Paper shadow="xl" radius="xl" p="xl" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                        <Stack align="center" gap="md">
                            <IconTopologyRing size={80} color="var(--mantine-color-wasabi-6)" stroke={1.5} />
                            <Title order={3}>KF-ICMS 클러스터 구조</Title>
                            <SimpleGrid cols={2} spacing="md" w="100%">
                                <Card p="md" radius="md" withBorder>
                                    <IconCpu size={24} color="blue" />
                                    <Text fw={700} mt="xs">Edge Link</Text>
                                    <Text size="xs" c="dimmed">현장 센싱 및 제어</Text>
                                </Card>
                                <Card p="md" radius="md" withBorder>
                                    <IconBrain size={24} color="grape" />
                                    <Text fw={700} mt="xs">AI Logic</Text>
                                    <Text size="xs" c="dimmed">생육 패턴 실시간 분석</Text>
                                </Card>
                                <Card p="md" radius="md" withBorder>
                                    <IconDatabase size={24} color="teal" />
                                    <Text fw={700} mt="xs">Big Data</Text>
                                    <Text size="xs" c="dimmed">환경 리시피 축적</Text>
                                </Card>
                                <Card p="md" radius="md" withBorder>
                                    <IconCloudComputing size={24} color="orange" />
                                    <Text fw={700} mt="xs">SaaS Web</Text>
                                    <Text size="xs" c="dimmed">원격 관제 서비스</Text>
                                </Card>
                            </SimpleGrid>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Technology Highlights */}
            <Title order={2} ta="center" mb={50}>주요 기술 하이라이트</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mb={100}>
                <Paper p="xl" radius="lg" withBorder>
                    <ThemeIcon size={50} radius="md" color="wasabi.6" mb="lg">
                        <IconActivity size={30} />
                    </ThemeIcon>
                    <Title order={4} mb="sm">실시간 디지털 트윈</Title>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                        실제 농장의 모든 물리 데이터(양액 수위, 온도, 소비전력 등)를 1:1로 시뮬레이션 환경에 복제하여 장애 발생을 예측합니다.
                    </Text>
                </Paper>

                <Paper p="xl" radius="lg" withBorder>
                    <ThemeIcon size={50} radius="md" color="blue.6" mb="lg">
                        <IconShieldCheck size={30} />
                    </ThemeIcon>
                    <Title order={4} mb="sm">다중 보호 셰이프 (Failsafe)</Title>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                        센서 드리프트 감지 및 공급 펌프 이중화 제어를 통해 24시간 끊김 없는 생명 유지 장치 구동을 보장합니다.
                    </Text>
                </Paper>

                <Paper p="xl" radius="lg" withBorder>
                    <ThemeIcon size={50} radius="md" color="grape.6" mb="lg">
                        <IconBrain size={30} />
                    </ThemeIcon>
                    <Title order={4} mb="sm">비전 AI 병해충 방어</Title>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                        이동형 지능형 광원 시스템에 탑재된 카메라가 해충을 식별하고, 특정 위치에 정밀 방제 또는 레이저 조사를 실행합니다.
                    </Text>
                </Paper>
            </SimpleGrid>

            {/* Presentation Materials Section */}
            <Paper p={50} radius="24" style={{ backgroundColor: '#1A1B1E', color: 'white' }}>
                <Grid align="center">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Title order={2} mb="md">파트너 실무 협의용 자료</Title>
                        <Text size="lg" style={{ opacity: 0.8 }} mb="xl">
                            본 자료는 파트너사와의 기술 미팅 및 시스템 통합 방식 논의를 위해 제작되었습니다.
                            아래 링크를 통해 디지털 브리프케이스에 접근하세요.
                        </Text>
                        <SimpleGrid cols={2} spacing="md">
                            <Button variant="white" color="dark" size="md" leftSection={<IconFileText size={18} />}>
                                하드웨어 BOM 리스트
                            </Button>
                            <Button variant="white" color="dark" size="md" leftSection={<IconDeviceAnalytics size={18} />}>
                                통신 프로토콜 정의서
                            </Button>
                            <Button variant="white" color="dark" size="md" leftSection={<IconChartBar size={18} />}>
                                예상 에너지 효율 보고서
                            </Button>
                            <Button variant="white" color="dark" size="md" leftSection={<IconSettings size={18} />}>
                                운영 매뉴얼 (Draft)
                            </Button>
                        </SimpleGrid>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Center>
                            <Stack align="center">
                                <Box style={{
                                    border: '10px solid #2C2E33',
                                    borderRadius: '50%',
                                    padding: '20px'
                                }}>
                                    <IconPlugConnected size={100} color="var(--mantine-color-wasabi-6)" />
                                </Box>
                                <Text fw={700} ta="center" mt="md">API & SDK 지원</Text>
                                <Text size="xs" ta="center" style={{ opacity: 0.6 }}>Third-party 시스템 통합 가능</Text>
                            </Stack>
                        </Center>
                    </Grid.Col>
                </Grid>
            </Paper>

            <Center mt={80}>
                <Button size="lg" variant="subtle" color="gray" component={Link} href="/partnership">
                    공식 파트너십 안내로 돌아가기
                </Button>
            </Center>
        </Container>
    );
}
