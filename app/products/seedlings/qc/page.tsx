'use client';

import { Container, Title, Text, Image, Stack, Button, Group, Badge, List, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconCertificate } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function QCPage() {
    const { t } = useTranslation();

    return (
        <Container size="lg" py={80}>
            <Button component={Link} href="/products/seedlings" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="xl" color="gray">
                {t('prod_seed_title')}
            </Button>

            <Group align="flex-start" justify="space-between" mb={50}>
                <Stack>
                    <Badge color="grape" size="lg" variant="light">Step 03</Badge>
                    <Title order={1} size={42}>{t('prod_seed_card_3_title')}</Title>
                </Stack>
                <ThemeIcon size={64} radius="md" variant="light" color="grape">
                    <IconCertificate size={32} />
                </ThemeIcon>
            </Group>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Column: Image */}
                <div style={{ flex: '0 0 300px' }}>
                    <Image
                        src="/images/seedlings_qa_check.png"
                        radius="lg"
                        alt="Quality Control Check"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', height: 'auto' }}
                    />
                </div>

                {/* Right Column: Content */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Stack gap="lg">
                        <Title order={3} size="h3">Strict Quality Assurance</Title>
                        <Text size="md" lh={1.6}>
                            {t('prod_seed_card_3_detail')}
                        </Text>

                        <List
                            spacing="sm"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="grape" size={20} radius="xl">
                                    <IconCheck style={{ width: 12, height: 12 }} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>RT-PCR 바이러스 정밀 검사</List.Item>
                            <List.Item>S등급 규격 선별 (잎 4-5매, 뿌리 5cm↑)</List.Item>
                            <List.Item>유전적 순도 및 변이 개체 선별</List.Item>
                            <List.Item>출하 전 전수 검사 시스템</List.Item>
                        </List>
                    </Stack>
                </div>
            </div>
        </Container>
    );
}
