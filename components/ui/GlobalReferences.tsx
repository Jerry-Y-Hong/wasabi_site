'use client';

import { Container, Title, Text, SimpleGrid, Card, Badge, Button, ThemeIcon, Group, Stack } from '@mantine/core';
import { IconCircleCheck, IconDownload, IconExternalLink, IconFileText, IconMessage } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';
import classes from './GlobalReferences.module.css';

export default function GlobalReferences() {
    const { t } = useTranslation();

    return (
        <section className={classes.root}>
            <Container size="lg">
                <Title className={classes.title}>
                    {t('global_ref_title')}
                </Title>
                <Text className={classes.subtitle}>
                    {t('global_ref_subtitle')}
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={40}>
                    {/* Australia Project Card */}
                    <Card radius="xl" className={`${classes.card} animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
                        <Stack gap="xs">
                            <Group justify="space-between" align="center" mb="md">
                                <ThemeIcon size={58} radius="xl" variant="gradient" gradient={{ from: 'wasabi.4', to: 'wasabi.7' }}>
                                    <IconCircleCheck size={32} />
                                </ThemeIcon>
                                <Badge size="lg" radius="sm" variant="dot" color="wasabi" className={classes.status}>
                                    {t('global_ref_au_status')}
                                </Badge>
                            </Group>
                            <Title order={3} className={classes.cardTitle}>
                                {t('global_ref_au_title')}
                            </Title>
                            <Text c="dimmed" fz="md" style={{ lineHeight: 1.6 }}>
                                {t('global_ref_au_desc')}
                            </Text>
                        </Stack>

                        <div className={classes.downloadGroup}>
                            <Button
                                leftSection={<IconExternalLink size={18} />}
                                variant="light"
                                color="wasabi"
                                radius="md"
                                size="md"
                                fullWidth
                                className={classes.downloadButton}
                            >
                                {t('global_ref_btn_view')}
                            </Button>
                            <Button
                                leftSection={<IconDownload size={18} />}
                                variant="outline"
                                color="gray"
                                radius="md"
                                size="md"
                                fullWidth
                                className={classes.downloadButton}
                            >
                                {t('global_ref_btn_download')}
                            </Button>
                        </div>
                    </Card>

                    {/* Technical Consultation Card */}
                    <Card radius="xl" className={`${classes.card} animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
                        <Stack gap="xs">
                            <Group justify="space-between" align="center" mb="md">
                                <ThemeIcon size={58} radius="xl" variant="gradient" gradient={{ from: 'blue.4', to: 'cyan.7' }}>
                                    <IconFileText size={32} />
                                </ThemeIcon>
                                <Badge size="lg" radius="sm" variant="dot" color="blue" className={classes.status}>
                                    {t('global_ref_consult_status')}
                                </Badge>
                            </Group>
                            <Title order={3} className={classes.cardTitle}>
                                {t('global_ref_consult_title')}
                            </Title>
                            <Text c="dimmed" fz="md" style={{ lineHeight: 1.6 }}>
                                {t('global_ref_consult_desc')}
                            </Text>
                        </Stack>

                        <div className={classes.downloadGroup}>
                            <Button
                                leftSection={<IconMessage size={18} />}
                                variant="light"
                                color="blue"
                                radius="md"
                                size="md"
                                fullWidth
                                className={classes.downloadButton}
                            >
                                {t('global_ref_btn_contact')}
                            </Button>
                            <Button
                                leftSection={<IconExternalLink size={18} />}
                                variant="outline"
                                color="gray"
                                radius="md"
                                size="md"
                                fullWidth
                                className={classes.downloadButton}
                            >
                                {t('global_ref_btn_learn')}
                            </Button>
                        </div>
                    </Card>
                </SimpleGrid>
            </Container>
        </section>
    );
}
