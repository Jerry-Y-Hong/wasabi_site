'use client';

import { Container, Title, Text, SimpleGrid, ThemeIcon, Paper, Image, Stack, Box, Tabs, List, Badge, Group, Divider } from '@mantine/core';
import { IconFlask, IconMist, IconCpu, IconBox, IconCheck } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

export default function CultivationPage() {
    const { t } = useTranslation();

    return (
        <Box>
            {/* Hero Section */}
            <Box bg="dark.8" py={80} style={{ borderBottom: '1px solid #373a40' }}>
                <Container size="lg">
                    <Stack align="center" gap="xs">
                        <Badge color="wasabi" variant="filled" size="lg">{t('cult_hero_badge')}</Badge>
                        <Title c="white" order={1} size={42} ta="center">{t('cult_hero_title')}</Title>
                        <Text c="gray.4" ta="center" maw={800} size="lg">
                            {t('cult_hero_desc')}
                        </Text>
                    </Stack>
                </Container>
            </Box>

            <Container size="lg" py={60}>
                <Tabs defaultValue="lab" color="wasabi" variant="pills" radius="md">
                    <Tabs.List justify="center" mb={50}>
                        <Tabs.Tab value="lab" leftSection={<IconFlask size={18} />} p="md">{t('cult_tab_1')}</Tabs.Tab>
                        <Tabs.Tab value="cultivate" leftSection={<IconMist size={18} />} p="md">{t('cult_tab_2')}</Tabs.Tab>
                        <Tabs.Tab value="control" leftSection={<IconCpu size={18} />} p="md">{t('cult_tab_3')}</Tabs.Tab>
                        <Tabs.Tab value="process" leftSection={<IconBox size={18} />} p="md">{t('cult_tab_4')}</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="lab">
                        <ProcessStage
                            title={t('cult_stage_1_title')}
                            subtitle={t('cult_stage_1_subtitle')}
                            description={t('cult_stage_1_desc')}
                            image="/images/tissue-culture.jpg"
                            features={[
                                t('cult_stage_1_feat_1'),
                                t('cult_stage_1_feat_2'),
                                t('cult_stage_1_feat_3'),
                                t('cult_stage_1_feat_4')
                            ]}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="cultivate">
                        <ProcessStage
                            title={t('cult_stage_2_title')}
                            subtitle={t('cult_stage_2_subtitle')}
                            description={t('cult_stage_2_desc')}
                            image="/images/smart-farm-interior.jpg"
                            features={[
                                t('cult_stage_1_feat_1'), // Reusing some logical keys if needed, but dictionary has specific ones usually
                                t('cult_stage_1_feat_2'),
                                t('cult_stage_1_feat_3'),
                                t('cult_stage_1_feat_4')
                            ]}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="control">
                        <ProcessStage
                            title={t('cult_stage_3_title')}
                            subtitle={t('cult_stage_3_subtitle')}
                            description={t('cult_stage_3_desc')}
                            image="/images/smart_farm_control_room.png"
                            features={[
                                t('cult_stage_1_feat_1'),
                                t('cult_stage_1_feat_2'),
                                t('cult_stage_1_feat_3'),
                                t('cult_stage_1_feat_4')
                            ]}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="process">
                        <ProcessStage
                            title={t('cult_stage_4_title')}
                            subtitle={t('cult_stage_4_subtitle')}
                            description={t('cult_stage_4_desc')}
                            image="/images/smart_farm_processing_plant.png"
                            features={[
                                t('cult_stage_1_feat_1'),
                                t('cult_stage_1_feat_2'),
                                t('cult_stage_1_feat_3'),
                                t('cult_stage_1_feat_4')
                            ]}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </Box>
    );
}

function ProcessStage({ title, subtitle, description, image, features }: { title: string, subtitle: string, description: string, image: string, features: string[] }) {
    const { t } = useTranslation();
    return (
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', padding: 'var(--mantine-spacing-xl) 0' }}>
            {/* Left Column: Image (Fixed 300px) */}
            <div style={{ flex: '0 0 300px' }}>
                <Paper shadow="xl" radius="lg" withBorder style={{ overflow: 'hidden' }}>
                    <Image
                        src={image}
                        alt={title}
                        fallbackSrc="https://placehold.co/600x400?text=K-Farm+Technology"
                        w="100%"
                        h="auto"
                    />
                </Paper>
            </div>

            {/* Right Column: Content */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <Badge color="wasabi" variant="light" mb="xs">{subtitle}</Badge>
                <Title order={2} mb="md">{title}</Title>
                <Text c="dimmed" size="lg" mb="xl" style={{ lineHeight: 1.6 }}>
                    {description}
                </Text>

                <List
                    spacing="sm"
                    size="md"
                    center
                    icon={
                        <ThemeIcon color="wasabi" size={24} radius="xl">
                            <IconCheck size={16} />
                        </ThemeIcon>
                    }
                >
                    {features.map((f, i) => (
                        <List.Item key={i}><Text fw={500}>{f}</Text></List.Item>
                    ))}
                </List>
            </div>
        </div>
    )
}
