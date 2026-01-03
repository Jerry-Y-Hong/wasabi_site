'use client';

import { Container, Title, Text, Image, Stack, Button, Group, Badge, List, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconDiamond } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function RhizomePage() {
    const { t } = useTranslation();

    return (
        <Container size="lg" py={80}>
            <Button component={Link} href="/products/fresh" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="xl" color="gray">
                {t('prod_fresh_title')}
            </Button>

            <Group align="flex-start" justify="space-between" mb={50}>
                <Stack>
                    <Badge color="wasabi" size="lg" variant="light">Premium</Badge>
                    <Title order={1} size={42}>{t('prod_fresh_p1_title')}</Title>
                </Stack>
                <ThemeIcon size={64} radius="md" variant="light" color="wasabi">
                    <IconDiamond size={32} />
                </ThemeIcon>
            </Group>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Column: Image */}
                <div style={{ flex: '0 0 300px' }}>
                    <Image
                        src="/images/wasabi-rhizomes.jpg"
                        radius="lg"
                        alt="Fresh Wasabi Rhizomes"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', height: 'auto' }}
                    />
                </div>

                {/* Right Column: Content */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Stack gap="lg">
                        <Title order={3} size="h3">The Jewel of Wasabi</Title>
                        <Text size="md" lh={1.6}>
                            {t('prod_fresh_p1_detail')}
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
                            mt="xl"
                        >
                            <List.Item>18개월 이상 장기 재배 (Long-term Cultivation)</List.Item>
                            <List.Item>평균 중량 80g ~ 120g 특대 사이즈</List.Item>
                            <List.Item>월등한 알릴이소티오시아네이트(AITC) 함량</List.Item>
                            <List.Item>깊은 매운맛과 은은한 단맛의 밸런스</List.Item>
                        </List>
                    </Stack>
                </div>
            </div>
        </Container>
    );
}
