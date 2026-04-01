'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Paper,
    Text,
    TextInput,
    ActionIcon,
    ScrollArea,
    Group,
    Avatar,
    Stack,
    Button,
    Loader,
    Badge,
    Title
} from '@mantine/core';
import { IconSend, IconChartBar, IconRobot, IconTarget, IconCoin, IconActivity } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

export function DataAnalystDashboard() {
    const { t, language } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: t('analyst_dashboard_welcome'),
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const viewport = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat/analyst', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({
                        sender: m.sender,
                        text: m.text
                    })),
                    language: language
                })
            });

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: data.text || t('ai_general_error'),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Chat Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper shadow="md" radius="lg" withBorder p={0} h={700} bg="gray.0" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Group justify="space-between" p="xl" bg="teal.9" c="white">
                <Group gap="md">
                    <Avatar color="teal.2" radius="xl" size="lg">
                        <IconChartBar size={28} />
                    </Avatar>
                    <Stack gap={0}>
                        <Title order={3}>{t('analyst_dashboard_title')}</Title>
                        <Text size="xs" opacity={0.8}>{t('analyst_dashboard_subtitle')}</Text>
                    </Stack>
                </Group>
                <Badge variant="dot" color="green" size="lg" styles={{ label: { color: 'white' } }}>LIVE</Badge>
            </Group>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: Quick Actions */}
                <Stack p="md" bg="white" w={200} style={{ borderRight: '1px solid #eee' }} gap="sm">
                    <Text size="xs" fw={700} c="dimmed" mb={4}>QUICK PROMPTS</Text>
                    <Button variant="light" color="teal" size="xs" leftSection={<IconCoin size={14} />} onClick={() => setInput(t('analyst_dashboard_prompt_roi'))}>{t('analyst_dashboard_prompt_roi')}</Button>
                    <Button variant="light" color="teal" size="xs" leftSection={<IconTarget size={14} />} onClick={() => setInput(t('analyst_dashboard_prompt_yield'))}>{t('analyst_dashboard_prompt_yield')}</Button>
                    <Button variant="light" color="teal" size="xs" leftSection={<IconActivity size={14} />} onClick={() => setInput(t('analyst_dashboard_prompt_cost'))}>{t('analyst_dashboard_prompt_cost')}</Button>
                </Stack>

                {/* Right: Chat Area */}
                <Stack gap={0} style={{ flex: 1 }} bg="gray.1">
                    <ScrollArea h={500} p="md" viewportRef={viewport}>
                        <Stack gap="lg">
                            {messages.map((msg) => (
                                <Group
                                    key={msg.id}
                                    justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                    align="flex-start"
                                    gap="xs"
                                >
                                    {msg.sender === 'ai' && (
                                        <Avatar size="sm" color="teal" radius="xl"><IconRobot size={14} /></Avatar>
                                    )}
                                    <Paper
                                        p="md"
                                        radius="md"
                                        bg={msg.sender === 'user' ? 'teal.7' : 'white'}
                                        c={msg.sender === 'user' ? 'white' : 'dark'}
                                        shadow="xs"
                                        maw="80%"
                                    >
                                        <Text size="sm" style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                                    </Paper>
                                </Group>
                            ))}
                            {loading && (
                                <Group justify="flex-start" align="center" gap="xs">
                                    <Avatar size="sm" color="teal" radius="xl"><IconRobot size={14} /></Avatar>
                                    <Loader color="teal" size="xs" type="dots" />
                                </Group>
                            )}
                        </Stack>
                    </ScrollArea>

                    {/* Input */}
                    <Paper p="md" bg="white" style={{ borderTop: '1px solid #eee' }}>
                        <Group gap="sm">
                            <TextInput
                                placeholder={t('analyst_dashboard_placeholder')}
                                style={{ flex: 1 }}
                                value={input}
                                onChange={(e) => setInput(e.currentTarget.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                radius="md"
                                disabled={loading}
                                size="md"
                            />
                            <ActionIcon
                                variant="filled"
                                color="teal"
                                size="xl"
                                radius="md"
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                            >
                                <IconSend size={20} />
                            </ActionIcon>
                        </Group>
                    </Paper>
                </Stack>
            </div>
        </Paper>
    );
}
