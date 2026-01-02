'use client';

import { Title, Text, Container, Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconVolume, IconVolumeOff, IconMovie, IconSettings, IconBrandYoutube } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classes from './Hero.module.css';
import { useTranslation } from '@/lib/i18n';

export function Hero() {
    const { t } = useTranslation();
    const [isMuted, setIsMuted] = useState(true);
    const [videoMode, setVideoMode] = useState<'brand' | 'tech' | 'market'>('brand');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Dynamic Telemetry State
    const [telemetry, setTelemetry] = useState({
        ppfd: 450.2,
        ec: 1.82,
        ph: 6.21,
        co2: 800,
        flow: 1.2,
        humidity: 65
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                ppfd: Number((prev.ppfd + (Math.random() * 2 - 1)).toFixed(1)),
                ec: Number((prev.ec + (Math.random() * 0.04 - 0.02)).toFixed(2)),
                ph: Number((prev.ph + (Math.random() * 0.02 - 0.01)).toFixed(2)),
                co2: Math.floor(prev.co2 + (Math.random() * 10 - 5)),
                flow: Number((prev.flow + (Math.random() * 0.1 - 0.05)).toFixed(2)),
                humidity: Math.floor(prev.humidity + (Math.random() * 4 - 2))
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '800px', marginRight: '2rem' }}>

                    {/* Mode Toggle Buttons */}
                    <Group gap="xs" mb="md" style={{ width: '100%', justifyContent: 'flex-start' }}>
                        <Button
                            variant={videoMode === 'brand' ? 'filled' : 'outline'}
                            color="wasabi"
                            size="xs"
                            radius="xl"
                            onClick={() => setVideoMode('brand')}
                            leftSection={<IconMovie size={14} />}
                        >
                            BRAND FILM
                        </Button>
                        <Button
                            variant={videoMode === 'tech' ? 'filled' : 'outline'}
                            color="wasabi"
                            size="xs"
                            radius="xl"
                            onClick={() => setVideoMode('tech')}
                            leftSection={<IconSettings size={14} />}
                        >
                            TECH INSIGHT
                        </Button>
                        <Button
                            variant={videoMode === 'market' ? 'filled' : 'outline'}
                            color="wasabi"
                            size="xs"
                            radius="xl"
                            onClick={() => setVideoMode('market')}
                            leftSection={<IconBrandYoutube size={14} />}
                        >
                            GLOBAL STANDARD
                        </Button>
                    </Group>

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
                            key={videoMode}
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
                                filter: videoMode === 'tech' ? 'brightness(1.2) contrast(1.2) saturate(1.1)' :
                                    videoMode === 'market' ? 'brightness(1.1) saturate(1.2)' :
                                        'brightness(1.1) contrast(1.1)'
                            }}
                        >
                            <source src={
                                videoMode === 'brand' ? "/videos/main_hero_global.mp4?v=20260102_v1" :
                                    videoMode === 'tech' ? "/videos/main_hero_tech.mp4?v=20260102_tech" :
                                        "/videos/main_hero_global.mp4?v=20260102_market" // Placeholder for 3rd video
                            } type="video/mp4" />
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
                            <div style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderTop: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderLeft: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />
                            <div style={{ position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderTop: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderRight: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />
                            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 30, height: 30, borderBottom: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderLeft: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />
                            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, borderBottom: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderRight: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />

                            {/* Scanning Line */}
                            <div className="scanning-line" style={{
                                position: 'absolute',
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: `linear-gradient(to right, transparent, ${videoMode === 'tech' ? 'rgba(81, 207, 102, 0.7)' : 'rgba(64, 192, 87, 0.5)'}, transparent)`,
                                boxShadow: `0 0 15px ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`,
                                animation: videoMode === 'tech' ? 'scan 2.5s linear infinite' : 'scan 4s linear infinite'
                            }} />

                            {/* Data Readouts - Left Top */}
                            <div style={{ position: 'absolute', top: 30, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#51cf66', textShadow: '0 0 5px #40c057' }}>
                                <div style={{ animation: 'pulser 2s infinite', fontWeight: 'bold' }}>
                                    ● {videoMode === 'tech' ? 'LABORATORY MODE' :
                                        videoMode === 'market' ? 'COMMERCIAL TRACEABILITY' : 'SYSTEM ONLINE'}
                                </div>
                                <div style={{ marginTop: 4 }}>LOC: HWACHEON_01</div>
                                <div style={{ marginTop: 2 }}>{videoMode === 'market' ? 'GLOBAL_CERT: ISO9001' : 'ENCRYPTED_LINK: SECURE'}</div>
                                {videoMode === 'tech' && <div style={{ marginTop: 2, color: '#abd5bd' }}>SCANNING_MOLECULAR_STRUCTURE...</div>}
                                {videoMode === 'market' && <div style={{ marginTop: 2, color: '#abd5bd' }}>DISTRIBUTION_STATUS: ON_AIR</div>}
                            </div>

                            {/* Data Readouts - Left Bottom */}
                            <div style={{ position: 'absolute', bottom: 60, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#51cf66' }}>
                                <div>PPFD: {telemetry.ppfd} μmol/m²/s</div>
                                <div>EC: {telemetry.ec} mS/cm</div>
                                <div>pH: {telemetry.ph}</div>
                                {videoMode === 'tech' && (
                                    <>
                                        <div style={{ marginTop: 2 }}>CO2: {telemetry.co2} ppm</div>
                                        <div style={{ marginTop: 2 }}>FLOW: {telemetry.flow} L/min</div>
                                    </>
                                )}
                            </div>

                            {/* Tech-Specific Overlay Elements */}
                            {videoMode === 'tech' && (
                                <>
                                    {/* Molecular Pattern Drawing (Simple CSS visualization) */}
                                    <div style={{ position: 'absolute', top: 30, right: 60, width: 80, height: 80, opacity: 0.4 }}>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 1, background: '#51cf66', rotate: '30deg' }} />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 1, background: '#51cf66', rotate: '-30deg' }} />
                                        <div style={{ position: 'absolute', top: '25%', left: '42%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                        <div style={{ position: 'absolute', bottom: '25%', left: '42%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                        <div style={{ position: 'absolute', top: '46%', left: '20%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                        <div style={{ position: 'absolute', top: '46%', right: '20%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                        <div style={{ fontSize: '8px', position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>C10H20O</div>
                                    </div>

                                    {/* Scanning Box Detail */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '20%',
                                        right: '15%',
                                        width: '120px',
                                        height: '60px',
                                        border: '1px solid rgba(81, 207, 102, 0.4)',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        padding: '5px'
                                    }}>
                                        <div style={{ color: '#51cf66', fontSize: '8px', borderBottom: '1px solid rgba(81, 207, 102, 0.4)', paddingBottom: '2px' }}>REAL-TIME ANALYSIS</div>
                                        <div style={{ display: 'flex', gap: '2px', marginTop: '5px' }}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                                <div key={i} style={{
                                                    flex: 1,
                                                    height: Math.random() * 20 + 5 + 'px',
                                                    background: '#51cf66',
                                                    opacity: Math.random() * 0.5 + 0.3
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Center Target */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: videoMode === 'tech' ? 60 : 40,
                                height: videoMode === 'tech' ? 60 : 40,
                                border: '1px solid rgba(81, 207, 102, 0.4)',
                                borderRadius: '50%'
                            }}>
                                <div style={{ position: 'absolute', top: '50%', left: '-10px', right: '-10px', height: '1px', background: 'rgba(81, 207, 102, 0.4)' }} />
                                <div style={{ position: 'absolute', left: '50%', top: '-10px', bottom: '-10px', width: '1px', background: 'rgba(81, 207, 102, 0.4)' }} />
                                {videoMode === 'tech' && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: '10px',
                                        border: '1px dashed rgba(81, 207, 102, 0.3)',
                                        borderRadius: '50%',
                                        animation: 'rotate 10s linear infinite'
                                    }} />
                                )}
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
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
