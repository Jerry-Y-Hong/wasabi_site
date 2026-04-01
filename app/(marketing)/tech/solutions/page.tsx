'use client';

import { Container, Title, Text, Button, Group, SimpleGrid, Card, Badge, ThemeIcon, Box, Stack } from '@mantine/core';
import { IconCpu, IconPlant, IconBuildingFactory, IconMicroscope, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function SolutionsPage() {
    const { t } = useTranslation();

    return (
        <Box style={{
            background: 'var(--bg-gradient-wasabi)',
            backgroundColor: '#f8fdf0',
            minHeight: '100vh'
        }}>
            <Container size="xl" py={120}>
                {/* Hero Section */}
                <Stack align="center" mb={100} className="animate-fade-in-up">
                    <Badge size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md" py="lg">
                        R&D & TECHNOLOGY
                    </Badge>
                    <Title ta="center" size={64} fw={900} mb="xl" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        {t('unit_aero_title')}
                    </Title>
                    <Text ta="center" size="xl" c="dimmed" maw={800} style={{ lineHeight: 1.6 }}>
                        {t('sol_subtitle')}
                    </Text>
                </Stack>

                {/* Main Cards Section */}
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40} mb={150}>
                    {([
                        { title: 'sol_card_sf_title', desc: 'sol_card_sf_desc', icon: <IconCpu size={32} />, color: 'blue' },
                        { title: 'sol_card_multi_title', desc: 'sol_card_multi_desc', icon: <IconPlant size={32} />, color: 'teal' },
                        { title: 'sol_card_rnd_title', desc: 'sol_card_rnd_desc', icon: <IconMicroscope size={32} />, color: 'grape' },
                        { title: 'sol_card_robot_title', desc: 'sol_card_robot_desc', icon: <IconBuildingFactory size={32} />, color: 'orange' },
                    ] as const).map((item, index) => (
                        <Card
                            key={index}
                            padding={40}
                            radius="xl"
                            withBorder
                            className="feature-card-hover animate-fade-in-up"
                            style={{
                                animationDelay: `${index * 0.1}s`,
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <ThemeIcon
                                size={70}
                                radius="xl"
                                variant="gradient"
                                gradient={{ from: item.color, to: `${item.color}.4` }}
                                mb="xl"
                            >
                                {item.icon}
                            </ThemeIcon>
                            <Title order={3} mb="md" fw={800}>
                                {t(item.title)}
                            </Title>
                            <Text size="lg" c="dimmed" style={{ lineHeight: 1.6 }}>
                                {t(item.desc)}
                            </Text>
                        </Card>
                    ))}
                </SimpleGrid>

                {/* PLANT Section */}
                <Box mb={150} className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Title order={2} ta="center" mb={60} size={42} fw={900}>
                        {t('plant_title')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="xl">
                        {['p', 'l', 'a', 'n', 't'].map((key) => (
                            <Card
                                key={key}
                                withBorder
                                padding="xl"
                                radius="lg"
                                className="feature-card-hover"
                                style={{
                                    borderTop: '4px solid var(--mantine-color-green-5)',
                                    background: 'white'
                                }}
                            >
                                <Text fz="24" fw={950} c="green" mb="md" ta="center">
                                    {t(`plant_${key}_title`)}
                                </Text>
                                <Text size="sm" c="dimmed" ta="center" style={{ lineHeight: 1.5 }}>
                                    {t(`plant_${key}_desc`)}
                                </Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>

                {/* FACTORY Section */}
                <Box className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <Title order={2} ta="center" mb={60} size={42} fw={900}>
                        {t('factory_title')}
                    </Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={30}>
                        {['f', 'a', 'c', 't', 'o', 'r'].map((key, index) => (
                            <Card
                                key={key}
                                withBorder
                                padding="xl"
                                radius="xl"
                                className="glass-card feature-card-hover"
                            >
                                <Text fz="xl" fw={900} c="blue.7" mb="sm">
                                    {t(`factory_${key}_title`)}
                                </Text>
                                <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                                    {t(`factory_${key}_desc`)}
                                </Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                </Box>

                <Group justify="center" mt={100}>
                    <Button
                        component={Link}
                        href="/"
                        size="xl"
                        variant="light"
                        radius="xl"
                        leftSection={<IconArrowRight size={22} style={{ transform: 'rotate(180deg)' }} />}
                        style={{ height: 60, paddingLeft: 40, paddingRight: 40 }}
                    >
                        {t('sol_back_btn')}
                    </Button>
                </Group>
            </Container>
        </Box >
    );
}
