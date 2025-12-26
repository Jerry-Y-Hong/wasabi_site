'use client';

import { Container, Title, Text, SimpleGrid, ThemeIcon, Paper, Image, List, Box } from '@mantine/core';
import { IconTemperature, IconDroplet, IconBulb, IconWind } from '@tabler/icons-react';

export default function CultivationPage() {
    return (
        <Container size="xl" py="xl">
            <Box mb={50} ta="center">
                <Title order={1} mb="md">Smart Cultivation Technology</Title>
                <Text c="dimmed" maw={700} mx="auto">
                    We utilize advanced IoT sensors and vertical farming techniques to create the perfect environment for Wasabi, a typically finicky crop.
                </Text>
            </Box>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={60}>
                <Image
                    src="/images/smart-farm-interior.jpg"
                    radius="md"
                    alt="Smart Farm Interior"
                />

                <Box>
                    <Title order={3} mb="lg">Aeroponic Vertical Farming</Title>
                    <Text c="dimmed" mb="xl">
                        Wasabi is a typically finicky crop requiring cool running water.
                        Our smart farm uses advanced **Aeroponics (분무수경)** to deliver precise nutrients to the roots.
                        This technology, combined with AI environmental control, achieves **25x higher productivity**
                        and halves the growth cycle from 24 months to just 12 months.
                    </Text>

                    <SimpleGrid cols={2} spacing="lg">
                        <Parameter icon={IconTemperature} title="Temperature" value="12°C - 15°C" />
                        <Parameter icon={IconDroplet} title="Humidity" value="80% - 90%" />
                        <Parameter icon={IconBulb} title="Lighting" value="Specific Spectrum" />
                        <Parameter icon={IconWind} title="Airflow" value="Constant Circulation" />
                    </SimpleGrid>
                </Box>
            </SimpleGrid>
        </Container>
    );
}

function Parameter({ icon: Icon, title, value }: { icon: any, title: string, value: string }) {
    return (
        <Paper withBorder p="md" radius="md">
            <ThemeIcon variant="light" color="wasabi" size="lg" mb="sm">
                <Icon style={{ width: 20, height: 20 }} />
            </ThemeIcon>
            <Text fw={700} size="lg">{title}</Text>
            <Text c="dimmed">{value}</Text>
        </Paper>
    )
}
