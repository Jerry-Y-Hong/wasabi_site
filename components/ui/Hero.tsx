'use client';

import { Title, Text, Container, Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classes from './Hero.module.css';
import { useTranslation } from '@/lib/i18n';

export function Hero() {
    const { t } = useTranslation();
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Dynamic Telemetry State
    const [telemetry, setTelemetry] = useState({
        ppfd: 450.2,
        ec: 1.82,
        ph: 6.21
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                ppfd: Number((prev.ppfd + (Math.random() * 2 - 1)).toFixed(1)),
                ec: Number((prev.ec + (Math.random() * 0.04 - 0.02)).toFixed(2)),
                ph: Number((prev.ph + (Math.random() * 0.02 - 0.01)).toFixed(2))
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const toggleSound = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

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
                        boxShadow: '0 0 30px rgba(64, 192, 87, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '2px solid rgba(64, 192, 87, 0.3)',
                        width: '100%',
                        position: 'relative',
                        background: '#000'
                    }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                display: 'block',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                                filter: 'brightness(1.1) contrast(1.1)'
                            }}
                        >
                            <source src="/videos/main_hero_global.mp4?v=20260102_v1" type="video/mp4" />
                        </video>

                        {/* --- HIGH-TECH HUD OVERLAY (MAKEUP) --- */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 5,
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {/* Corner Brackets */}
                            <div style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderTop: '2px solid #40c057', borderLeft: '2px solid #40c057' }} />
                            <div style={{ position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderTop: '2px solid #40c057', borderRight: '2px solid #40c057' }} />
                            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 30, height: 30, borderBottom: '2px solid #40c057', borderLeft: '2px solid #40c057' }} />
                            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, borderBottom: '2px solid #40c057', borderRight: '2px solid #40c057' }} />

                            {/* Scanning Line */}
                            <div className="scanning-line" style={{
                                position: 'absolute',
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: 'linear-gradient(to right, transparent, rgba(64, 192, 87, 0.5), transparent)',
                                boxShadow: '0 0 15px #40c057',
                                animation: 'scan 4s linear infinite'
                            }} />

                            {/* Data Readouts */}
                            <div style={{ position: 'absolute', top: 30, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#40c057', textShadow: '0 0 5px #40c057' }}>
                                <div style={{ animation: 'pulser 2s infinite' }}>● SYSTEM ONLINE</div>
                                <div style={{ marginTop: 4 }}>LOC: HWACHEON_01</div>
                                <div style={{ marginTop: 2 }}>DATA_STREAM: ACTIVE</div>
                            </div>

                            <div style={{ position: 'absolute', bottom: 60, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#40c057' }}>
                                <div>PPFD: {telemetry.ppfd} μmol/m²/s</div>
                                <div>EC: {telemetry.ec} mS/cm</div>
                                <div>pH: {telemetry.ph}</div>
                            </div>

                            {/* Center Target */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 40,
                                height: 40,
                                border: '1px solid rgba(64, 192, 87, 0.3)',
                                borderRadius: '50%'
                            }}>
                                <div style={{ position: 'absolute', top: '50%', left: '-5px', right: '-5px', height: '1px', background: 'rgba(64, 192, 87, 0.3)' }} />
                                <div style={{ position: 'absolute', left: '50%', top: '-5px', bottom: '-5px', width: '1px', background: 'rgba(64, 192, 87, 0.3)' }} />
                            </div>
                        </div>

                        {/* Glass reflection effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(120deg, rgba(255,255,255,0.05) 0%, transparent 40%)',
                            pointerEvents: 'none',
                            zIndex: 6
                        }} />

                        {/* Sound Toggle Button */}
                        <Tooltip label={isMuted ? "Enable Sound" : "Mute Sound"} position="left">
                            <ActionIcon
                                variant="filled"
                                color="wasabi"
                                size="xl"
                                radius="xl"
                                onClick={toggleSound}
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '20px',
                                    zIndex: 10,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    opacity: 0.8
                                }}
                            >
                                {isMuted ? <IconVolumeOff size={24} /> : <IconVolume size={24} />}
                            </ActionIcon>
                        </Tooltip>
                    </div>
                </div>
            </Container>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                @keyframes pulser {
                    0% { opacity: 0.4; }
                    50% { opacity: 1; }
                    100% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
