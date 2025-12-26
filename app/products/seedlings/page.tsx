'use client';

import { Container, Title, Text, Image, Checkbox, Card, SimpleGrid, Group, ThemeIcon, List } from '@mantine/core';
import { IconCheck, IconFlask, IconPlant, IconShieldCheck } from '@tabler/icons-react';

export default function SeedlingsPage() {
    return (
        <Container size="xl" py="xl">
            <Title order={1} ta="center" mb="xl">
                High-Quality Tissue Culture Seedlings
            </Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} verticalSpacing={50}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        src="/images/tissue-culture.jpg"
                        radius="md"
                        alt="Tissue Culture Lab"
                        max-width="100%"
                    />
                </div>
                <div>
                    <Title order={2} mb="md">Elite Virus-Free Seedlings</Title>
                    <Text c="dimmed" mb="lg">
                        Our specialized tissue culture laboratory produces high-quality "無病묘" (virus-free seedlings).
                        By utilizing advanced biotechnology in a sterile environment, we ensure genetic stability and
                        robustness, enabling a stable, year-round supply system that is independent of seasonal changes.
                    </Text>

                    <List
                        spacing="sm"
                        size="lg"
                        center
                        icon={
                            <ThemeIcon color="wasabi" size={24} radius="xl">
                                <IconCheck style={{ width: 14, height: 14 }} />
                            </ThemeIcon>
                        }
                    >
                        <List.Item>Virus-Free Guarantee</List.Item>
                        <List.Item>Genetic Uniformity</List.Item>
                        <List.Item>High Survival Rate</List.Item>
                        <List.Item>Year-Round Production</List.Item>
                    </List>
                </div>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt={80}>
                <Feature
                    icon={IconFlask}
                    title="Advanced Lab"
                    description="State-of-the-art sterile environments for initiation and multiplication."
                />
                <Feature
                    icon={IconPlant}
                    title="Acclimatization"
                    description="Rigorous hardening process to ensure success in vertical farm systems."
                />
                <Feature
                    icon={IconShieldCheck}
                    title="Quality Control"
                    description="Every batch is tested for purity and vigor before shipping."
                />
            </SimpleGrid>
        </Container>
    );
}

function Feature({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <ThemeIcon variant="light" size={40} radius="md" color="wasabi">
                <Icon style={{ width: 24, height: 24 }} stroke={1.5} />
            </ThemeIcon>
            <Text mt="md" fw={500}>{title}</Text>
            <Text c="dimmed" size="sm" mt="sm">{description}</Text>
        </Card>
    );
}
