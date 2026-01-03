'use client';

import { Container, Title, Text, Image, Card, SimpleGrid, ThemeIcon, List, Stack, Button } from '@mantine/core';
import { IconCheck, IconFlask, IconPlant, IconShieldCheck, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
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
                <FeatureCard
                    icon={IconFlask}
                    title={t('prod_seed_card_1_title')}
                    description={t('prod_seed_card_1_desc')}
                    link="/products/seedlings/lab"
                    btnText={t('prod_seed_btn_detail')}
                    color="wasabi"
                />
                <FeatureCard
                    icon={IconPlant}
                    title={t('prod_seed_card_2_title')}
                    description={t('prod_seed_card_2_desc')}
                    link="/products/seedlings/acclimatization"
                    btnText={t('prod_seed_btn_detail')}
                    color="cyan"
                />
                <FeatureCard
                    icon={IconShieldCheck}
                    title={t('prod_seed_card_3_title')}
                    description={t('prod_seed_card_3_desc')}
                    link="/products/seedlings/qc"
                    btnText={t('prod_seed_btn_detail')}
                    color="grape"
                />
            </SimpleGrid>
        </Container>
    );
}

function FeatureCard({ icon: Icon, title, description, link, btnText, color }: { icon: any, title: string, description: string, link: string, btnText: string, color: string }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ThemeIcon variant="light" size={40} radius="md" color={color} mb="md">
                <Icon style={{ width: 24, height: 24 }} stroke={1.5} />
            </ThemeIcon>
            <Title order={3} mb="xs" size="h4">{title}</Title>
            <Text c="dimmed" size="sm" mb="md" style={{ flex: 1, lineHeight: 1.5 }}>
                {description}
            </Text>
            <Button component={Link} href={link} variant="light" color={color} fullWidth mt="auto" size="sm" rightSection={<IconArrowLeft style={{ transform: 'rotate(180deg)' }} size={14} />}>
                {btnText}
            </Button>
        </Card>
    );
}
