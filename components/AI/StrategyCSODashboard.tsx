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
    Title,
    Divider,
    Timeline
} from '@mantine/core';
import { IconSend, IconTrophy, IconRobot, IconHierarchy, IconTarget, IconUsers, IconRocket } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

export function StrategyCSODashboard() {
    const { t, language } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: t('cso_dashboard_welcome'),
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

    const handleSend = async (customText?: string) => {
        const textToSend = customText || input;
        if (!textToSend.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        if (!customText) setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat/strategy', {
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
                text: data.text || t('cso_dashboard_error'),
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
        <Paper shadow="xl" radius="lg" withBorder p={0} h={750} bg="slate.0" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '2px solid var(--mantine-color-blue-9)' }}>
            {/* Executive Header */}
            <Group justify="space-between" p="xl" bg="blue.9" c="white">
                <Group gap="md">
                    <Avatar color="yellow.5" radius="xl" size="lg">
                        <IconHierarchy size={28} />
                    </Avatar>
                    <Stack gap={0}>
                        <Title order={3}>{t('cso_dashboard_header_title')}</Title>
                        <Text size="xs" opacity={0.8}>{t('cso_dashboard_header_subtitle')}</Text>
                    </Stack>
                </Group>
                <div style={{ textAlign: 'right' }}>
                    <Badge color="yellow" variant="filled" size="lg">{t('cso_dashboard_session_active')}</Badge>
                </div>
            </Group>

            {/* Strategic Layout */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: Decision Support / PCDCA Timeline */}
                <Stack p="md" bg="gray.1" w={260} style={{ borderRight: '1px solid #ddd' }} gap="xl">
                    <div>
                        <Text size="xs" fw={700} c="dimmed" mb="md">{t('cso_dashboard_timeline_title')}</Text>
                        <Timeline active={1} bulletSize={20} lineWidth={2}>
                            <Timeline.Item bullet={<IconTarget size={12} />} title="Planning">
                                <Text c="dimmed" size="xs">Factory 1.0 Deployment</Text>
                            </Timeline.Item>
                            <Timeline.Item bullet={<IconRocket size={12} />} title="Doing">
                                <Text c="dimmed" size="xs">Multi-Agent Integration</Text>
                            </Timeline.Item>
                            <Timeline.Item bullet={<IconTrophy size={12} />} title="Checking">
                                <Text c="dimmed" size="xs">ROI & Yield Validation</Text>
                            </Timeline.Item>
                            <Timeline.Item bullet={<IconUsers size={12} />} title="Acting">
                                <Text c="dimmed" size="xs">Global Scale-up</Text>
                            </Timeline.Item>
                        </Timeline>
                    </div>

                    <Divider />

                    <Stack gap="xs">
                        <Text size="xs" fw={700} c="dimmed">{t('cso_dashboard_actions_title')}</Text>
                        <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="xs" onClick={() => handleSend("현재 모든 부서의 AI 에이전트 통합 상태와 시너지 보고해줘")}>{t('cso_dashboard_action_sync')}</Button>
                        <Button variant="gradient" gradient={{ from: 'dark', to: 'blue' }} size="xs" onClick={() => handleSend("글로벌 수출 시장 확대를 위한 차기 단계 전략 제안해봐")}>{t('cso_dashboard_action_expansion')}</Button>
                        <Button variant="white" color="blue" size="xs" leftSection={<IconTarget size={14} />} onClick={() => handleSend("PCDCA 프로세스에 따른 현재 리스크 요인 분석해줘")}>{t('cso_dashboard_action_risk')}</Button>
                    </Stack>
                </Stack>

                {/* Right: Orchestration Chat */}
                <Stack gap={0} style={{ flex: 1 }} bg="white">
                    <ScrollArea h={550} p="md" viewportRef={viewport}>
                        <Stack gap="lg">
                            {messages.map((msg) => (
                                <Group
                                    key={msg.id}
                                    justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                    align="flex-start"
                                    gap="xs"
                                >
                                    {msg.sender === 'ai' && (
                                        <Avatar size="sm" color="blue.9" radius="xl"><IconRobot size={14} /></Avatar>
                                    )}
                                    <Paper
                                        p="md"
                                        radius="md"
                                        bg={msg.sender === 'user' ? 'blue.9' : 'gray.0'}
                                        c={msg.sender === 'user' ? 'white' : 'dark'}
                                        shadow="sm"
                                        maw="85%"
                                        style={{ border: msg.sender === 'ai' ? '1px solid #e0e0e0' : 'none' }}
                                    >
                                        <Text size="sm" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                                    </Paper>
                                </Group>
                            ))}
                            {loading && (
                                <Group justify="flex-start" align="center" gap="xs">
                                    <Avatar size="sm" color="blue.9" radius="xl"><IconRobot size={14} /></Avatar>
                                    <Loader color="blue" size="xs" type="dots" />
                                </Group>
                            )}
                        </Stack>
                    </ScrollArea>

                    {/* Command Console */}
                    <Paper p="md" bg="gray.1" style={{ borderTop: '2px solid #eee' }}>
                        <Group gap="sm">
                            <TextInput
                                placeholder={t('cso_dashboard_placeholder')}
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
                                color="blue.9"
                                size="xl"
                                radius="md"
                                onClick={() => handleSend()}
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
