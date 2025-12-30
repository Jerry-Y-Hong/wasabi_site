'use client';

import { Container, Title, Text, Button, Box, SimpleGrid, Paper, ThemeIcon, List, Badge, Stack, Group, Divider } from '@mantine/core';
import { IconBuildingSkyscraper, IconWind, IconDroplet, IconCheck, IconRobot } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function ConsultingPage() {
    const { t } = useTranslation();

    return (
        <Box>
            {/* Upper Hero Section */}
            <Box bg="dark.7" py={80} style={{ borderBottom: '1px solid #373a40' }}>
                <Container size="lg">
                    <Stack align="center" gap="md">
                        <Badge color="wasabi" variant="filled" size="lg">{t('cons_hero_badge')}</Badge>
                        <Title c="white" order={1} size={42} ta="center">{t('cons_hero_title')}</Title>
                        <Text c="gray.4" ta="center" maw={800} size="lg">
                            {t('cons_hero_desc')}
                        </Text>
                        <Link href="/consulting/inquiry">
                            <Button size="lg" color="wasabi" radius="xl" mt="md">{t('cons_hero_btn')}</Button>
                        </Link>
                    </Stack>
                </Container>
            </Box>

            <Container size="lg" py={80}>
                <Title order={2} ta="center" mb={50}>{t('cons_section_title')}</Title>

                <Stack gap={40}>
                    <DetailedSolutionSection
                        icon={IconBuildingSkyscraper}
                        title={t('cons_pillar_1')}
                        color="blue"
                        groups={[
                            { label: t("cons_label_arch"), items: ["Greenhouse", "Glasshouse", "Profile", "Isolation"] },
                            { label: t("cons_label_sys"), items: ["Bed System", "Sliding Bed", "Grow Table", "Vertical Module"] },
                            { label: t("cons_label_medium"), items: ["Bio-char", "Coco-peat", "Rockwool", "Mist-zone"] }
                        ]}
                    />

                    <DetailedSolutionSection
                        icon={IconWind}
                        title={t('cons_pillar_2')}
                        color="teal"
                        groups={[
                            { label: t("cons_label_hvac_1"), items: ["Heatpump", "Boiler", "FCU", "Energy Saving"] },
                            { label: t("cons_label_hvac_2"), items: ["AHU", "Integrated Controller", "Duct System", "Filter"] },
                            { label: t("cons_label_airflow"), items: ["BLDC Fan", "Air Curtain", "Vertical Flow", "Automatic Windows"] }
                        ]}
                    />

                    <DetailedSolutionSection
                        icon={IconDroplet}
                        title={t('cons_pillar_3')}
                        color="cyan"
                        groups={[
                            { label: t("cons_label_nutrient"), items: ["Auto Feeder", "Precise Correction", "Filtration", "UV Recycling"] },
                            { label: t("cons_label_irrigation"), items: ["Mist Nozzle", "Hyper-Mist", "Dripper", "Root Control"] },
                            { label: t("cons_label_lighting"), items: ["Full Spectrum LED", "Dimming", "Lux Sensor", "Hybrid Solar"] }
                        ]}
                    />

                    <DetailedSolutionSection
                        icon={IconRobot}
                        title={t('cons_pillar_4')}
                        color="grape"
                        groups={[
                            { label: t("cons_label_software"), items: ["K-Farm OS", "Data Logging", "Mobile App", "AI Alert"] },
                            { label: t("cons_label_iot"), items: ["Sensor Nodes", "5G Gateway", "Repeater", "Motor Driver"] },
                            { label: t("cons_label_robotics"), items: ["Harvesting Robot", "Drones", "AGV", "CCTV"] }
                        ]}
                    />
                </Stack>
            </Container>

            <Divider my={60} label={t('cons_process_title')} labelPosition="center" />

            {/* Process Section */}
            <Container size="lg" py={80}>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    <ProcessStep
                        step="01"
                        title={t('cons_label_arch')}
                        desc="Climate and feasibility analysis for optimal farm type."
                    />
                    <ProcessStep
                        step="02"
                        title={t('cons_label_sys')}
                        desc="Customized blueprint from nutrient systems to AI robotics."
                    />
                    <ProcessStep
                        step="03"
                        title={t('cons_label_robotics')}
                        desc="Professional construction and operational training."
                    />
                </SimpleGrid>
            </Container>

            {/* Bottom CTA */}
            <Box bg="wasabi.0" py={60}>
                <Container size="sm" ta="center">
                    <Title order={2} mb="md">{t('cons_cta_title')}</Title>
                    <Text mb="xl" c="dimmed">
                        {t('cons_cta_desc')}
                    </Text>
                    <Group justify="center">
                        <Button component={Link} href="/consulting/inquiry" size="md" color="wasabi">{t('cons_cta_btn')}</Button>
                    </Group>
                </Container>
            </Box>
        </Box >
    );
}

function DetailedSolutionSection({ icon: Icon, title, groups, color }: { icon: any, title: string, groups: { label: string, items: string[] }[], color: string }) {
    return (
        <Paper withBorder p="xl" radius="lg" shadow="sm">
            <Group mb="xl">
                <ThemeIcon size={52} radius="md" color={color} variant="filled">
                    <Icon size={32} />
                </ThemeIcon>
                <Title order={3}>{title}</Title>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                {groups.map((group, idx) => (
                    <Stack key={idx} gap="xs">
                        <Text fw={700} size="sm" c={color} style={{ letterSpacing: 1 }}>{group.label.toUpperCase()}</Text>
                        <Divider color={color} size="xs" opacity={0.3} mb="xs" />
                        <List
                            spacing={8}
                            size="sm"
                            icon={
                                <ThemeIcon color={color} size={18} radius="xl" variant="light">
                                    <IconCheck size={12} />
                                </ThemeIcon>
                            }
                        >
                            {group.items.map((item, i) => (
                                <List.Item key={i}>
                                    <Text size="sm" fw={500}>{item}</Text>
                                </List.Item>
                            ))}
                        </List>
                    </Stack>
                ))}
            </SimpleGrid>
        </Paper>
    );
}

function ProcessStep({ step, title, desc }: { step: string, title: string, desc: string }) {
    return (
        <Paper p="xl" radius="md" withBorder bg="gray.0">
            <Text fw={900} size="xl" c="wasabi" mb="xs">{step}</Text>
            <Title order={4} mb="sm">{title}</Title>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>{desc}</Text>
        </Paper>
    );
}
