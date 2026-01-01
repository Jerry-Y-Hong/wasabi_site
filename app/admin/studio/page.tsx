'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Stack, Card, Group, Button, Badge, ThemeIcon, Timeline, Divider, Grid, SegmentedControl, Code, ActionIcon, CopyButton, Tooltip, Image, Select, Slider } from '@mantine/core';
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
            if (!selectedVoiceURI) {
                const defaultVoice = availVoices.find(v =>
                    v.lang.includes(lang) &&
                    (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Woman') || v.name.includes('Samantha') || v.name.includes('Zira'))
                ) || availVoices.find(v => v.lang.includes(lang));
                if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, [lang, selectedVoiceURI]);

    const scenes = [
        {
            time: '0:00 - 0:15',
            title: 'Scene 1: Neural Data Core',
            visual: 'Dark Server Room with glowing blue data cables looking like roots.',
            narration_kr: 'K-Farm의 심장은 흙이 아닌 데이터로 뜁니다.',
            narration_en: 'The heart of K-Farm beats not with soil, but with data.',
            bgm: '🎵 Dark Synthwave',
            video_prompt: 'Cinematic dark server room, glowing blue fiber optic cables tangling like plant roots, cybernetic atmosphere, matrix style code raining in background, 8k, unreal engine 5 render --ar 16:9',
            image: '',
            video: '/videos/tech_scene1.mp4'
        },
        {
            time: '0:15 - 0:30',
            title: 'Scene 2: X-Ray Vision',
            visual: 'X-ray style scan of a Wasabi leaf showing internal veins.',
            narration_kr: '식물의 혈관까지 보는 투시력. 엽록소의 움직임까지 읽어냅니다.',
            narration_en: 'X-ray vision into the plant veins. Reading the movement of chlorophyll.',
            bgm: '🎵 Medical Scan Sound',
            video_prompt: 'X-ray MRI scan visualization of a wasabi leaf, internal veins glowing neon green on black background, medical imaging style, scientific analysis data UI overlay, 8k --ar 16:9',
            image: '/images/studio/tech_scene_2.png',
            video: '/videos/tech_scene2.mp4'
        },
        {
            time: '0:30 - 0:45',
            title: 'Scene 3: Laser Mist',
            visual: 'Blue laser sheet lighting cutting through aeroponic fog.',
            narration_kr: '나노 단위의 미스트, 레이저로 제어되는 완벽한 타격.',
            narration_en: 'Nano-mist controlled by lasers. Perfect impact on the roots.',
            bgm: '🎵 Laser Hum',
            video_prompt: 'Blue laser sheet lighting cutting through thick white fog in a dark room, slow motion water particles suspended in air, sci-fi containment chamber aesthetic, 8k --ar 16:9',
            image: '/images/studio/tech_scene_3.png',
            video: '/videos/tech_scene3.mp4'
        },
        {
            time: '0:45 - 1:00',
            title: 'Scene 4: The Algorithm',
            visual: 'Floating mathematical equations surrounding a levitating wasabi.',
            narration_kr: '수확은 노동이 아닌, 알고리즘의 결과값입니다.',
            narration_en: 'Harvest is not labor. It is the result of an algorithm.',
            bgm: '🎵 Digital Climax',
            video_prompt: 'A perfect wasabi root levitating in a void, surrounded by floating gold mathematical equations and geometry, magical realism mixed with high tech, clean 3d render, 8k --ar 16:9',
            image: '/images/studio/tech_scene_4.png',
            video: '/videos/tech_scene4.mp4'
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
            playScene(0, true);
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
        playScene(idx, false);
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
                                    <Title order={3}>📼 Script: Smart Control Tech Deep Dive</Title>
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
