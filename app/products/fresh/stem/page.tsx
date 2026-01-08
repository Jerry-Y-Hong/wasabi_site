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
                            <List.Item>{t('prod_fresh_stem_1')}</List.Item>
                            <List.Item>{t('prod_fresh_stem_2')}</List.Item>
                            <List.Item>{t('prod_fresh_stem_3')}</List.Item>
                            <List.Item>{t('prod_fresh_stem_4')}</List.Item>
                        </List>
                    </Stack>
                </div>
            </div>
        </Container>
    );
}
