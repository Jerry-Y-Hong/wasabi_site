'use client';

import { Title, Text, Container, Button, Group } from '@mantine/core';
import Link from 'next/link';
import classes from './Hero.module.css';
import { useTranslation } from '@/lib/i18n';

export function Hero() {
    const { t } = useTranslation();

    return (
        <div className={classes.hero} style={{ background: '#1A1B1E', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle Tech Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                zIndex: 0
            }} />

            <Container size="xl" className={classes.inner} style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px' }}>

                {/* Left Side: Text Content */}
                <div style={{ flex: 1, maxWidth: '600px', marginLeft: '2rem' }}>
                    <Title className={classes.title} style={{ textAlign: 'left' }}>
                        <span className={classes.highlight}>{t('hero_title_1')}</span><br />
                        <span style={{ fontSize: '0.75em', color: '#ffffff', fontWeight: 900 }}>
                            {t('hero_title_2')}
                        </span>
                    </Title>

                    <Text className={classes.description} mt={30} size="xl" style={{ textAlign: 'left', color: '#e9ecef' }}>
                        {t('hero_desc')}
                    </Text>

                    <Group className={classes.controls} mt={40} justify="flex-start">
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
                </div>

                {/* Right Side: Video Box */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '800px', marginRight: '2rem' }}>
                    <div style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '100%',
                        position: 'relative',
                        background: '#000'
                    }}>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                display: 'block',
                                aspectRatio: '16/9',
                                objectFit: 'cover'
                            }}
                        >
                            <source src="/videos/real_drone.mp4?v=20260101_final" type="video/mp4" />
                        </video>
                        {/* Glass reflection effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
                            pointerEvents: 'none'
                        }} />
                    </div>
                </div>
            </Container>
        </div>
    );
}
