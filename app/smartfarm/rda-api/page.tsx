'use client';

import { Container, Title, Text, Button, Group, Box, ThemeIcon } from '@mantine/core';
import { IconApi, IconChevronLeft } from '@tabler/icons-react';
import Link from 'next/link';

import { useTranslation } from '@/lib/i18n';

export default function RdaApiPage() {
    const { t } = useTranslation();

    return (
        <Container size="md" py="xl">
            <Box style={{
                padding: 'var(--mantine-spacing-xl)',
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: 'var(--mantine-color-gray-0)',
                textAlign: 'center',
                border: '1px dashed var(--mantine-color-blue-4)'
            }}>
                <ThemeIcon size={60} radius="xl" color="blue" mb="md">
                    <IconApi size={35} />
                </ThemeIcon>

                <Title order={1} mb="sm">{t('rda_title')}</Title>
                <Text size="lg" c="dimmed" mb="xl">
                    {t('rda_desc')}<br />
                    {t('rda_guide')}
                </Text>

                <Group justify="center">
                    <Button component={Link} href="/smartfarm" variant="light" leftSection={<IconChevronLeft size={16} />}>
                        {t('rda_back')}
                    </Button>
                </Group>
            </Box>
        </Container>
    );
}
