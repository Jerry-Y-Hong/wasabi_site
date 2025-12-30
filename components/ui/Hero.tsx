'use client';

import { Title, Text, Container, Button, Group } from '@mantine/core';
import Link from 'next/link';
import classes from './Hero.module.css';
import { useTranslation } from '@/lib/i18n';

export function Hero() {
    const { t } = useTranslation();

    return (
        <div className={classes.hero}>
            <Container size="md" className={classes.inner}>
                <Title className={classes.title}>
                    <span className={classes.highlight}>{t('hero_title_1')}</span><br />
                    <span style={{ fontSize: '0.75em', color: '#ffffff', fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        {t('hero_title_2')}
                    </span>
                </Title>

                <Text className={classes.description} mt={30} size="xl">
                    {t('hero_desc')}
                </Text>

                <Group className={classes.controls} mt={40}>
                    <Button
                        component={Link}
                        href="/admin"
                        size="lg"
                        className={classes.control}
                        color="wasabi"
                        radius="md"
                    >
                        {t('hero_btn_admin')}
                    </Button>
                    <Button
                        component={Link}
                        href="/admin/hunter"
                        variant="white"
                        size="lg"
                        className={classes.control}
                        radius="md"
                        color="wasabi.8"
                    >
                        {t('hero_btn_hunter')}
                    </Button>
                </Group>
            </Container>
        </div>
    );
}
