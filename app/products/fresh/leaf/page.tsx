'use client';

import { Container, Title, Text, Image, Stack, Button, Group, Badge, List, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconLeaf } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function LeafPage() {
    const { t } = useTranslation();

    return (
        <Container size="lg" py={80}>
            <Button component={Link} href="/products/fresh" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="xl" color="gray">
                {t('prod_fresh_title')}
            </Button>

            <Group align="flex-start" justify="space-between" mb={50}>
                <Stack>
                    <Badge color="green" size="lg" variant="light">Daily Harvest</Badge>
                    <Title order={1} size={42}>{t('prod_fresh_p2_title')}</Title>
                </Stack>
                <ThemeIcon size={64} radius="md" variant="light" color="green">
                    <IconLeaf size={32} />
                </ThemeIcon>
            </Group>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Column: Image */}
                <div style={{ flex: '0 0 300px' }}>
                    <Image
                        src="/images/wasabi-leaves.jpg"
                        radius="lg"
                        alt="Fresh Wasabi Leaves"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', height: 'auto' }}
                    />
                </div>

                {/* Right Column: Content */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Stack gap="lg">
                        <Title order={3} size="h3">Fresh & Healthy</Title>
                        <Text size="md" lh={1.6}>
                            {t('prod_fresh_p2_detail')}
                        </Text>

                        <List
                            spacing="sm"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="green" size={20} radius="xl">
                                    <IconCheck style={{ width: 12, height: 12 }} />
                                </ThemeIcon>
                            }
                            mt="xl"
                        >
                            <List.Item>10~14일 주기 신선 수확 시스템</List.Item>
                            <List.Item>잎 폭 10~15cm 최적 규격 선별</List.Item>
                            <List.Item>무농약 수경재배 (pesticide-free)</List.Item>
                            <List.Item>고기 쌈, 장아찌, 샐러드용 최적화</List.Item>
                        </List>
                    </Stack>
                </div>
            </div>
        </Container>
    );
}
