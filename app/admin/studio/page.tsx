'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Stack, Card, Group, Button, Badge, ThemeIcon, Timeline, Divider, Grid, SegmentedControl, Code, ActionIcon, CopyButton, Tooltip, Image, Select, Slider } from '@mantine/core'; // Added Select, Slider
import { IconMovie, IconPlayerPlay, IconMusic, IconBrandYoutube, IconCopy, IconCheck, IconSettings } from '@tabler/icons-react';

export default function StudioPage() {
    const [playing, setPlaying] = useState(false);
    const [activeScene, setActiveScene] = useState<number>(-1);
    const [lang, setLang] = useState<'ko-KR' | 'en-US'>('en-US'); // Default English

    // Voice Settings
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [pitch, setPitch] = useState(1.1); // Default slightly higher for 'younger' tone
    const [rate] = useState(0.9);

    useEffect(() => {
        const loadVoices = () => {
            const availVoices = window.speechSynthesis.getVoices();
            setVoices(availVoices);
            // Auto-select a female voice if possible, or any voice for the current language
            if (!selectedVoiceURI) { // Only set default if no voice is already selected
                const defaultVoice = availVoices.find(v =>
                    v.lang.includes(lang) &&
                    (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Woman') || v.name.includes('Samantha') || v.name.includes('Zira'))
                ) || availVoices.find(v => v.lang.includes(lang));
                if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        // Cleanup function
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [lang, selectedVoiceURI]); // Re-run if lang changes to find appropriate default, or if selectedVoiceURI is cleared

    const scenes = [
        {
            time: '0:00 - 0:10',
            title: 'Scene 1: The Origin',
            visual: 'Drone shot of Hwacheon\'s snowy mountains, morning mist.',
            narration_kr: '가장 차갑고, 가장 깨끗한 곳, 강원도 화천.',
            narration_en: 'Hwacheon. The coldest, purest sanctuary.',
            bgm: '🎵 Wind sounds, subtle piano, dawn breaking.',
            video_prompt: 'Cinematic drone shot of snowy mountains in Hwacheon Korea, morning mist, majestic nature, 8k, photorealistic, slow smooth motion --ar 16:9',
            image: '/images/studio/scene1.png',
            video: '/videos/scene1_real.mp4'
        },
        {
            time: '0:10 - 0:25',
            title: 'Scene 2: The Innovation',
            visual: 'Crystal clear underground water flowing -> Hydroponic system circulating -> LED lights.',
            narration_kr: '화천의 차가운 천연 암반수... 그 완벽한 환경을 과학으로 제어하여, 자연 재생의 기적을 설계합니다.',
            narration_en: 'Hwacheon\'s pristine bedrock water. We engineer its perfect condition to scientifically recreate a miracle of natural regeneration.',
            bgm: '🎵 Water flowing sound mixing with high-tech beats.',
            video_prompt: 'High-tech smart farm hydroponic pipes with crystal clear water flowing inside, digital temperature overlay HUD, purple grow lights illuminating green plants, cinematic sci-fi laboratory aesthetic, 8k, photorealistic --ar 16:9',
            image: '/images/studio/scene2.png',
            video: '/videos/scene2.mp4'
        },
        {
            // Force redeploy for scene3
            time: '0:25 - 0:45',
            title: 'Scene 3: The Product',
            visual: 'Close up of fresh green Wasabi leaves, thick Rhizomes. Water droplets.',
            narration_kr: '흙 한 톨 없이, 오직 물과 기술로 빚어낸... 100% 무결점 와사비.',
            narration_en: 'Zero soil. Pure water. 100% Flawless Wasabi crafted by technology.',
            bgm: '🎵 Grand orchestral swelling. Drums kicking in.',
            video_prompt: 'Macro extreme close-up of fresh green Wasabi leaves and thick rhizome root, water droplets on surface, vibrant lush green, advertising product photography style, 8k, sharp focus --ar 16:9',
            image: '/images/studio/scene3.png',
            video: '/videos/scene3_fixed.mp4'
        },
        {
            time: '0:45 - 0:55',
            title: 'Scene 4: The Control',
            visual: 'Advanced IoT sensors, dashboard UI overlay, climate control activation.',
            narration_kr: '보이지 않는 곳까지 완벽하게. AI는 24시간 식물의 호흡과 맥박을 듣습니다.',
            narration_en: 'Perfection in the unseen. AI listens to the pulse and respiration of the plants, 24/7.',
            bgm: '🎵 Digital pulse sound, futuristic tech ambiance.',
            video_prompt: 'Futuristic smart farm control room, holographic dashboard monitoring plant vitals, close up of IoT sensors on aeroponic pipes, data flowing, clean white and blue aesthetic, 8k --ar 16:9',
            image: '/images/studio/scene4.png',
            video: '/videos/scene4.mp4'
        },
        {
            time: '0:55 - 1:10',
            title: 'Scene 5: The Harvest',
            visual: 'Robotic arm harvesting, clean room processing, final product packaging.',
            narration_kr: '가장 순수한 자연이, 기술의 손길로 완성됩니다. K-Farm 프리미엄 와사비.',
            narration_en: 'Nature in its purest form, perfected by technology. K-Farm Premium Wasabi.',
            bgm: '🎵 Emotional orchestral climax, triumphant finale.',
            video_prompt: 'Robotic harvesting arm gently picking fresh wasabi in clean room, transition to premium packaging design, workers in hazmat suits inspecting quality, bright sterile lighting, 8k --ar 16:9',
            image: '/images/studio/scene5.png',
            video: '/videos/scene5.mp4'
        }
    ];

    const playScene = (index: number, autoAdvance: boolean = true) => {
        if (index >= scenes.length) {
            setPlaying(false);
            setActiveScene(-1);
            return;
        }

        setActiveScene(index);
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = lang === 'en-US' ? scenes[index].narration_en : scenes[index].narration_kr;
        utterance.lang = lang;
        utterance.pitch = pitch;
        utterance.rate = rate;

        if (selectedVoiceURI) {
            const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (voice) utterance.voice = voice;
        }

        utterance.onend = () => {
            if (autoAdvance) {
                playScene(index + 1, true);
            } else {
                setPlaying(false);
                setActiveScene(-1);
            }
        };

        // Small delay between scenes
        setTimeout(() => window.speechSynthesis.speak(utterance), 300);
    };

    const handlePlayScript = () => {
        if (!window.speechSynthesis) return alert('Browser not supported.');

        if (playing) {
            window.speechSynthesis.cancel();
            setPlaying(false);
            setActiveScene(-1);
        } else {
            window.speechSynthesis.cancel();
            setPlaying(true);
            playScene(0, true); // True = Auto Advance
        }
    };

    const handleCopyScript = () => {
        const fullScript = scenes.map(s => lang === 'en-US' ? s.narration_en : s.narration_kr).join('\n\n');
        navigator.clipboard.writeText(fullScript);
        alert('Script copied to clipboard! You can paste this into ElevenLabs/Typecast.');
    };

    const handlePlaySingle = (idx: number) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        setPlaying(true);
        playScene(idx, false); // False = Play Once
    }

    const currentLangVoices = voices.filter(v => v.lang.includes(lang === 'en-US' ? 'en' : 'ko'));

    return (
        <Container size="xl" py="xl">
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <Stack gap={0}>
                        <Title>🎬 K-Wasabi Studio</Title>
                        <Text c="dimmed">Creative Department</Text>
                    </Stack>
                    <Group>
                        <Button variant="default" leftSection={<IconCopy size={16} />} onClick={handleCopyScript}>Copy Full Script</Button>
                        <Button color="dark" leftSection={<IconBrandYoutube />}>Export Video</Button>
                    </Group>
                </Group>

                <Grid>
                    <Grid.Col span={8}>
                        <Card shadow="sm" radius="md" p="xl" withBorder>
                            <Group mb="md" justify="space-between" align="flex-start">
                                <Stack gap="xs">
                                    <Title order={3}>📼 Script: The Green Revolution</Title>
                                    <Group>
                                        <IconSettings size={16} color="gray" />
                                        <Select
                                            placeholder="Select Voice"
                                            data={currentLangVoices.map(v => ({ value: v.voiceURI, label: v.name }))}
                                            value={selectedVoiceURI}
                                            onChange={setSelectedVoiceURI}
                                            searchable
                                            size="xs"
                                            w={200}
                                        />
                                        <Text size="xs" fw={700}>Pitch:</Text>
                                        <Slider
                                            w={100}
                                            min={0.5}
                                            max={2}
                                            step={0.1}
                                            value={pitch}
                                            onChange={setPitch}
                                            label={(val) => val.toFixed(1)}
                                        />
                                    </Group>
                                </Stack>

                                <Stack align="flex-end">
                                    <SegmentedControl
                                        value={lang}
                                        onChange={(val: string) => setLang(val as 'ko-KR' | 'en-US')}
                                        data={[
                                            { label: '🇺🇸 English', value: 'en-US' },
                                            { label: '🇰🇷 Korean', value: 'ko-KR' },
                                        ]}
                                    />
                                    <Button
                                        variant={playing ? "filled" : "light"}
                                        color={playing ? "red" : "grape"}
                                        leftSection={playing ? <IconMusic size={16} /> : <IconPlayerPlay size={16} />}
                                        onClick={handlePlayScript}
                                    >
                                        {playing ? 'Stop Reading' : 'Narration Preview (TTS)'}
                                    </Button>
                                </Stack>
                            </Group>

                            <Timeline active={activeScene >= 0 ? activeScene : -1} bulletSize={24} lineWidth={2}>
                                {scenes.map((scene, idx) => (
                                    <Timeline.Item
                                        key={idx}
                                        bullet={<IconMovie size={12} />}
                                        lineVariant={idx < activeScene ? 'solid' : 'dashed'}
                                        title={
                                            <Group>
                                                <Text fw={700} c={activeScene === idx ? 'grape' : undefined}>{scene.title}</Text>
                                                <Badge color="gray">{scene.time}</Badge>
                                                {activeScene === idx && <Badge color="red" variant="dot">On Air</Badge>}
                                            </Group>
                                        }
                                    >
                                        {scene.video ? (
                                            <video
                                                src={scene.video}
                                                controls
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    borderRadius: '8px',
                                                    marginBottom: '8px',
                                                    objectFit: 'cover',
                                                    border: activeScene === idx ? '3px solid #be4bdb' : 'none'
                                                }}
                                            />
                                        ) : (
                                            scene.image && (
                                                <Image
                                                    src={scene.image}
                                                    h={200}
                                                    w="100%"
                                                    fit="cover"
                                                    radius="md"
                                                    mb="sm"
                                                    alt={scene.title}
                                                    style={{ border: activeScene === idx ? '3px solid #be4bdb' : 'none' }}
                                                />
                                            )
                                        )}
                                        <Text c="dimmed" size="sm" mt={4}>{scene.visual}</Text>

                                        <Card bg={activeScene === idx ? 'grape.0' : 'gray.1'} mt="sm" radius="md" p="xs" style={{ borderLeft: '4px solid #fab005' }}>
                                            <Group gap="xs" align="center">
                                                <ActionIcon
                                                    variant="light"
                                                    color="grape"
                                                    size="sm"
                                                    onClick={() => handlePlaySingle(idx)}
                                                    loading={activeScene === idx && playing}
                                                >
                                                    <IconPlayerPlay size={12} />
                                                </ActionIcon>
                                                <Text fw={500} size="md">&quot;{lang === 'en-US' ? scene.narration_en : scene.narration_kr}&quot;</Text>
                                            </Group>
                                        </Card>

                                        <Text size="xs" fw={700} mt="sm">🤖 AI Video Prompt:</Text>
                                        <Group gap={5} mb="xs">
                                            <Code block style={{ flex: 1, whiteSpace: 'normal' }} color="blue">
                                                {scene.video_prompt}
                                            </Code>
                                            <CopyButton value={scene.video_prompt} timeout={2000}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                                        <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </Group>

                                        <Text size="xs" c="blue" mt="xs">{scene.bgm}</Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Card shadow="sm" radius="md" p="xl" withBorder h="100%">
                            <Title order={4} mb="md">🎵 BGM Cue Sheet</Title>
                            <Stack>
                                <Group>
                                    <ThemeIcon variant="light" color="blue"><IconMusic size={16} /></ThemeIcon>
                                    <Stack gap={0}>
                                        <Text size="sm" fw={700}>Hans Zimmer Style</Text>
                                        <Text size="xs" c="dimmed">Main Theme (Epic)</Text>
                                    </Stack>
                                </Group>
                                <Divider />
                                <Group>
                                    <ThemeIcon variant="light" color="teal"><IconMusic size={16} /></ThemeIcon>
                                    <Stack gap={0}>
                                        <Text size="sm" fw={700}>Discovery Nature</Text>
                                        <Text size="xs" c="dimmed">Intro Ambience</Text>
                                    </Stack>
                                </Group>
                                <Divider />
                                <Text size="xs" c="dimmed" mt="xl">
                                    * Music generation requires external AI Tools (Suno/Udio).
                                    Currently using placeholder cues.
                                </Text>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
}
