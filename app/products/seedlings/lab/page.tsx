'use client';

import { Container, Title, Text, Image, Stack, Button, Group, Badge, List, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconMicroscope } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function LabPage() {
    const { t } = useTranslation();

    return (
        <Container size="lg" py={80}>
            <Button component={Link} href="/products/seedlings" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="xl" color="gray">
                {t('prod_seed_title')}
            </Button>

            <Group align="flex-start" justify="space-between" mb={50}>
                <Stack>
                    <Badge color="wasabi" size="lg" variant="light">Step 01</Badge>
                    <Title order={1} size={42}>{t('prod_seed_card_1_title')}</Title>
                </Stack>
                <ThemeIcon size={64} radius="md" variant="light" color="wasabi">
                    <IconMicroscope size={32} />
                </ThemeIcon>
            </Group>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Column: Image */}
                <div style={{ flex: '0 0 300px' }}>
                    <Image
                        src="/images/seedlings_lab_tech.png"
                        radius="lg"
                        alt="Advanced Tissue Culture Lab"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', height: 'auto' }}
                    />
                </div>

                {/* Right Column: Content */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Stack gap="lg">
                        <Title order={3} size="h3">Hyper-Clean Bio Technology</Title>
                        <Text size="md" lh={1.6}>
                            {t('prod_seed_card_1_detail')}
                        </Text>

                        <List
                            spacing="sm"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="wasabi" size={20} radius="xl">
                                    <IconCheck style={{ width: 12, height: 12 }} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>생장점(Meristem) 0.3mm 정밀 적출</List.Item>
                            <List.Item>HEPA 필터 클린룸 (ISO Class 5)</List.Item>
                            <List.Item>바이러스 프리(Virus-Free) 캘러스 유도</List.Item>
                            <List.Item>최적 배지 조성을 통한 다신초 대량 증식</List.Item>
                        </List>
                    </Stack>
                </div>
            </div>
        </Container>
    );
}
