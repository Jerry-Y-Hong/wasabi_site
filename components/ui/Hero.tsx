'use client';

import { Title, Text, Container, Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconVolume, IconVolumeOff, IconMovie, IconSettings, IconLeaf, IconWorld, IconRefresh } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classes from './Hero.module.css';
import { useTranslation } from '@/lib/i18n';

const globalSlides = [
    '/images/studio/global_scene_1.png',
    '/images/studio/global_scene_2.png',
    '/images/studio/global_scene_3.png',
    '/images/studio/global_scene_4.png',
    '/images/studio/global_scene_5.png',
];

const seedingSlides = [
    '/images/studio/seeding_scene_1.png',
    '/images/studio/seeding_scene_2.png',
    '/images/studio/seeding_scene_3.png',
    '/images/studio/seeding_scene_4.png',
];

const processSlides = [
    '/images/studio/process_scene_1.png',
    '/images/studio/process_scene_2.png',
    '/images/studio/process_scene_3.png',
    '/images/studio/process_scene_4.png',
    '/images/studio/process_scene_5.png',
    '/images/studio/process_scene_6.png',
];

const brandSlides = [
    '/images/studio/brand_scene_1.png',
    '/images/studio/brand_scene_2.png',
    '/images/studio/brand_scene_3.png',
    '/images/studio/brand_scene_4.png',
];

const techSlides = [
    '/images/studio/tech_scene_1.png',
    '/images/studio/tech_scene_2.png',
    '/images/studio/tech_scene_3.png',
    '/images/studio/tech_scene_4.png',
];

