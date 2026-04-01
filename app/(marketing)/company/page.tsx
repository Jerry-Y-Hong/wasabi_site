'use client';

import { Container, Title, Text, Stack, Group, Paper, Badge, ThemeIcon, Box, SimpleGrid, Image } from '@mantine/core';
import { IconBuildingSkyscraper, IconUser, IconPhone, IconMapPin, IconCertificate } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

export default function CompanyPage() {
    const { t } = useTranslation();

    return (
        <Box bg="white">
            {/* Hero Section */}
            <Box bg="dark.9" py={100} c="white">
                <Container size="lg">
                    <Stack align="center" gap="md">
                        <Badge variant="filled" color="wasabi" size="lg">{t('nav_company')}</Badge>
                        <Title order={1} style={{ fontSize: '3.5rem', fontWeight: 900, textAlign: 'center' }}>
                            K-Farm Group
                        </Title>
                        <Text size="xl" maw={700} ta="center" c="gray.4">
                            대한민국 스마트팜 와사비 산업의 새로운 기준을 세우는 혁신 기술 기업
                        </Text>
                    </Stack>
                </Container>
            </Box>

            {/* Corporate Profile Section */}
            <Container size="lg" py={80}>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
                    <Stack gap="xl">
                        <Box>
                            <Title order={2} mb="xl" style={{ borderLeft: '4px solid var(--mantine-color-wasabi-6)', paddingLeft: '1rem' }}>
                                기업 개요
                            </Title>
                            <Text size="lg" lh={1.8}>
                                농업회사법인 주식회사 케이팜그룹은 첨단 에어로포닉스(Aeroponics) 기술과 AI 기반 정밀 농업 솔루션을 결합하여, 기후 위기와 식량 안보 문제에 대응하는 미래 농업의 비전을 제시합니다.
                            </Text>
                        </Box>

                        <Paper withBorder p="xl" radius="md" bg="gray.0">
                            <Stack gap="md">
                                <InfoItem icon={IconBuildingSkyscraper} label="회사명" value="농업회사법인 주식회사 케이팜그룹" />
                                <InfoItem icon={IconUser} label="대표이사" value="함석도 (Suk-do Ham)" />
                                <InfoItem icon={IconCertificate} label="사업자등록" value="통신판매 제 2026-강원철원-0019 호" />
                                <InfoItem icon={IconPhone} label="고객지원" value="+82 10-4355-0633" />
                            </Stack>
                        </Paper>
                    </Stack>

                    <Stack gap="xl">
                        <Box>
                            <Title order={2} mb="xl" style={{ borderLeft: '4px solid var(--mantine-color-wasabi-6)', paddingLeft: '1rem' }}>
                                주요 사업장
                            </Title>
                            <Stack gap="lg">
                                <LocationItem
                                    title="철원 본사 (HQ)"
                                    address="강원특별자치도 철원군 근남면 초막동길 2-1"
                                    tag="Administrative Center"
                                />
                                <LocationItem
                                    title="화천 수직농장 (Vertical Farm)"
                                    address="강원특별자치도 화천군"
                                    tag="Production Facility"
                                />
                            </Stack>
                        </Box>
                    </Stack>
                </SimpleGrid>
            </Container>

            {/* Vision Section */}
            <Box bg="gray.0" py={80}>
                <Container size="lg">
                    <Paper shadow="xl" p={50} radius="lg" style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-6) 100%)',
                        color: 'white',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <Stack align="center" gap="xl" pos="relative" style={{ zIndex: 1 }}>
                            <Title order={2} ta="center">Core Value</Title>
                            <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30} w="100%">
                                <ValueCard title="Innovation" desc="독자적인 에어로포닉 기술을 통한 농업 혁신" />
                                <ValueCard title="Sustainability" desc="자원 절약 및 친환경 수직 농법 지향" />
                                <ValueCard title="Global Standards" desc="전 세계 와사비 시장의 디지털 표준 수립" />
                            </SimpleGrid>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <Group align="flex-start" wrap="nowrap">
            <ThemeIcon variant="light" color="wasabi" size="md">
                <Icon size={18} />
            </ThemeIcon>
            <Box>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{label}</Text>
                <Text fw={600}>{value}</Text>
            </Box>
        </Group>
    );
}

function LocationItem({ title, address, tag }: { title: string, address: string, tag: string }) {
    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg">{title}</Text>
                <Badge color="wasabi" variant="outline">{tag}</Badge>
            </Group>
            <Group gap="xs" wrap="nowrap">
                <IconMapPin size={16} color="gray" />
                <Text size="sm" c="dimmed">{address}</Text>
            </Group>
        </Paper>
    );
}

function ValueCard({ title, desc }: { title: string, desc: string }) {
    return (
        <Stack gap="xs" align="center">
            <Text fw={900} size="xl" c="wasabi.4">{title}</Text>
            <Text ta="center" size="sm" c="gray.4">{desc}</Text>
        </Stack>
    );
}
