'use client';

import { Container, Title, Text, Image, Stack, Button, Group, Badge, List, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconSeeding } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function StemPage() {
    const { t } = useTranslation();

    return (
        <Container size="lg" py={80}>
            <Button component={Link} href="/products/fresh" variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="xl" color="gray">
                {t('prod_fresh_title')}
            </Button>

            <Group align="flex-start" justify="space-between" mb={50}>
                <Stack>
                    <Badge color="teal" size="lg" variant="light">Crunchy Texture</Badge>
                    <Title order={1} size={42}>{t('prod_fresh_p3_title')}</Title>
                </Stack>
                <ThemeIcon size={64} radius="md" variant="light" color="teal">
                    <IconSeeding size={32} />
                </ThemeIcon>
            </Group>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Column: Image */}
                <div style={{ flex: '0 0 300px' }}>
                    <Image
                        src="/images/wasabi-stems.jpg"
                        radius="lg"
                        alt="Fresh Wasabi Stems"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', height: 'auto' }}
                    />
                </div>

                {/* Right Column: Content */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <Stack gap="lg">
                        <Title order={3} size="h3">Unique & Versatile</Title>
                        <Text size="md" lh={1.6}>
                            {t('prod_fresh_p3_detail')}
                        </Text>

                        <List
                            spacing="sm"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="teal" size={20} radius="xl">
                                    <IconCheck style={{ width: 12, height: 12 }} />
                                </ThemeIcon>
                            }
                            mt="xl"
                        >
                            <List.Item>매일 아침 당일 수확 및 발송</List.Item>
                            <List.Item>독보적인 아삭한 식감 (궁채나물 유사)</List.Item>
                            <List.Item>길이 20~30cm 규격 선별</List.Item>
                            <List.Item>장아찌, 면 요리 토핑, 특제 소스용</List.Item>
                        </List>
                    </Stack>
                </div>
            </div>
        </Container>
    );
}
