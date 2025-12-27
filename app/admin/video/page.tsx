'use client';

import { Container, Title, Text, Button, Card, Group, Stack, Badge, FileInput, SimpleGrid, Progress, ThemeIcon, Image as MantineImage } from '@mantine/core';
import { IconMovie, IconUpload, IconWand, IconPlayerPlay, IconArrowLeft, IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import Link from 'next/link';
import { notifications } from '@mantine/notifications';
import { generateVideoScript } from '@/lib/ai';
import { TextInput, Paper, ScrollArea } from '@mantine/core';

export default function VideoStudioPage() {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [script, setScript] = useState<any[]>([]);

    const handleGenerateScript = async () => {
        setIsGenerating(true);
        const data = await generateVideoScript(topic);
        if (data.scenes) {
            setScript(data.scenes);
            setStep(2);
            notifications.show({ title: 'Script Ready', message: 'Gemini created the storyboard!', color: 'blue' });
        } else {
            notifications.show({ title: 'Error', message: 'Failed to generate script', color: 'red' });
        }
        setIsGenerating(false);
    };

    // Mock handler for video generation (Simulation)
    const handleRenderVideo = () => {
        setIsGenerating(true);
        setStep(2);

        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setIsGenerating(false);
                setStep(3);
                notifications.show({ title: 'Done!', message: 'Video rendered successfully', color: 'teal' });
            }
        }, 200); // 4 seconds total
    };

    return (
        <Container size="lg" py={40}>
            <Group mb={30}>
                <Button component={Link} href="/admin" variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />}>
                    Back to Dashboard
                </Button>
            </Group>

            <Stack align="center" mb={40}>
                <Badge variant="filled" color="orange" size="lg" leftSection={<IconMovie size={14} />}>Beta Features</Badge>
                <Title order={1}>AI Video Producer</Title>
                <Text c="dimmed" ta="center" maw={600}>
                    Turn your farm images and AI scripts into professional marketing videos in minutes.
                </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {/* Left: Configuration Steps */}
                <Stack gap="lg">
                    <Card withBorder radius="md" p="lg" style={{ opacity: step > 1 ? 0.5 : 1 }}>
                        <Group mb="md">
                            <ThemeIcon color="orange" variant="light"><IconUpload size={20} /></ThemeIcon>
                            <Text fw={700}>Step 1: Define Concept</Text>
                        </Group>
                        <TextInput
                            label="Video Topic"
                            placeholder="e.g. Premium aeroponic wasabi farming"
                            value={topic}
                            onChange={(e) => setTopic(e.currentTarget.value)}
                            mb="sm"
                        />
                        <Button color="orange" onClick={handleGenerateScript} loading={isGenerating}>Generate Storyboard</Button>
                        <Text size="xs" c="dimmed" mt="sm">Powered by Gemini 3 Pro (Scripting Engine)</Text>
                    </Card>

                    <Card withBorder radius="md" p="lg" style={{ opacity: step > 1 && step < 3 ? 1 : 0.5 }}>
                        <Group mb="md">
                            <ThemeIcon color="grape" variant="light"><IconWand size={20} /></ThemeIcon>
                            <Text fw={700}>Step 2: AI Rendering (Veo)</Text>
                        </Group>

                        {step === 2 && script.length > 0 && (
                            <ScrollArea h={150} mb="md" type="always">
                                <Stack gap="xs">
                                    {script.map((s: any, i) => (
                                        <Paper key={i} withBorder p="xs" bg="gray.0">
                                            <Text size="xs" fw={700}>Scene {s.scene}</Text>
                                            <Text size="xs">{s.visual}</Text>
                                        </Paper>
                                    ))}
                                </Stack>
                            </ScrollArea>
                        )}

                        {isGenerating && step === 2 ? (
                            <Stack>
                                <Text size="sm" fw={500} ta="center" c="orange">Rendering on Veo Engine... {Math.floor(progress / 20) + 1}/5</Text>
                                <Progress value={progress} color="orange" size="xl" radius="xl" animated striped />
                                <Text size="xs" ta="center" c="dimmed">Synthesizing pixels from script...</Text>
                            </Stack>
                        ) : (
                            <Button
                                size="lg"
                                color="orange"
                                fullWidth
                                leftSection={<IconMovie size={20} />}
                                onClick={handleRenderVideo}
                                disabled={step !== 2}
                            >
                                Start Rendering (Veo Simulation)
                            </Button>
                        )}
                    </Card>
                </Stack>

                {/* Right: Preview & Result */}
                <Card withBorder radius="md" p={0} style={{ overflow: 'hidden', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {step === 3 ? (
                            // Fake Video Player
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <MantineImage src="/images/smart-farm-interior.jpg" h="100%" fit="cover" style={{ opacity: 0.7 }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <ThemeIcon size={80} radius="xl" color="white" variant="white" style={{ opacity: 0.8, cursor: 'pointer' }}>
                                        <IconPlayerPlay size={40} color="black" fill="black" />
                                    </ThemeIcon>
                                </div>
                                <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                                    <Text c="white" fw={700} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }} size="xl">
                                        The Future of Farming is Here
                                    </Text>
                                    <Progress value={30} size="sm" color="red" mt="xs" />
                                </div>
                            </div>
                        ) : (
                            <Stack align="center" gap="xs" c="dimmed">
                                <IconMovie size={48} stroke={1} />
                                <Text>Video Preview will appear here</Text>
                            </Stack>
                        )}
                    </div>
                    {step === 3 && (
                        <Group p="md" bg="gray.1" justify="space-between">
                            <div>
                                <Text fw={700} size="sm">SmartFarm_Promo_v1.mp4</Text>
                                <Text size="xs" c="dimmed">00:45 • 1080p • 24MB</Text>
                            </div>
                            <Button variant="outline" color="orange" leftSection={<IconDownload size={16} />}>
                                Download
                            </Button>
                        </Group>
                    )}
                </Card>
            </SimpleGrid>
        </Container >
    );
}
