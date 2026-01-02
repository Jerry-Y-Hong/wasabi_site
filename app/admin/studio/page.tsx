'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Stack, Card, Group, Button, Badge, ThemeIcon, Timeline, Divider, Grid, SegmentedControl, Code, ActionIcon, CopyButton, Tooltip, Image, Select, Slider } from '@mantine/core';
import { IconMovie, IconPlayerPlay, IconMusic, IconBrandYoutube, IconCopy, IconCheck, IconSettings } from '@tabler/icons-react';

export default function StudioPage() {
    const [allScripts, setAllScripts] = useState<any[]>([]);
    const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [activeScene, setActiveScene] = useState<number>(-1);
    const [lang, setLang] = useState<'ko-KR' | 'en-US'>('en-US');

    // Fetch scripts on mount
    useEffect(() => {
        fetch('/api/scripts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllScripts(data);
                    if (data.length > 0) setSelectedScriptId(data[0].id.toString());
                }
            });
    }, []);

    const currentScript = allScripts.find(s => s.id.toString() === selectedScriptId);
    const scenes = currentScript ? currentScript.scenes.map((s: { scene_number: number; on_screen_text: string; visual_description: string; voiceover: string; technical_note: string; image_prompt?: string; image?: string; video?: string; bgm?: string; sfx?: string; }) => ({
        time: `Scene ${s.scene_number}`,
        title: s.on_screen_text || `Scene ${s.scene_number}`,
        visual: s.visual_description,
        narration_kr: s.voiceover,
        narration_en: s.voiceover,
        bgm_guide: s.bgm || 'Cinematic Ambient',
        sfx_guide: s.sfx || 'Soft UI Beep',
        video_prompt: s.image_prompt || s.visual_description,
        image: s.image || '',
        video: s.video || '',
        technical_note: s.technical_note
    })) : [];

    // Voice Settings
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
    const [pitch, setPitch] = useState(1.1);
    const [rate] = useState(0.9);

    useEffect(() => {
        const loadVoices = () => {
            const availVoices = window.speechSynthesis.getVoices();
            setVoices(availVoices);
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
        return () => { window.speechSynthesis.onvoiceschanged = null; };
    }, [lang, selectedVoiceURI]);

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
            if (autoAdvance) playScene(index + 1, true);
            else { setPlaying(false); setActiveScene(-1); }
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
        const fullScript = scenes.map((s: any) => lang === 'en-US' ? s.narration_en : s.narration_kr).join('\n\n');
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
                                    <Title order={3}>📼 Script Selection</Title>
                                    <Select
                                        placeholder="Choose a script to work on"
                                        data={allScripts.map(s => ({ value: s.id.toString(), label: s.topic }))}
                                        value={selectedScriptId}
                                        onChange={setSelectedScriptId}
                                        mb="md"
                                        size="md"
                                        style={{ borderBottom: '2px solid #51cf66' }}
                                    />
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
                                {scenes.map((scene: any, idx: number) => (
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

                                        <Group gap="xs" mt="sm">
                                            <Badge variant="light" color="blue" leftSection={<IconMusic size={12} />}>{scene.bgm_guide}</Badge>
                                            <Badge variant="light" color="teal" leftSection={<IconSettings size={12} />}>{scene.sfx_guide}</Badge>
                                        </Group>

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
                            <Title order={4} mb="md">🎵 Active Script Cues</Title>
                            <Stack>
                                <Text size="sm" fw={700} c="dimmed">Overall Mood</Text>
                                <Code block color="gray">
                                    {currentScript?.specs || 'No specific cues provided.'}
                                </Code>
                                <Divider my="xs" />
                                <Text size="sm" fw={700} c="dimmed">Scene-by-Scene Cues</Text>
                                {scenes.map((s: any, i: number) => (
                                    <Group key={i} gap="xs" wrap="nowrap">
                                        <Badge variant="filled" color="dark" size="sm">{i + 1}</Badge>
                                        <Stack gap={0} style={{ flex: 1 }}>
                                            <Text size="xs" fw={700}>{s.bgm_guide}</Text>
                                            <Text size="xs" c="dimmed">{s.sfx_guide}</Text>
                                        </Stack>
                                    </Group>
                                ))}
                                <Divider mt="xl" />
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