const narrations: Record<string, Record<string, string[]>> = {
    ko: {
        brand: [
            "화천의 태고적 신비와 인류의 최첨단 기술이 만나는 곳, 케이와사비는 이제 농업을 넘어선 하나의 예술이 됩니다.",
            "품격을 담은 패키지 그 이상의 가치. 케이와사비의 진정한 가치는 여러분이 보지 못하는 보이지 않는 세밀한 곳에서 완벽하게 완성됩니다.",
            "전 세계 정점에 서 있는 최고급 미슐랭 셰프들이 직접 맛보고 증명하는 단 하나의 프리미엄 와사비 브랜드, 케이와사비라는 이름의 신뢰입니다.",
            "대한민국의 맑고 정직한 신선함이 전 세계 주요 미식 거점의 식탁으로 실시간으로 전달되며 인류의 미식 지도를 새롭게 그리고 있습니다."
        ],
        tech: [
            "데이터는 절대 거짓말을 하지 않습니다. 우리는 생명이 들려주는 미세한 언어를 인텔리전스 숫자로 정밀하게 읽어내어 최적의 생태계를 구축합니다.",
            "AI 커맨드 센터는 365일 24시간 멈추지 않는 지능형 알고리즘을 통해, 매 순간 와사비의 생육 상태를 분석하고 미래의 성장을 미리 예측합니다.",
            "에어로포닉스 미세 분무 시스템은 와사비가 가장 편안하게 숨쉬고 성장할 수 있는 지구상 최적의 대기 환경을 시뮬레이션하고 실시간으로 설계합니다.",
            "딥러닝 알고리즘이 스스로 환경을 학습하고 자가 진화하는 프로세스, 이것이 바로 케이와사비가 제시하는 글로벌 미래 농업의 표준이자 핵심 기술입니다."
        ],
        global: [
            "케이와사비에게 품질이란 결코 타협의 대상이 아닙니다. 그것은 치열한 연구와 데이터 증명을 통해 얻어낸 인내와 결실의 결과물입니다.",
            "화천의 영하의 새벽 공기가 전 세계 주요 도시의 화려한 저녁 식탁이 되는 마법, 중단 없는 콜드체인 기술이 이 신선함을 완벽하게 사수합니다.",
            "모든 공정은 수치로 기록되어 투명하게 공개되며, 우리는 전 세계 고객들에게 데이터로 약속하고 신뢰로 증명하는 유일한 기준이 됩니다.",
            "뉴욕부터 도쿄, 파리까지 세계 최고의 거장 셰프들이 한목소리로 선택한 단 하나의 이름, 케이와사비는 미식의 정점을 상징합니다.",
            "우리는 농업의 물리적 국경을 허물고, 인류의 건강한 삶과 풍요로운 미래를 위한 새로운 농업의 기준을 전 세계에 심어나가겠습니다."
        ],
        seeding: [
            "모든 위대한 생명은 정교한 유전자의 설계도에서 시작됩니다. 우리는 억만 개의 세포 중 가장 강인하고 완벽한 최상의 유전체만을 엄격히 선별합니다.",
            "완벽한 무균 상태를 유지하는 바이오 랩. 121도의 고온 고압 환경에서 외부 오염 가능성을 원천 차단하여 순수한 생명의 탄생을 보호합니다.",
            "정밀 배양 제어 시스템 속에서 숙련된 바이오 공학자들이 와사비의 미래를 키워갑니다. 세포 하나하나의 움직임이 우리의 기술로 기록됩니다.",
            "무한한 확장성을 통한 인류의 미래 솔루션. 단 하나의 세포에서 시작된 생명은 거대한 수확으로 이어지며, 우리는 농업의 미래를 무한히 증식합니다."
        ],
        process: [
            "1단계 파종. 자동화 암이 정밀하게 묘를 안착시킵니다.",
            "2단계 세척. 고압 분무로 실시간 위생을 확보합니다.",
            "3단계 성장. 에어로포닉스 기술이 성장을 25배 가속합니다.",
            "4단계 제어. AI가 24시간 환경 수치를 최적화합니다.",
            "5단계 최종 세척. 수확 전 마지막 순수 정화 공정입니다.",
            "6단계 회송. 자원 가동 효율을 위해 사이클이 재시작됩니다."
        ]
    },
    en: {
        brand: [
            "Where Hwacheon's ancient mystery meets humanity's cutting-edge technology, K-Wasabi becomes more than just farming—it's an art form.",
            "More than just premium packaging. The true essence of K-Wasabi is perfected in the invisible details you might never see.",
            "The one premium wasabi brand proven and trusted by the world's master Michelin chefs sitting at the pinnacle of global gastronomy.",
            "Korea's pure and honest freshness is delivered in real-time to the world's major gourmet hotspots, redrawing the map of human fine dining."
        ],
        tech: [
            "Data never lies. We precisely decode the delicate language of life into intelligent numbers to build the ultimate biological ecosystem.",
            "The AI Command Center operates 24/7 with intelligent algorithms, analyzing the growth status of every plant and predicting future yields.",
            "The aeroponics fine-mist system simulates and designs the optimal atmospheric environment on Earth where Wasabi can breathe and grow most comfortably.",
            "Moving toward a process where deep learning algorithms learn and evolve independently—this is the core technology and standard of future farming."
        ],
        global: [
            "For K-Wasabi, quality is never a matter of compromise. It is the hard-earned result of rigorous research and data-driven proof.",
            "The magic of transformation where Hwacheon's freezing dawn becomes a lavish evening dinner in a major global city, secured by our cold-chain tech.",
            "Every process is recorded as data and disclosed transparently. We remain the only standard that promises with data and proves with trust.",
            "From New York to Tokyo and Paris, the world's legendary chefs have chosen one name. K-Wasabi stands as the ultimate symbol of taste.",
            "We will break the physical borders of agriculture and plant new global standards for the healthy lives and prosperous future of all humanity."
        ],
        seeding: [
            "Every great life begins with a sophisticated genetic blueprint. We strictly select only the strongest and most perfect genomes among billions of cells.",
            "A bio-lab maintaining absolute sterility. We block any possibility of external contamination at 121 degrees Celsius to protect the purity of birth.",
            "Experienced bio-engineers nurture the future of Wasabi within a precision culture control system, recording every single cellular movement.",
            "A future solution for humanity through infinite scalability. Life starting from a single cell leads to a thriving harvest, propagating the future."
        ],
        process: [
            "Step 1: Automated Seeding. Robotic arms precisely transplant the seedlings.",
            "Step 2: Cleaning. High-pressure mist ensures real-time hygiene.",
            "Step 3: Growth. Aeroponics technology accelerates growth by 25 times.",
            "Step 4: AI Control. Environment parameters optimized 24/7.",
            "Step 5: Final Washing. Pure purification process before the harvest.",
            "Step 6: Return Cycle. Recycling modules for maximum efficiency."
        ]
    }
};

