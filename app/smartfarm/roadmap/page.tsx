'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    Timeline,
    ThemeIcon,
    Paper,
    Stack,
    Box,
    Button,
    Group,
    Divider,
    Badge
} from '@mantine/core';
import {
    IconRocket,
    IconFlask,
    IconDeviceAnalytics,
    IconWorldPin,
    IconChevronLeft,
    IconCalendarEvent
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function RoadmapPage() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Container size="md" py={60}>
            <Stack gap="xl">
                {/* Header Section */}
                <Box ta="center">
                    <Badge size="lg" variant="filled" color="orange" mb="sm">{t('rd_hero_badge')}</Badge>
                    <Title order={1} size={42} fw={900}>{t('rd_title')}</Title>
                    <Text size="lg" c="dimmed" mt="md" maw={600} mx="auto">
                        {t('rd_desc')}
                    </Text>
                </Box>

                <Divider my="md" />

                {/* Timeline Section */}
                <Paper withBorder p="xl" radius="lg" shadow="sm" bg="gray.0">
                    <Timeline active={1} bulletSize={40} lineWidth={3} color="orange">
                        {/* Step 1 */}
                        <Timeline.Item
                            bullet={<ThemeIcon size={32} radius="xl" color="blue"><IconFlask size={18} /></ThemeIcon>}
                            title={<Text fw={700} size="lg">{t('rd_step1_title')}</Text>}
                        >
                            <Text c="dimmed" size="sm" mt={4}>
                                {t('rd_step1_desc')}
                            </Text>
                            <Badge variant="light" color="blue" mt="xs">{t('rd_step1_badge')}</Badge>
                        </Timeline.Item>

                        {/* Step 2 */}
                        <Timeline.Item
                            bullet={<ThemeIcon size={32} radius="xl" color="orange"><IconRocket size={18} /></ThemeIcon>}
                            title={<Text fw={700} size="lg">{t('rd_step2_title')}</Text>}
                        >
                            <Text c="dimmed" size="sm" mt={4}>
                                {t('rd_step2_desc')}
                            </Text>
                            <Badge variant="filled" color="orange" mt="xs">{t('rd_step2_badge')}</Badge>
                        </Timeline.Item>

                        {/* Step 3 */}
                        <Timeline.Item
                            bullet={<ThemeIcon size={32} radius="xl" color="teal"><IconDeviceAnalytics size={18} /></ThemeIcon>}
                            title={<Text fw={700} size="lg">{t('rd_step3_title')}</Text>}
                        >
                            <Text c="dimmed" size="sm" mt={4}>
                                {t('rd_step3_desc')}
                            </Text>
                        </Timeline.Item>

                        {/* Step 4 */}
                        <Timeline.Item
                            bullet={<ThemeIcon size={32} radius="xl" color="indigo"><IconWorldPin size={18} /></ThemeIcon>}
                            title={<Text fw={700} size="lg">{t('rd_step4_title')}</Text>}
                        >
                            <Text c="dimmed" size="sm" mt={4}>
                                {t('rd_step4_desc')}
                            </Text>
                        </Timeline.Item>
                    </Timeline>
                </Paper>

                {/* Call to Action */}
                <Group justify="center" mt="xl">
                    <Button
                        component={Link}
                        href="/smartfarm"
                        variant="subtle"
                        color="gray"
                        leftSection={<IconChevronLeft size={16} />}
                    >
                        {t('sf_back')}
                    </Button>
                    <Button
                        component={Link}
                        href="/contact"
                        color="orange"
                        size="md"
                        rightSection={<IconCalendarEvent size={18} />}
                    >
                        {t('sf_contact')}
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
}
