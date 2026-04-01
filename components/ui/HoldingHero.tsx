'use client';

import { Container, Title, Text, Button, Group, SimpleGrid, Card, ThemeIcon } from '@mantine/core';
import { IconLeaf, IconShoppingCart, IconWorld, IconArrowRight } from '@tabler/icons-react';
import classes from './HoldingHero.module.css';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function HoldingHero() {
    const { t } = useTranslation();

    return (
        <div className={classes.root}>
            <Container size="lg">
                <div className={classes.inner}>
                    <div className={classes.content}>
                        <Title className={`${classes.title} animate-fade-in-up`}>
                            {t('hero_title_1')}<br />
                            <Text component="span" inherit variant="gradient" gradient={{ from: 'green', to: 'lime' }}>
                                {t('hero_title_2')}
                            </Text>
                        </Title>
                        <Text className={`${classes.description} animate-fade-in-up`} mt={30} style={{ animationDelay: '0.1s' }}>
                            {t('hero_desc')}
                        </Text>

                        <Group mt={50} justify="center" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <Button
                                component={Link}
                                href="/admin/hunter"
                                size="xl"
                                className={classes.control}
                                variant="gradient"
                                gradient={{ from: 'green', to: 'lime' }}
                            >
                                {t('hero_btn_hunter')}
                            </Button>
                            <Button size="xl" variant="default" className={classes.control}>
                                {t('nav_contact')}
                            </Button>
                            <Button
                                component={Link}
                                href="/login"
                                size="xl"
                                variant="light"
                                color="gray"
                                className={classes.control}
                                leftSection={<IconArrowRight size={20} />}
                            >
                                {t('nav_back_to_admin')}
                            </Button>
                        </Group>
                    </div>
                </div>
            </Container>

            <Container size="xl" py={100}>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={30}>
                    {[
                        { href: '/solutions', icon: <IconLeaf size={32} />, color: 'blue', title: 'feat_2_title', desc: 'feat_2_desc', delay: '0.3s' },
                        { href: '/food', icon: <IconShoppingCart size={32} />, color: 'green', title: 'feat_3_title', desc: 'feat_3_desc', delay: '0.4s' },
                        { href: '/trade', icon: <IconWorld size={32} />, color: 'indigo', title: 'feat_4_title', desc: 'feat_4_desc', delay: '0.5s' }
                    ].map((item, index) => (
                        <Card
                            key={index}
                            component={Link}
                            href={item.href}
                            padding={40}
                            radius="xl"
                            withBorder
                            className={`${classes.card} animate-fade-in-up`}
                            style={{ animationDelay: item.delay }}
                        >
                            <ThemeIcon size={70} radius="xl" variant="light" color={item.color} mb="xl">
                                {item.icon}
                            </ThemeIcon>
                            <Text fz="xl" fw={800} className={classes.cardTitle}>
                                {t(item.title as any)}
                            </Text>
                            <Text fz="md" c="dimmed" mt="md" style={{ lineHeight: 1.6 }}>
                                {t(item.desc as any)}
                            </Text>
                            <IconArrowRight className={classes.cardIcon} size={28} />
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
        </div>
    );
}