export function Hero() {
    const { t, language } = useTranslation();
    const [isMuted, setIsMuted] = useState(true);
    const [videoMode, setVideoMode] = useState<'brand' | 'tech' | 'seeding' | 'process' | 'global'>('brand');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Image Preloading to prevent "white flash" or jutter
    useEffect(() => {
        const allImages = [...globalSlides, ...seedingSlides, ...processSlides, ...brandSlides, ...techSlides];
        allImages.forEach(src => {
            const img = new window.Image();
            img.src = src;
        });
    }, []);

    const [telemetry, setTelemetry] = useState({
        ppfd: 450.2,
        ec: 1.82,
        ph: 6.21,
        co2: 800,
        flow: 1.2,
        humidity: 65,
        export_vol: 12540,
        demand_idx: 94.2,
        sterility: 99.98,
        growth_rate: 1.42
    });

    const [activeSlide, setActiveSlide] = useState(0);

    // Narration states
    const lastSpokenRef = useRef<string>('');
    const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
    const isSpeakingRef = useRef<boolean>(false);
    const speechTaskCounterRef = useRef<number>(0);
    const watchdogRef = useRef<any>(null);

    // Keep the engine awake while speaking (Simple resume heartbeat)
    useEffect(() => {
        const interval = setInterval(() => {
            if (isSpeakingRef.current && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.resume();
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const speak = (text: string, onComplete?: () => void) => {
        if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

        // 1. Task Management: Increment ID and Clear Everything
        speechTaskCounterRef.current += 1;
        const currentTaskId = speechTaskCounterRef.current;

        window.speechSynthesis.cancel();
        if (watchdogRef.current) clearTimeout(watchdogRef.current);
        utterancesRef.current = [];
        isSpeakingRef.current = false;

        // 2. Segmenting (Periods, Commas, Exclamation, Question marks)
        const segments: string[] = [];
        let currentPos = 0;
        const regex = /[.!?,]/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const part = text.substring(currentPos, match.index + 1).trim();
            if (part.length > 1) segments.push(part);
            currentPos = match.index + 1;
        }
        if (currentPos < text.length) {
            const finalPart = text.substring(currentPos).trim();
            if (finalPart.length > 1) segments.push(finalPart);
        }

        if (segments.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        let currentIndex = 0;

        const playNext = () => {
            if (currentTaskId !== speechTaskCounterRef.current) return;
            if (watchdogRef.current) clearTimeout(watchdogRef.current);

            if (currentIndex >= segments.length) {
                isSpeakingRef.current = false;
                if (onComplete) {
                    // Safe delay after narration before moving slide
                    watchdogRef.current = setTimeout(() => {
                        if (currentTaskId === speechTaskCounterRef.current) onComplete();
                    }, 2000);
                }
                return;
            }

            // Watchdog: Force move if a chunk hangs for 10s
            watchdogRef.current = setTimeout(() => {
                if (currentTaskId === speechTaskCounterRef.current) {
                    currentIndex++;
                    playNext();
                }
            }, 10000);

            const utterance = new SpeechSynthesisUtterance(segments[currentIndex]);
            utterancesRef.current.push(utterance);

            const langMap: Record<string, string> = {
                ko: 'ko-KR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN'
            };
            utterance.lang = langMap[language] || 'en-US';
            utterance.rate = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => {
                if (currentTaskId !== speechTaskCounterRef.current) return;
                isSpeakingRef.current = true;
                window.speechSynthesis.resume();
            };

            utterance.onend = () => {
                if (currentTaskId !== speechTaskCounterRef.current) return;
                if (watchdogRef.current) clearTimeout(watchdogRef.current);
                currentIndex++;
                setTimeout(playNext, 400); // Natural breath
            };

            utterance.onerror = () => {
                if (currentTaskId !== speechTaskCounterRef.current) return;
                if (watchdogRef.current) clearTimeout(watchdogRef.current);
                currentIndex++;
                setTimeout(playNext, 100);
            };

            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
        };

        lastSpokenRef.current = text;
        // Small initial delay to ensure engine is clean
        setTimeout(playNext, 50);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                ppfd: Number((prev.ppfd + (Math.random() * 2 - 1)).toFixed(1)),
                ec: Number((prev.ec + (Math.random() * 0.04 - 0.02)).toFixed(2)),
                ph: Number((prev.ph + (Math.random() * 0.02 - 0.01)).toFixed(2)),
                co2: Math.floor(prev.co2 + (Math.random() * 10 - 5)),
                flow: Number((prev.flow + (Math.random() * 0.1 - 0.05)).toFixed(2)),
                humidity: Math.floor(prev.humidity + (Math.random() * 4 - 2)),
                export_vol: prev.export_vol + Math.floor(Math.random() * 45 + 5),
                demand_idx: Number((prev.demand_idx + (Math.random() * 0.4 - 0.2)).toFixed(1)),
                sterility: Number((99.9 + (Math.random() * 0.09)).toFixed(2)),
                growth_rate: Number((prev.growth_rate + (Math.random() * 0.02 - 0.01)).toFixed(2))
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Slideshow logic - Driven by Narration if unmuted, otherwise by Time
    useEffect(() => {
        setActiveSlide(0);
        window.speechSynthesis.cancel();

        const slideMap: Record<string, string[]> = {
            global: globalSlides,
            seeding: seedingSlides,
            process: processSlides,
            brand: brandSlides,
            tech: techSlides
        };

        const slides = slideMap[videoMode];
        if (!slides) return;

        // If muted, we need a time-based fallback to change slides
        if (isMuted) {
            const slideInterval = setInterval(() => {
                setActiveSlide(prev => (prev + 1) % slides.length);
            }, 10000);
            return () => clearInterval(slideInterval);
        }

        // If NOT muted, the narration useEffect will handle setActiveSlide via callback
    }, [videoMode, isMuted]);

    const prevSlideRef = useRef<number>(0);
    const prevModeRef = useRef<string>('');

    // Narration logic - The "Conductor" that drives slide transitions
    useEffect(() => {
        let timer: any;
        let slideTransitionTimer: any;

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            isSpeakingRef.current = false;
            speechTaskCounterRef.current += 1; // Invalidate current task
        }

        if (isMuted) {
            lastSpokenRef.current = '';
            return;
        }

        const modeJustChanged = prevModeRef.current !== videoMode;
        if (modeJustChanged && activeSlide !== 0) return;

        const langKey = narrations[language] ? language : 'en';
        const modeNarrations = narrations[langKey][videoMode];

        const slideMap: Record<string, string[]> = {
            global: globalSlides,
            seeding: seedingSlides,
            process: processSlides,
            brand: brandSlides,
            tech: techSlides
        };
        const slides = slideMap[videoMode];

        if (modeNarrations && modeNarrations[activeSlide]) {
            const targetText = modeNarrations[activeSlide];
            const isFreshStart = lastSpokenRef.current === '' || modeJustChanged;
            const delay = isFreshStart ? 400 : 1500;

            timer = setTimeout(() => {
                speak(targetText, () => {
                    // The delay is now handled inside speak's onComplete for better sync
                    if (slides) {
                        setActiveSlide(prev => (prev + 1) % slides.length);
                    }
                });
                prevModeRef.current = videoMode;
                prevSlideRef.current = activeSlide;
            }, delay);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (slideTransitionTimer) clearTimeout(slideTransitionTimer);
            if (watchdogRef.current) clearTimeout(watchdogRef.current);
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                speechTaskCounterRef.current += 1; // Invalidate current task
            }
        };
    }, [activeSlide, videoMode, isMuted, language]);

    const toggleSound = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);

        if (newMuted) {
            window.speechSynthesis.cancel();
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
                            variant={videoMode === 'seeding' ? 'filled' : 'outline'}
                            color="wasabi"
                            size="xs"
                            radius="xl"
                            onClick={() => setVideoMode('seeding')}
                            leftSection={<IconLeaf size={14} />}
                        >
                            AUTO SEEDING
                        </Button>
                        <Button
                            variant={videoMode === 'process' ? 'filled' : 'outline'}
                            color="wasabi"
                            size="xs"
                            radius="xl"
                            onClick={() => setVideoMode('process')}
                            leftSection={<IconRefresh size={14} />}
                        >
                            SUCCESS CYCLE
                        </Button>
                        <Button
                            variant={videoMode === 'global' ? 'filled' : 'outline'}
                            color="wasabi"
                            size="xs"
                            radius="xl"
                            onClick={() => setVideoMode('global')}
                            leftSection={<IconWorld size={14} />}
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
                        <div
                            key={videoMode} // Force full re-render of slides on mode change to reset animation sync
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                position: 'relative',
                                overflow: 'hidden',
                                background: '#000'
                            }}
                        >
                            {(videoMode === 'global' ? globalSlides :
                                videoMode === 'seeding' ? seedingSlides :
                                    videoMode === 'process' ? processSlides :
                                        videoMode === 'brand' ? brandSlides :
                                            techSlides).map((slide, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backgroundImage: `url(${slide})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        opacity: activeSlide === idx ? 1 : 0,
                                                        transition: 'opacity 3s ease-in-out', // Slower blend for more seamless feel
                                                        animation: 'kenburns 120s linear infinite', // Ultra-long duration to prevent reset jumps during a single loop
                                                        filter: 'brightness(1.1) saturate(1.1) contrast(1.1)'
                                                    }}
                                                />
                                            ))}
                        </div>

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
                                ● {videoMode === 'tech' ? 'LABORATORY MODE' :
                                    videoMode === 'seeding' ? 'BIO-LAB CONNECTED' :
                                        videoMode === 'process' ? 'FARM TO TABLE ACTIVATED' :
                                            videoMode === 'global' ? 'SUPPLY CHAIN ACTIVE' : 'SYSTEM ONLINE'}
                            </div>
                            <div style={{ marginTop: 4 }}>LOC: HWACHEON_01</div>
                            <div style={{ marginTop: 2 }}>{
                                videoMode === 'seeding' ? 'PROTOCOL: TISSUE_CULTURE' :
                                    videoMode === 'process' ? 'PROTOCOL: FULL_LIFECYCLE' :
                                        videoMode === 'global' ? 'MARKET_CHANNEL: WORLDWIDE' : 'ENCRYPTED_LINK: SECURE'
                            }</div>
                            <div style={{ marginTop: 2, color: '#abd5bd' }}>
                                {videoMode === 'tech' ? 'SCANNING_MOLECULAR_STRUCTURE...' :
                                    videoMode === 'seeding' ? 'STERILITY_STATUS: NOMINAL_99.9%' :
                                        videoMode === 'process' ? 'TRACEABILITY_STATUS: VERIFIED' :
                                            videoMode === 'global' ? 'LOGISTICS_STATUS: CLEAR_FOR_EXPORT' : ''}
                            </div>
                        </div>

                        {/* Data Readouts - Left Bottom */}
                        <div style={{ position: 'absolute', bottom: 60, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#51cf66' }}>
                            {videoMode === 'global' ? (
                                <>
                                    <div style={{ color: '#adb5bd', fontSize: '9px', marginBottom: '4px' }}>GLOBAL_INTELLIGENCE: ACTIVE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                                        EXPORT_VOL: {telemetry.export_vol.toLocaleString()} KG
                                        <span style={{ color: '#51cf66', animation: 'pulser 1s infinite', fontSize: '10px', background: 'rgba(81, 207, 102, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>▲ LIVE</span>
                                    </div>
                                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>GLOBAL_NODES</div>
                                            <div style={{ color: '#74c0fc' }}>TYO | NYC | PAR | DXB</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>TRUST_RANK</div>
                                            <div style={{ color: '#fab005' }}>AAA+ (SUPREME)</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 6, color: '#adb5bd', fontSize: '8px' }}>DEMAND_SURGE: ASIA_NORTH (+14.2%) | EUROPE_WEST (+8.4%)</div>
                                </>
                            ) : videoMode === 'tech' ? (
                                <>
                                    <div>SENSOR_STATUS: ONLINE</div>
                                    <div>AI_INFERENCE: 12.4ms</div>
                                    <div style={{ color: '#51cf66' }}>OPTIMIZATION_ACTIVE: YES</div>
                                    <div style={{ marginTop: 2, color: '#4dabf7' }}>NODE_ID: HW_LAB_04</div>
                                </>
                            ) : videoMode === 'seeding' ? (
                                <>
                                    <div style={{ color: '#adb5bd', fontSize: '9px', marginBottom: '4px', letterSpacing: '1px' }}>BIO_LAB_MONITOR: ACTIVE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#74c0fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {
                                            activeSlide === 0 ? 'STATUS: GENE_MAPPING' :
                                                activeSlide === 1 ? 'STATUS: STERILIZATION' :
                                                    activeSlide === 2 ? 'STATUS: CULTURE_CTRL' : 'STATUS: SCALE_OUT'
                                        }
                                        <div style={{ width: '8px', height: '8px', background: '#74c0fc', borderRadius: '50%', animation: 'pulser 1s infinite' }} />
                                    </div>
                                    <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: `${((activeSlide + 1) / 4) * 100}%`,
                                            background: '#74c0fc',
                                            transition: 'width 1.5s ease-in-out',
                                            boxShadow: '0 0 10px #74c0fc'
                                        }} />
                                    </div>
                                    <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <div style={{ color: '#adb5bd', fontSize: '8px' }}>PURITY_IDX</div>
                                            <div style={{ color: '#fff', fontSize: '10px' }}>{99.99 - (activeSlide * 0.01)}%_NOMINAL</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#adb5bd', fontSize: '8px' }}>ENV_STABILITY</div>
                                            <div style={{ color: '#74c0fc', fontSize: '10px' }}>{99.98 + (activeSlide * 0.005)}%</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 6, fontSize: '8px', color: '#adb5bd' }}>
                                        SYSTEM_REF: BIO_HW_00{activeSlide + 1} | STACK: TISSUE_ENGINEERING
                                    </div>
                                </>
                            ) : videoMode === 'process' ? (
                                <>
                                    <div style={{ color: '#adb5bd', fontSize: '9px', marginBottom: '4px' }}>SMART_FACTORY_TRACKER: ACTIVE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', color: '#40c057' }}>
                                        {
                                            activeSlide === 0 ? '01_AUTOMATED_SEEDING' :
                                                activeSlide === 1 ? '02_HYDRO_WASHING' :
                                                    activeSlide === 2 ? '03_GROWTH_ACCELERATION' :
                                                        activeSlide === 3 ? '04_AI_ENVIRONMENT_CTRL' :
                                                            activeSlide === 4 ? '05_PURE_PURIFICATION' : '06_RESOURCE_RETURN'
                                        }
                                    </div>
                                    <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: `${((activeSlide + 1) / 6) * 100}%`,
                                            background: '#40c057',
                                            transition: 'width 1s ease-in-out',
                                            boxShadow: '0 0 10px #40c057'
                                        }} />
                                    </div>
                                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '9px' }}>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>STABILITY</div>
                                            <div style={{ color: '#40c057' }}>99.8%_NOMINAL</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>THROUGHPUT</div>
                                            <div style={{ color: '#40c057' }}>{telemetry.export_vol % 1000} U/min</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>PPFD: {telemetry.ppfd} μmol/m²/s</div>
                                    <div>EC: {telemetry.ec} mS/cm | PH: {telemetry.ph}</div>
                                    <div>CO₂: {telemetry.co2} PPM</div>
                                    <div style={{ marginTop: 2, color: '#51cf66' }}>SYS_STABILITY: 100%_NOMINAL</div>
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
                            width: (videoMode === 'tech' || videoMode === 'seeding') ? 60 : 40,
                            height: (videoMode === 'tech' || videoMode === 'seeding') ? 60 : 40,
                            border: videoMode === 'seeding' ? '1px solid rgba(116, 192, 252, 0.4)' : '1px solid rgba(81, 207, 102, 0.4)',
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
                @keyframes kenburns {
                    0% { transform: scale(1.01); }
                    100% { transform: scale(1.3); }
                }
            `}</style>
        </div>
    );
}
