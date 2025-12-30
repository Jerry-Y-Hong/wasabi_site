'use client';

import { Container, Title, Text, Image, Card, SimpleGrid, ThemeIcon, List } from '@mantine/core';
import { IconCheck, IconFlask, IconPlant, IconShieldCheck } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

export default function SeedlingsPage() {
    const { t } = useTranslation();

    return (
        <Container size="xl" py="xl">
            <Title order={1} ta="center" mb="xl">
                {t('prod_seed_title')}
            </Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} verticalSpacing={50}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        src="/images/seedlings-lab.jpg"
                        radius="md"
                        alt="High-Tech Research Lab"
                        style={{ border: '4px solid var(--mantine-color-wasabi-light)' }}
                    />
                </div>
                <div>
                    <Title order={2} mb="md">{t('prod_seed_subtitle')}</Title>
                    <Text c="dimmed" mb="lg">
                        {t('prod_seed_desc_1')}
                    </Text>
                    <Text c="dimmed" mb="lg">
                        {t('prod_seed_desc_2')}
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
                        <List.Item>{t('prod_seed_feat_1')}</List.Item>
                        <List.Item>{t('prod_seed_feat_2')}</List.Item>
                        <List.Item>{t('prod_seed_feat_3')}</List.Item>
                        <List.Item>{t('prod_seed_feat_4')}</List.Item>
                    </List>
                </div>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt={80}>
                <Feature
                    icon={IconFlask}
                    title={t('prod_seed_card_1_title')}
                    description={t('prod_seed_card_1_desc')}
                />
                <Feature
                    icon={IconPlant}
                    title={t('prod_seed_card_2_title')}
                    description={t('prod_seed_card_2_desc')}
                />
                <Feature
                    icon={IconShieldCheck}
                    title={t('prod_seed_card_3_title')}
                    description={t('prod_seed_card_3_desc')}
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
