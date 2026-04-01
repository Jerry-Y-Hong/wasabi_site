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
    Transition,
    Button,
    Loader
} from '@mantine/core';
import { IconSend, IconX, IconRobot, IconChefHat } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

export function SalesConcierge() {
    const { t, language } = useTranslation();
    const [opened, setOpened] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: t('sales_concierge_welcome'),
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
    }, [messages, opened, loading]);

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
            const response = await fetch('/api/chat/sales', {
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

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: data.text || t('sales_concierge_error_general'),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error('Chat Error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: t('sales_concierge_error_network'),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 1000 }}>
                <Transition transition="scale" duration={200} mounted={!opened}>
                    {(styles) => (
                        <Button
                            style={styles}
                            size="xl"
                            radius="xl"
                            h={60}
                            pl={20}
                            pr={24}
                            color="teal"
                            leftSection={
                                <Avatar color="white" bg="transparent">
                                    <IconChefHat size={28} />
                                </Avatar>
                            }
                            onClick={() => setOpened(true)}
                            styles={{
                                root: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                            }}
                        >
                            VIP Concierge
                        </Button>
                    )}
                </Transition>
            </div>

            {/* Chat Interface */}
            <Transition transition="slide-up" duration={300} mounted={opened}>
                {(styles) => (
                    <Paper
                        style={{ ...styles, position: 'fixed', bottom: 110, right: 40, zIndex: 1000 }}
                        w={380}
                        h={600}
                        shadow="xl"
                        radius="lg"
                        withBorder
                        p={0}
                        bg="white"
                    >
                        {/* Header */}
                        <Group justify="space-between" p="md" bg="teal.0" style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                            <Group gap="xs">
                                <Avatar color="teal" radius="xl">
                                    <IconChefHat size={20} />
                                </Avatar>
                                <Stack gap={0}>
                                    <Text size="sm" fw={700}>{t('sales_concierge_name')}</Text>
                                    <Text size="xs" c="dimmed">{t('sales_concierge_status')}</Text>
                                </Stack>
                            </Group>
                            <ActionIcon variant="subtle" color="gray" onClick={() => setOpened(false)}>
                                <IconX size={18} />
                            </ActionIcon>
                        </Group>

                        {/* Chat Area */}
                        <ScrollArea h={480} viewportRef={viewport} p="md" bg="gray.0">
                            <Stack gap="md">
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
                                            p="sm"
                                            radius="md"
                                            bg={msg.sender === 'user' ? 'teal.6' : 'white'}
                                            c={msg.sender === 'user' ? 'white' : 'dark'}
                                            shadow="xs"
                                            maw="80%"
                                        >
                                            <Text size="sm">{msg.text}</Text>
                                        </Paper>
                                    </Group>
                                ))}
                                {loading && (
                                    <Group justify="flex-start" align="center" gap="xs">
                                        <Avatar size="sm" color="teal" radius="xl"><IconRobot size={14} /></Avatar>
                                        <Loader size="xs" color="teal" type="dots" />
                                    </Group>
                                )}
                            </Stack>
                        </ScrollArea>

                        {/* Input Area */}
                        <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                            <Group gap={8}>
                                <TextInput
                                    placeholder={t('sales_concierge_placeholder')}
                                    style={{ flex: 1 }}
                                    value={input}
                                    onChange={(e) => setInput(e.currentTarget.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    radius="md"
                                    disabled={loading}
                                />
                                <ActionIcon
                                    variant="filled"
                                    color="teal"
                                    size="lg"
                                    radius="md"
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                >
                                    <IconSend size={18} />
                                </ActionIcon>
                            </Group>
                        </div>
                    </Paper>
                )}
            </Transition>
        </>
    );
}
