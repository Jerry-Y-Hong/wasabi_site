'use client';

import { Container, Title, Text, TextInput, Button, Select, Card, Textarea, Group, Stack, Badge, Loader, ActionIcon } from '@mantine/core';
import { IconBrain, IconPencil, IconCheck, IconCopy, IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';
import { generateBlogContent } from '@/lib/ai'; // We will create this
import Link from 'next/link';
import { notifications } from '@mantine/notifications';

export default function ContentStudioPage() {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [language, setLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ title: string; content: string } | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const data = await generateBlogContent(topic, tone, language);
            setResult(data);
            notifications.show({ title: 'Success', message: 'Blog draft generated!', color: 'green' });
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to generate content.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="lg" py={40}>
            <Group mb={30}>
                <Button component={Link} href="/admin" variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />}>
                    Back to Dashboard
                </Button>
            </Group>

            <Stack align="center" mb={40}>
                <Badge variant="filled" color="pink" size="lg" leftSection={<IconBrain size={14} />}>AI Content Studio</Badge>
                <Title order={1}>Blog & Article Generator</Title>
                <Text c="dimmed" ta="center" maw={600}>
                    Enter a keyword, and I will write a high-quality blog post for you.
                    Perfect for LinkedIn, company news, or PR materials.
                </Text>
            </Stack>

            <Group align="flex-start" grow>
                {/* Left: Controls */}
                <Card withBorder shadow="sm" radius="md" p="xl">
                    <Stack>
                        <TextInput
                            label="Core Topic / Keyword"
                            placeholder="e.g., Vertical Farming Efficiency, Wasabi Health Benefits"
                            value={topic}
                            onChange={(e) => setTopic(e.currentTarget.value)}
                            size="md"
                        />
                        <Select
                            label="Tone of Voice"
                            value={tone}
                            onChange={(val) => setTone(val || 'Professional')}
                            data={['Professional', 'Friendly', 'Persuasive', 'Technical']}
                            allowDeselect={false}
                        />
                        <Select
                            label="Target Language"
                            value={language}
                            onChange={(val) => setLanguage(val || 'English')}
                            data={['English', 'Korean', 'Japanese', 'Chinese', 'French', 'German', 'Spanish']}
                            allowDeselect={false}
                            mt="sm"
                        />
                        <Button
                            size="lg"
                            color="pink"
                            onClick={handleGenerate}
                            loading={loading}
                            leftSection={<IconBrain size={20} />}
                            mt="md"
                        >
                            Generate Draft
                        </Button>
                    </Stack>
                </Card>

                {/* Right: Output */}
                <Card withBorder shadow="sm" radius="md" p="xl" bg="gray.0" style={{ minHeight: '400px' }}>
                    {!result && !loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#adb5bd' }}>
                            <IconPencil size={48} stroke={1} />
                            <Text mt="md">Result will appear here...</Text>
                        </div>
                    )}

                    {loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Loader color="pink" type="bars" />
                            <Text mt="md" size="sm" c="dimmed">AI is writing your article...</Text>
                        </div>
                    )}

                    {result && (
                        <Stack>
                            <Badge color="green" variant="light">Draft Ready</Badge>
                            <TextInput
                                label="Title Suggestion"
                                value={result.title}
                                readOnly
                                rightSection={<ActionIcon variant="subtle" color="gray"><IconCopy size={16} /></ActionIcon>}
                            />
                            <Textarea
                                label="Body Content"
                                value={result.content}
                                readOnly
                                autosize
                                minRows={15}
                            />
                            <Group justify="flex-end">
                                <Button variant="light" color="gray" leftSection={<IconCopy size={16} />} onClick={() => {
                                    navigator.clipboard.writeText(`${result.title}\n\n${result.content}`);
                                    notifications.show({ message: 'Copied to clipboard', color: 'blue' });
                                }}>
                                    Copy All
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Card>
            </Group>
        </Container>
    );
}
