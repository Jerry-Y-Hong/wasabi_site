'use client';

import { Container, Title, Text, TextInput, Textarea, Button, Group, Stack, Select, Paper, Badge, Table, ScrollArea, SimpleGrid, Modal, FileButton, Slider, Image, Box, Center, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState, useEffect, useRef } from 'react';
import { IconMovie, IconPrinter, IconRobot, IconDeviceFloppy, IconHistory, IconPlayerPlay, IconPhoto, IconPlus, IconDownload, IconRepeat, IconVolume, IconCopy } from '@tabler/icons-react';
import { generateVideoScript } from '@/lib/ai';
import { saveVideoScript, getVideoScripts, saveAnimatorImage } from '@/lib/actions';

export default function VideoProducerPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [script, setScript] = useState<any[]>([]);
    const [recentScripts, setRecentScripts] = useState<any[]>([]);
    const [clientDate, setClientDate] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Animator State
    const [animatorOpened, setAnimatorOpened] = useState(false);
    const [startImg, setStartImg] = useState<string | null>(null);
    const [endImg, setEndImg] = useState<string | null>(null);
    const [duration, setDuration] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoop, setIsLoop] = useState(true);
    const [playTimeout, setPlayTimeout] = useState<NodeJS.Timeout | null>(null);
    const [hasFinishedOnce, setHasFinishedOnce] = useState(false); // Track if Play Once finished
    const [animatorNarration, setAnimatorNarration] = useState(''); // Audio script in animator
    const [narrationModalOpened, setNarrationModalOpened] = useState(false);
    const [fullNarration, setFullNarration] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false); // TTS tracking
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const form = useForm({
        initialValues: {
            seriesType: 'process', // process, facility, brand
            topic: '',
            specs: '',
        },
        validate: {
            topic: (value) => (value.length < 2 ? 'Topic is required' : null),
        },
    });

    useEffect(() => {
        loadRecentScripts();
        setClientDate(new Date().toLocaleDateString());

        // Load Animator State (Safe Parsing)
        try {
            const saved = localStorage.getItem('wasabi-animator-state');
            console.log('[Debug] Loading from LocalStorage:', saved);
            if (saved) {
                const parsed = JSON.parse(saved);
                setStartImg(parsed.startImg);
                setEndImg(parsed.endImg);
                setDuration(parsed.duration || 5);
                setIsLoop(parsed.isLoop !== undefined ? parsed.isLoop : true);
                setAnimatorNarration(parsed.narration || '');
                console.log('[Debug] State restored:', parsed);
            }
        } catch (e) {
            console.error('[Error] Failed to load animator state:', e);
            // Optional: clear corrupted state
            // localStorage.removeItem('wasabi-animator-state');
        } finally {
            setIsLoaded(true);
        }

        // Load TTS voices
        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    // Save Animator state to localStorage whenever it changes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('wasabi-animator-state', JSON.stringify({
            startImg, endImg, duration, isLoop, narration: animatorNarration
        }));
    }, [isLoaded, startImg, endImg, duration, isLoop, animatorNarration]);

    const handleImageUpload = async (file: File | null, type: 'start' | 'end') => {
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Use standard API route to bypass Server Action limits
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.path) {
                    if (type === 'start') setStartImg(result.path);
                    else setEndImg(result.path);

                    notifications.show({
                        title: 'Image Saved',
                        message: `${file.name} saved successfully.`,
                        color: 'teal'
                    });
                    return;
                }
            }
            throw new Error('Upload failed');
        } catch (error) {
            console.error('Upload error:', error);
            // Fallback to Base64 (Local only)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (type === 'start') setStartImg(base64);
                else setEndImg(base64);

                notifications.show({
                    title: 'Stored Locally (Server Error)',
                    message: 'Image stored in browser only.',
                    color: 'orange'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const loadRecentScripts = async () => {
        const data = await getVideoScripts();
        setRecentScripts(data);
    };

    const handleGenerate = async () => {
        const validation = form.validate();
        if (validation.hasErrors) return;

        setLoading(true);
        try {
            const result = await generateVideoScript(
                form.values.topic,
                form.values.seriesType,
                form.values.specs
            );

            if (result.scenes && result.scenes.length > 0) {
                setScript(result.scenes);
                notifications.show({ title: 'Script Generated', message: 'Ready for review.', color: 'wasabi' });
            } else {
                notifications.show({ title: 'Error', message: 'Failed to generate script.', color: 'red' });
            }
        } catch (error) {
            notifications.show({ title: 'Error', message: 'AI Service unavailable.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!script.length) return;
        setSaving(true);
        try {
            const result = await saveVideoScript({
                topic: form.values.topic,
                seriesType: form.values.seriesType,
                specs: form.values.specs,
                scenes: script
            });
            if (result.success) {
                notifications.show({ title: 'Saved', message: 'Script stored successfully.', color: 'green' });
                loadRecentScripts();
            }
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to save.', color: 'red' });
        } finally {
            setSaving(false);
        }
    };

    const handleLoadScript = (saved: any) => {
        form.setValues({
            topic: saved.topic,
            seriesType: saved.seriesType,
            specs: saved.specs
        });
        setScript(saved.scenes);
        notifications.show({ message: 'Loaded previous script', color: 'blue' });
    };

    const handlePlayToggle = () => {
        if (isPlaying) {
            // Stop
            setIsPlaying(false);
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            if (playTimeout) {
                clearTimeout(playTimeout);
                setPlayTimeout(null);
            }
        } else {
            // Play
            setIsPlaying(true);
            setHasFinishedOnce(false);
            if (!isLoop) {
                const timeout = setTimeout(() => {
                    setIsPlaying(false);
                    // Do not cancel speech here; let it finish naturally.
                    // window.speechSynthesis.cancel(); 
                    // setIsSpeaking(false);
                    setPlayTimeout(null);
                    setHasFinishedOnce(true);
                }, duration * 1000);
                setPlayTimeout(timeout);
            }
        }
    };

    const handleSpeak = () => {
        if (!animatorNarration) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(animatorNarration);
        const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();

        // Simple language detection (check for any Korean characters)
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(animatorNarration);

        // Select native voice based on content
        let selectedVoice = null;
        if (hasKorean) {
            selectedVoice = currentVoices.find(v => v.lang.startsWith('ko'));
        } else {
            selectedVoice = currentVoices.find(v => v.lang === 'en-US') ||
                currentVoices.find(v => v.lang === 'en-GB') ||
                currentVoices.find(v => v.lang.startsWith('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang; // Important for pronunciation
        }

        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handleCopyNarration = () => {
        if (!script.length) return;
        const fullText = script.map(s => `[Scene ${s.scene_number}] ${s.visual_description}\n${s.voiceover}`).join('\n\n');
        setFullNarration(fullText);
        setNarrationModalOpened(true);
    };

    const handleActualCopy = () => {
        navigator.clipboard.writeText(fullNarration);
        notifications.show({ title: 'Copied!', message: 'Narration script is now in your clipboard.', color: 'wasabi' });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = (imgUrl: string | null, fileName: string) => {
        if (!imgUrl) return;
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const SERIES_INFO: any = {
        'process': { label: 'Series 1: The Code of Life', desc: 'Focus on Micro-precision, Sterilization, Lab Work.' },
        'facility': { label: 'Series 2: The Evolving Farm', desc: 'Focus on Aeroponics, Automation, Scale.' },
        'brand': { label: 'Series 3: K-Farm Logic', desc: 'Focus on Vision, R&D Leadership, Interviews.' },
    };

    return (
        <Container size="xl" py="xl" className="video-producer-container">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    header, footer, .no-print, button, .mantine-Group-root, .mantine-Paper-root:not(.printable-script) {
                        display: none !important;
                    }
                    .video-producer-container {
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                    }
                    .printable-script {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    table {
                        width: 100% !important;
                    }
                }
                @keyframes crossfade {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.08); }
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animating .start-image {
                    animation: zoom var(--duration) ease-in-out infinite alternate;
                }
                .animating.once .start-image {
                    animation: zoom var(--duration) ease-in-out forwards;
                }
                .animating.loop .end-image {
                    animation: crossfade var(--duration) ease-in-out infinite alternate, zoom var(--duration) ease-in-out infinite alternate;
                }
                .animating.once .end-image {
                    animation: crossfade var(--duration) ease-in-out forwards, zoom var(--duration) ease-in-out forwards;
                }
                .animating.once .progress-fill {
                    animation: progress var(--duration) linear forwards;
                }
                .animating.loop .progress-fill {
                    animation: progress var(--duration) linear infinite alternate;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                    color: var(--mantine-color-orange-4);
                }
            ` }} />

            <Modal
                opened={animatorOpened}
                onClose={() => setAnimatorOpened(false)}
                title="Scene Animator (Hand Protector 🦾)"
                size="700px"
                radius="md"
            >
                <Stack>
                    <SimpleGrid cols={2} spacing="md">
                        <Stack gap="xs">
                            <Text size="sm" fw={700}>1. Start Image</Text>
                            <Paper withBorder p="xs" h={200} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                {startImg ? <Image src={startImg} fit="contain" h="100%" /> : <IconPhoto size={40} color="#dee2e6" />}
                                <Group gap={5} style={{ position: 'absolute', bottom: 5 }}>
                                    <FileButton onChange={(file) => handleImageUpload(file, 'start')} accept="image/png,image/jpeg">
                                        {(props) => <Button {...props} size="xs" variant="light">Upload</Button>}
                                    </FileButton>
                                    {startImg && (
                                        <Button size="xs" variant="outline" color="blue" onClick={() => handleDownload(startImg, 'start-frame.png')}>
                                            <IconDownload size={14} />
                                        </Button>
                                    )}
                                </Group>
                            </Paper>
                        </Stack>
                        <Stack gap="xs">
                            <Text size="sm" fw={700}>2. End Image</Text>
                            <Paper withBorder p="xs" h={200} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                {endImg ? <Image src={endImg} fit="contain" h="100%" /> : <IconPhoto size={40} color="#dee2e6" />}
                                <Group gap={5} style={{ position: 'absolute', bottom: 5 }}>
                                    <FileButton onChange={(file) => handleImageUpload(file, 'end')} accept="image/png,image/jpeg">
                                        {(props) => <Button {...props} size="xs" variant="light">Upload</Button>}
                                    </FileButton>
                                    {endImg && (
                                        <Button size="xs" variant="outline" color="blue" onClick={() => handleDownload(endImg, 'end-frame.png')}>
                                            <IconDownload size={14} />
                                        </Button>
                                    )}
                                </Group>
                            </Paper>
                        </Stack>
                    </SimpleGrid>

                    <Paper withBorder radius="md" p="md" bg="gray.9">
                        <Stack gap="md">
                            <Box
                                w="100%"
                                h={300}
                                style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}
                                className={`${isPlaying ? 'animating' : ''} ${isLoop ? 'loop' : 'once'}`}
                            >
                                {startImg && <Image src={startImg} fit="contain" h="300" className="start-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', '--duration': `${duration}s` } as any} />}
                                {endImg && (
                                    <Image
                                        key={isPlaying ? 'playing' : 'stopped'}
                                        src={endImg}
                                        fit="contain"
                                        h="300"
                                        className="end-image"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            opacity: isPlaying ? undefined : 0,
                                            '--duration': `${duration}s`
                                        } as any}
                                    />
                                )}
                                {endImg && isPlaying && (
                                    <Box
                                        style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', backgroundColor: 'var(--mantine-color-wasabi-filled)', zIndex: 10 }}
                                        className="progress-fill"
                                    />
                                )}
                                {!startImg && !endImg && <Center h="100%"><Text c="dimmed">Upload images to preview animation</Text></Center>}
                            </Box>

                            <Stack gap={5}>
                                <Group gap={5} mb={-5}>
                                    <IconVolume size={14} color="var(--mantine-color-orange-4)" />
                                    <Text size="xs" fw={700} c="orange.4">3. Narration Script (Audio)</Text>
                                </Group>
                                <Textarea
                                    placeholder="Paste your narration script here to review while the video plays..."
                                    value={animatorNarration}
                                    onChange={(e) => setAnimatorNarration(e.currentTarget.value)}
                                    minRows={2}
                                    maxRows={4}
                                    styles={{ input: { backgroundColor: '#1A1B1E', color: '#fff', border: '1px solid #373A40' } }}
                                />
                            </Stack>

                            <Group w="100%">
                                <Stack flex={1} gap={0}>
                                    <Text size="xs" c="white" fw={700}>Animation Speed: {duration}s</Text>
                                    <Slider
                                        value={duration}
                                        onChange={setDuration}
                                        min={1} max={10} step={0.5}
                                        label={null}
                                        color="wasabi"
                                    />
                                </Stack>
                                <Switch
                                    label={<Text size="xs" c="white">Loop</Text>}
                                    checked={isLoop}
                                    onChange={(event) => setIsLoop(event.currentTarget.checked)}
                                    color="wasabi"
                                    size="sm"
                                />
                                <Button
                                    leftSection={isPlaying ? <IconRepeat size={18} className="spin" /> : (hasFinishedOnce ? <IconRepeat size={18} /> : <IconPlayerPlay size={18} />)}
                                    color={isPlaying ? "red" : (hasFinishedOnce ? "blue" : "wasabi")}
                                    onClick={handlePlayToggle}
                                    disabled={!startImg || !endImg}
                                >
                                    {isPlaying ? "Stop" : (hasFinishedOnce ? "Replay Once" : (isLoop ? "Loop Preview" : "Play Once"))}
                                </Button>
                                <Button
                                    variant="outline"
                                    color={isSpeaking ? "orange" : "gray"}
                                    onClick={handleSpeak}
                                    title="Listen to Narration"
                                >
                                    <IconVolume size={18} className={isSpeaking ? "pulse" : ""} />
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                    <Text size="xs" c="dimmed" ta="center">
                        *This simulates a cross-fade transition between your Scene Start and End frames.
                    </Text>
                </Stack>
            </Modal>

            {/* Narration Preview Modal */}
            <Modal
                opened={narrationModalOpened}
                onClose={() => setNarrationModalOpened(false)}
                title="Narration Script Preview"
                size="lg"
                radius="md"
            >
                <Stack>
                    <Paper withBorder p="md" bg="gray.0" style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                        <Text size="sm" ff="monospace">{fullNarration}</Text>
                    </Paper>
                    <Group justify="flex-end">
                        <Button variant="light" color="gray" onClick={() => setNarrationModalOpened(false)}>Close</Button>
                        <Button color="wasabi" leftSection={<IconCopy size={18} />} onClick={handleActualCopy}>Copy to Clipboard</Button>
                    </Group>
                </Stack>
            </Modal>

            <Group mb="xl" className="no-print">
                <IconMovie size={32} color="#40C057" />
                <div>
                    <Title order={2}>AI Video Producer</Title>
                    <Text c="dimmed">Create professional technical scripts for your video series.</Text>
                </div>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'start' }}>
                <Stack gap="xl">
                    {/* 1. Configuration Panel */}
                    <Paper p="lg" withBorder radius="md" shadow="sm" className="no-print">
                        <Title order={4} mb="md">1. Series Configuration</Title>
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                            <Stack>
                                <Select
                                    label="Select Series Type"
                                    description="Determines the visual style and narration tone."
                                    data={[
                                        { value: 'process', label: 'Series 1: Tech Process (Micro/Lab)' },
                                        { value: 'facility', label: 'Series 2: Smart Facility (System/Wide)' },
                                        { value: 'brand', label: 'Series 3: Brand Vision (Interview/PR)' }
                                    ]}
                                    {...form.getInputProps('seriesType')}
                                />
                                {form.values.seriesType && (
                                    <Badge size="lg" variant="light" color="wasabi" fullWidth>
                                        {SERIES_INFO[form.values.seriesType].desc}
                                    </Badge>
                                )}
                            </Stack>
                            <Stack>
                                <TextInput
                                    label="Topic"
                                    placeholder="e.g. Tissue Culture Sterilization Step"
                                    required
                                    {...form.getInputProps('topic')}
                                />
                                <Textarea
                                    label="Technical Specs / Key Points"
                                    placeholder="e.g. 121°C Autoclave, 15 min duration, 0.5mm tissue separation..."
                                    minRows={3}
                                    {...form.getInputProps('specs')}
                                />
                            </Stack>
                        </SimpleGrid>
                        <Group justify="flex-end" mt="lg">
                            <Button
                                leftSection={<IconRobot size={20} />}
                                color="wasabi"
                                size="md"
                                loading={loading}
                                onClick={handleGenerate}
                            >
                                Generate Script
                            </Button>
                        </Group>
                    </Paper>

                    {/* 2. Script Viewer */}
                    {script.length > 0 && (
                        <Paper p="lg" withBorder radius="md" shadow="sm" className="printable-script">
                            <Group justify="space-between" mb="md" className="no-print">
                                <Title order={4}>2. Generated Script</Title>
                                <Group>
                                    <Button
                                        variant="filled"
                                        color="grape"
                                        leftSection={<IconMovie size={18} />}
                                        onClick={() => setAnimatorOpened(true)}
                                    >
                                        Scene Animator
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="orange"
                                        leftSection={<IconCopy size={18} />}
                                        onClick={handleCopyNarration}
                                    >
                                        Copy Narration
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="blue"
                                        leftSection={<IconDeviceFloppy size={18} />}
                                        loading={saving}
                                        onClick={handleSave}
                                    >
                                        Save to Database
                                    </Button>
                                    <Button
                                        variant="outline"
                                        color="dark"
                                        leftSection={<IconPrinter size={16} />}
                                        onClick={handlePrint}
                                    >
                                        Print / PDF
                                    </Button>
                                </Group>
                            </Group>

                            <div className="print-header">
                                <Title order={2} mb="xs">K-Farm Video Script</Title>
                                <Text fw={700} mb="xs">Series: {SERIES_INFO[form.values.seriesType].label}</Text>
                                <Text mb="lg">Topic: {form.values.topic} | Date: {clientDate}</Text>
                            </div>
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                .print-header { display: none; }
                                @media print {
                                    .print-header { display: block !important; }
                                }
                            ` }} />

                            <ScrollArea>
                                <Table striped highlightOnHover withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th style={{ width: '80px' }}>Scene</Table.Th>
                                            <Table.Th style={{ width: '30%' }}>Visual Instruction</Table.Th>
                                            <Table.Th>Audio / Voiceover</Table.Th>
                                            <Table.Th style={{ width: '20%' }}>Other</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {script.map((scene: any, idx: number) => (
                                            <Table.Tr key={idx}>
                                                <Table.Td>
                                                    <Badge size="sm" circle>{scene.scene_number}</Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" fw={500}>{scene.visual_description}</Text>
                                                    {scene.technical_note && (
                                                        <Text size="xs" c="dimmed" mt={4}>💡 {scene.technical_note}</Text>
                                                    )}
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{scene.voiceover}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    {scene.on_screen_text && (
                                                        <Badge variant="outline" color="grape" fullWidth style={{ textTransform: 'none' }}>
                                                            {scene.on_screen_text}
                                                        </Badge>
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </ScrollArea>
                        </Paper>
                    )}
                </Stack>

                {/* 3. History Sidebar (Always Visible) */}
                <Stack className="no-print">
                    <Group gap="xs">
                        <IconHistory color="#adb5bd" size={20} />
                        <Title order={4} c="dimmed">History (사서함)</Title>
                    </Group>
                    <Stack gap="xs">
                        {recentScripts.length > 0 ? (
                            recentScripts.map((s: any) => (
                                <Paper
                                    key={s.id}
                                    p="sm"
                                    withBorder
                                    radius="sm"
                                    style={{ cursor: 'pointer', transition: '0.2s' }}
                                    onClick={() => handleLoadScript(s)}
                                >
                                    <Group justify="space-between" mb={5}>
                                        <Text size="xs" fw={700} tt="uppercase" c="wasabi">
                                            {s.seriesType}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {new Date(s.timestamp).toLocaleDateString()}
                                        </Text>
                                    </Group>
                                    <Text size="sm" fw={500} lineClamp={1}>{s.topic}</Text>
                                    <Text size="xs" c="dimmed" lineClamp={1}>{s.scenes.length} Scenes</Text>
                                </Paper>
                            ))
                        ) : (
                            <Text size="sm" c="dimmed" ta="center" py="xl" style={{ border: '1px dashed #dee2e6', borderRadius: '4px' }}>
                                저장된 스크립트가 없습니다.
                            </Text>
                        )}
                    </Stack>
                </Stack>
            </SimpleGrid>
        </Container>
    );
}
