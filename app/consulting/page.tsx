'use client';

import { Container, Title, Text, Accordion, Button, Center, Box, Grid } from '@mantine/core';
import Link from 'next/link';

export default function ConsultingPage() {
    return (
        <Container size="xl" py="xl">
            <Box ta="center" mb={60} bg="var(--mantine-color-gray-0)" p="xl" style={{ borderRadius: 'var(--mantine-radius-lg)' }}>
                <Title order={1} mb="md">Smart Farm Consulting</Title>
                <Text c="dimmed" maw={600} mx="auto" mb="xl">
                    Interested in starting your own Wasabi Smart Farm? We offer end-to-end consulting services, from facility design to operational training.
                </Text>
                <Link href="/consulting/inquiry">
                    <Button size="lg" color="wasabi" variant="gradient" gradient={{ from: 'wasabi', to: 'lime' }}>
                        Request a Consultation
                    </Button>
                </Link>
            </Box>

            <Grid gutter={50}>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Title order={2} mb="lg">Our Services</Title>
                    <Accordion variant="separated" radius="md">
                        <Accordion.Item value="design">
                            <Accordion.Control>Facility Design & AI Integration</Accordion.Control>
                            <Accordion.Panel>Custom blueprints for Aeroponic vertical farms, integrated with AI environmental control systems and IoT monitoring for optimal 12-15°C regulation.</Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="setup">
                            <Accordion.Control>Hardware & Aeroponic Systems</Accordion.Control>
                            <Accordion.Panel>Installation of high-pressure mist systems, nutrient delivery hardware, and specialized lighting optimized for wasabi's low-lux requirements.</Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="training">
                            <Accordion.Control>Technology Transfer & Training</Accordion.Control>
                            <Accordion.Panel>Direct transfer of cultivation know-how, including tissue culture seedling management, nutrient recipes, and disease prevention protocols.</Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="roi">
                            <Accordion.Control>ROI & Business Strategy</Accordion.Control>
                            <Accordion.Panel>Financial modeling for a 3-5 year ROI, including advice on high-value processing (pastes, oils) and purchase guarantee (contract farming) options.</Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Box style={{ borderLeft: '4px solid var(--mantine-color-wasabi-5)', paddingLeft: 20 }}>
                        <Title order={3} mb="sm">Success Stories</Title>
                        <Text c="dimmed" mb="md">
                            "Thanks to Wasabi Smart Farm's consulting, we were able to launch our facility in under 6 months and achieved profitability in the first year."
                        </Text>
                        <Text fw={700}>- Green Leaf Farms, Oregon</Text>
                    </Box>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
