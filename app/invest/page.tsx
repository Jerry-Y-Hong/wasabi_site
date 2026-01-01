'use client';

import { Container, Title, Text, Button, Group, Paper, Badge, ThemeIcon, Box, SimpleGrid } from '@mantine/core';
import { IconDownload, IconChartPie, IconDeviceLaptop, IconFileText, IconLeaf } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function InvestPage() {
    const { t } = useTranslation();

    return (
        <Box bg="#f8f9fa">
            {/* Header Section */}
            <Box bg="white" py={80} style={{ borderBottom: '1px solid #e9ecef' }}>
                <Container size="lg">
                    <Group justify="center" mb="lg">
                        <Badge variant="filled" color="dark" size="lg">{t('ir_badge')}</Badge>
                    </Group>
                    <Title order={1} ta="center" fw={900} style={{ fontSize: '3.5rem', letterSpacing: '-2px', lineHeight: 1.1 }}>
                        {t('ir_title')}
                    </Title>
                    <Text ta="center" mt="md" size="xl" c="dimmed" maw={700} mx="auto">
                        {t('ir_desc')}
                    </Text>

                    <Group justify="center" mt={50}>
                        <Button
                            component="a"
                            href="/wasabi_ir_deck.pdf"
                            download
                            size="xl"
                            color="wasabi"
                            rightSection={<IconDownload size={24} />}
                            style={{ boxShadow: '0 10px 20px rgba(43, 138, 62, 0.2)' }}
                        >
                            {t('ir_btn_download')}
                        </Button>
                        <Button component={Link} href="/contact" size="xl" variant="default" leftSection={<IconDeviceLaptop size={24} />}>
                            {t('ir_btn_contact')}
                        </Button>
                    </Group>
                </Container>
            </Box>

            {/* Key Metrics Section */}
            <Container size="lg" py={80}>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30}>
                    <MetricCard
                        icon={IconChartPie}
                        title={t('ir_metric_1_title')}
                        value="13.5%"
                        desc={t('ir_metric_1_desc')}
                    />
                    <MetricCard
                        icon={IconLeaf}
                        title={t('ir_metric_2_title')}
                        value="950g"
                        desc={t('ir_metric_2_desc')}
                    />
                    <MetricCard
                        icon={IconFileText}
                        title={t('ir_metric_3_title')}
                        value="12+"
                        desc={t('ir_metric_3_desc')}
                    />
                </SimpleGrid>
            </Container>

            {/* Footer CTA */}
            <Box bg="dark.9" py={60} c="white">
                <Container size="md" ta="center">
                    <Title order={3} mb="md">{t('ir_cta_title')}</Title>
                    <Text c="gray.5" mb="xl">
                        {t('ir_cta_desc')}
                    </Text>
                    <Button component="a" href="mailto:ir@k-wasabi.kr" variant="white" color="dark" size="lg">
                        {t('ir_email_label')}
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}

function MetricCard({ icon: Icon, title, value, desc }: any) {
    return (
        <Paper p="xl" radius="md" withBorder style={{ transition: 'transform 0.2s', cursor: 'default' }}>
            <ThemeIcon size={50} radius="md" variant="light" color="wasabi" mb="md">
                <Icon size={30} stroke={1.5} />
            </ThemeIcon>
            <Text size="sm" tt="uppercase" c="dimmed" fw={700}>{title}</Text>
            <Text size="3rem" fw={900} c="dark.9" style={{ lineHeight: 1 }}>{value}</Text>
            <Text mt="sm" c="gray.6">{desc}</Text>
        </Paper>
    );
}
