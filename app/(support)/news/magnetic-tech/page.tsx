"use client";

import React from 'react';
import { Container, Title, Text, Paper, Badge, Group, ThemeIcon, List, Divider, Button, Breadcrumbs, Anchor, Blockquote, SimpleGrid, Card } from '@mantine/core';
import { Calendar, User, Tag, ArrowLeft, Magnet, Sprout, Droplet, BrainCircuit, Activity, BookOpen, Quote, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MagneticColumnPage() {
    const items = [
        { title: 'Home', href: '/' },
        { title: 'News', href: '/news' },
        { title: 'Tech Column', href: '#' },
    ].map((item, index) => (
        <Anchor component={Link} href={item.href} key={index} c="dimmed" size="sm">
            {item.title}
        </Anchor>
    ));

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', color: '#2C2E33', fontFamily: '"Pretendard", sans-serif' }}>
            {/* Header Image Section */}
            <div style={{
                height: '450px',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%), url("https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2796&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'end',
                paddingBottom: 80
            }}>
                <Container size="md" w="100%">
                    <Group mb="md">
                        <Badge color="lime" size="lg" variant="filled">Tech Insight</Badge>
                        <Badge color="gray" size="lg" variant="light" style={{ color: 'white' }}>Bio-Physics</Badge>
                    </Group>
                    <Title c="white" style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.5rem' }}>
                        식물 성장의 숨은 열쇠:<br />
                        <span style={{ borderBottom: '4px solid #82c91e' }}>자기장(Magnetic Field) 농법</span>의 과학
                    </Title>
                    <Group gap="xl">
                        <Group gap="xs">
                            <User size={16} color="#adb5bd" />
                            <Text c="gray.4" size="sm" fw={500}>K-WASABI R&D Team</Text>
                        </Group>
                        <Group gap="xs">
                            <Calendar size={16} color="#adb5bd" />
                            <Text c="gray.4" size="sm">2026. 01. 07</Text>
                        </Group>
                    </Group>
                </Container>
            </div>

            <Container size="md" py={60} style={{ background: 'white', marginTop: -60, borderRadius: '16px', position: 'relative', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', paddingLeft: 60, paddingRight: 60 }}>
                <Breadcrumbs mb={40}>{items}</Breadcrumbs>

                {/* Intro / Executive Summary */}
                <Text size="xl" lh={1.8} mb="xl" fw={500} c="gray.8">
                    자기장(Magnetic Field)이 식물 뿌리에 미치는 영향은 최근 농업 생명공학 분야에서
                    <span style={{ color: '#2f9e44', fontWeight: 700 }}> '물리적 자극을 통한 생장 촉진(Physical Stimulant)'</span>이라는
                    새로운 패러다임으로 주목받고 있습니다. 본 칼럼에서는 자기장이 식물의 대사와 성장에 관여하는 4가지 핵심 메커니즘을 심층 분석합니다.
                </Text>

                <Paper bg="gray.0" p="xl" radius="md" mb={60} withBorder style={{ borderColor: '#dee2e6' }}>
                    <Title order={4} mb="md" c="gray.7">목차 (Table of Contents)</Title>
                    <List spacing="xs" size="md" icon={<ThemeIcon color="gray" size={20} radius="xl" variant="light"><ArrowRight size={12} /></ThemeIcon>}>
                        <List.Item><b>Mechanism 1:</b> 뿌리 신장 및 세포 분열 촉진</List.Item>
                        <List.Item><b>Mechanism 2:</b> 수분 및 미네랄 흡수 효율 증대</List.Item>
                        <List.Item><b>Mechanism 3:</b> 자기굴성 (Magnetotropism)과 방향 제어</List.Item>
                        <List.Item><b>Mechanism 4:</b> 환경 스트레스 저항성 (항산화 효과)</List.Item>
                    </List>
                </Paper>

                {/* Section 1 */}
                <div style={{ marginBottom: 80 }}>
                    <Group mb="md" gap="xs">
                        <ThemeIcon size={32} color="lime" radius="md"><Sprout size={18} /></ThemeIcon>
                        <Title order={2} size="h2" c="gray.9">1. 뿌리 신장 및 생장 촉진</Title>
                    </Group>
                    <Text size="lg" lh={1.7} c="gray.7" mb="lg">
                        자기장에 노출된 식물은 대조군 대비 유의미한 <b>Biomass(생체량) 증가</b>를 보입니다.
                        이는 단순한 우연이 아닌, 세포 수준에서의 구체적인 변화에 기인합니다.
                    </Text>
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Text fw={700} mb="xs" c="lime.7">세포 분열 활성화</Text>
                            <Text size="sm" c="dimmed" lh={1.6}>
                                10~200mT 강도의 자기장은 뿌리 끝 생장점(Meristem)의 세포 주기를 단축시킵니다.
                                G1기에서 S기로의 전환을 가속화하여 더 빠른 세포 분열을 유도합니다.
                            </Text>
                        </Card>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Text fw={700} mb="xs" c="lime.7">호르몬 합성 유도</Text>
                            <Text size="sm" c="dimmed" lh={1.6}>
                                식물 성장의 핵심인 <b>옥신(Auxin)</b>과 <b>지베렐린(GA3)</b>의 생합성을 촉진하여,
                                뿌리의 수직 성장과 측근 발달을 동시에 자극합니다.
                            </Text>
                        </Card>
                    </SimpleGrid>
                </div>

                <Divider my="xl" />

                {/* Section 2 */}
                <div style={{ marginBottom: 80 }}>
                    <Group mb="md" gap="xs">
                        <ThemeIcon size={32} color="cyan" radius="md"><Droplet size={18} /></ThemeIcon>
                        <Title order={2} size="h2" c="gray.9">2. 수분 및 영양분 흡수 효율 증대</Title>
                    </Group>
                    <Text size="lg" lh={1.7} c="gray.7" mb="lg">
                        자기장은 물리적(자화수) 변화와 생물학적(이온 채널) 변화를 동시에 일으켜,
                        비료 사용량을 줄이면서도 흡수율을 높이는 <b>'고효율 농법'</b>을 가능케 합니다.
                    </Text>
                    <Blockquote color="cyan" cite="- 최신 농업물리학 연구 동향 (2025)" icon={<Quote size={24} />} mt="xl">
                        "자기장을 통과한 물(Magnetized Water)은 물 분자 클러스터가 미세해져,
                        식물 세포막의 아쿠아포린(Aquaporin) 채널을 더 빠르게 통과한다."
                    </Blockquote>
                    <List mt="lg" spacing="sm" size="md" icon={<CheckCircle size={16} color="#22b8cf" />}>
                        <List.Item><b>이온 투과성 증대:</b> Ca²⁺, Mg²⁺, Fe 등 양이온 미네랄의 세포 내 유입 속도 증가.</List.Item>
                        <List.Item><b>용해력 상승:</b> 난용성 염류를 더 잘 녹여 뿌리가 흡수하기 쉬운 형태로 변환.</List.Item>
                    </List>
                </div>

                <Divider my="xl" />

                {/* Section 3 & 4 (Grouped) */}
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ marginBottom: 60 }}>
                    <div>
                        <Group mb="md" gap="xs">
                            <ThemeIcon size={32} color="grape" radius="md"><BrainCircuit size={18} /></ThemeIcon>
                            <Title order={3} c="gray.9">3. 자기굴성 (Magnetotropism)</Title>
                        </Group>
                        <Text size="md" c="gray.6" lh={1.6}>
                            식물은 중력뿐만 아니라 자기장 방향을 감지합니다. 뿌리 세포 내의 <b>녹말체(Statoliths)</b>나
                            <b>Ferritin 단백질</b>이 자기력선 방향으로 정렬되며 성장의 방향성을 유도합니다.
                            이는 중력이 불안정한 특수 환경(수직농장 등)에서 뿌리 정렬을 돕습니다.
                        </Text>
                    </div>
                    <div>
                        <Group mb="md" gap="xs">
                            <ThemeIcon size={32} color="red" radius="md"><Activity size={18} /></ThemeIcon>
                            <Title order={3} c="gray.9">4. 스트레스 저항성</Title>
                        </Group>
                        <Text size="md" c="gray.6" lh={1.6}>
                            염류 집적이나 가뭄 스트레스 상황에서 식물은 활성산소(ROS)를 생성해 자폭하려 합니다.
                            자기장은 <b>SOD, CAT 등 항산화 효소</b>를 활성화하여 이러한 산화 스트레스를 방어하고
                            생존율을 비약적으로 높입니다.
                        </Text>
                    </div>
                </SimpleGrid>

                {/* Conclusion Box */}
                <Paper withBorder p="xl" radius="lg" bg="gray.9" c="white" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: 30, opacity: 0.1 }}>
                        <Magnet size={120} color="white" />
                    </div>
                    <Title order={3} mb="md" style={{ color: '#bae637' }}>K-WASABI의 적용: 150mT Pulse Tech</Title>
                    <Text size="md" lh={1.7} style={{ position: 'relative', zIndex: 1 }}>
                        K-WASABI 스마트팜은 이러한 이론적 근거를 바탕으로, 와사비 생육에 최적화된
                        <b>150mT 강도의 펄스 자기장 수처리 시스템(MWP)</b>을 자체 개발하여 적용하고 있습니다.
                        <br /><br />
                        지나치게 강한 자기장은 오히려 스트레스가 될 수 있기에,
                        우리는 정밀한 제어를 통해 '생장 촉진'의 Sweet Spot을 유지합니다.
                    </Text>
                    <Group mt="xl">
                    </Group>
                </Paper>

                <Group justify="center" mt={80}>
                    <Button component={Link} href="/news" variant="subtle" color="gray" size="md" leftSection={<ArrowLeft size={18} />}>
                        뉴스 목록으로
                    </Button>
                </Group>
            </Container>

            {/* Footer Reference */}
            <div style={{ background: '#f1f3f5', padding: '40px 0' }}>
                <Container size="md">
                    <Text size="sm" c="dimmed" fw={700} mb="xs">References</Text>
                    <List size="xs" c="dimmed" spacing={4} type="ordered">
                        <List.Item>Maffei, M. E. (2014). Magnetic field effects on plant growth, development, and evolution. *Frontiers in Plant Science*.</List.Item>
                        <List.Item>Teixeira da Silva, J. A., & Dobránszki, J. (2016). Magnetic fields: how is plant growth and development impacted? *Protoplasma*.</List.Item>
                        <List.Item>Latest Research on Magnetized Water in Agriculture (2025), *Journal of Agri-Physics*.</List.Item>
                    </List>
                </Container>
            </div>
        </div>
    );
}
