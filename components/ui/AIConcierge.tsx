'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Affix, 
  Button, 
  Transition, 
  Card, 
  Text, 
  Group, 
  Stack, 
  ActionIcon, 
  ScrollArea, 
  Avatar, 
  ThemeIcon, 
  Box, 
  TextInput,
  Loader,
  Badge,
  Tooltip
} from '@mantine/core';
import { 
  IconMessageChatbot, 
  IconX, 
  IconRobot, 
  IconSend, 
  IconHeadset, 
  IconHierarchy2, 
  IconChefHat, 
  IconBriefcase,
  IconSparkles
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

interface AgentConfig {
  name: string;
  role: string;
  apiPath: string;
  icon: any;
  color: string;
  welcomeMsg: string;
}

export default function AIConcierge() {
    const [mounted, setMounted] = useState(false);
    const [opened, setOpened] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const viewport = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { t, language } = useTranslation();

    // 1. Unified Agent Logic based on current page
    const getAgentConfig = (): AgentConfig => {
        if (pathname?.startsWith('/admin')) {
            return {
                name: 'CSO Han',
                role: t('ai_concierge_role_cso'),
                apiPath: '/api/chat/strategy',
                icon: IconHierarchy2,
                color: 'blue',
                welcomeMsg: t('ai_concierge_hi_cso')
            };
        } else if (pathname?.includes('/contact') || pathname?.includes('/news')) {
            return {
                name: 'Chief Park',
                role: t('ai_concierge_role_park'),
                apiPath: '/api/chat/tech',
                icon: IconHeadset,
                color: 'cyan',
                welcomeMsg: t('ai_concierge_hi_park')
            };
        } else if (pathname?.includes('/b2b') || pathname?.includes('/trade')) {
            return {
                name: 'Broker Kim',
                role: t('ai_concierge_role_kim'),
                apiPath: '/api/chat/trade',
                icon: IconBriefcase,
                color: 'orange',
                welcomeMsg: t('ai_concierge_hi_kim')
            };
        }
        return {
            name: 'Manager Hong',
            role: t('ai_concierge_role_hong'),
            apiPath: '/api/chat/sales',
            icon: IconChefHat,
            color: 'teal',
            welcomeMsg: t('ai_concierge_hi_hong')
        };
    };

    const agent = getAgentConfig();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset chat when agent profile changes (significant path change)
    useEffect(() => {
        if (!mounted) return;
        setMessages([{ sender: 'ai', text: agent.welcomeMsg }]);
    }, [agent.name, mounted]);

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, opened]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(agent.apiPath, {
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

            if (!response.ok) throw new Error('Failed to connect to AI');
            const data = await response.json();

            setMessages(prev => [...prev, { sender: 'ai', text: data.text || "I'm sorry, I encountered an issue." }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Connection issues. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <Affix position={{ bottom: 30, right: 30 }} zIndex={1000}>
            <Transition transition="slide-up" mounted={true}>
                {(transitionStyles) => (
                    <Box style={transitionStyles}>
                        {!opened ? (
                          <Tooltip label={t('ai_concierge_placeholder')} position="left">
                            <ActionIcon
                                onClick={() => setOpened(true)}
                                variant="gradient"
                                gradient={{ from: `${agent.color}.6`, to: `${agent.color}.9` }}
                                radius="xl"
                                size={64}
                                styles={{
                                    root: {
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                        border: '3px solid rgba(255,255,255,0.3)',
                                    }
                                }}
                            >
                                <agent.icon size={28} />
                            </ActionIcon>
                          </Tooltip>
                        ) : (
                            <Card
                                shadow="xl"
                                radius="lg"
                                p={0}
                                withBorder
                                w={380}
                                h={600}
                                styles={{
                                    root: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                                        overflow: 'hidden'
                                    }
                                }}
                            >
                                {/* Premium Header */}
                                <Group justify="space-between" p="md" bg={`${agent.color}.7`} c="white">
                                    <Group gap="xs">
                                        <ThemeIcon variant="white" color={agent.color} radius="xl" size="lg">
                                            <agent.icon size={20} />
                                        </ThemeIcon>
                                        <Stack gap={0}>
                                            <Group gap={5}>
                                              <Text fw={800} size="sm">{agent.name}</Text>
                                              <IconSparkles size={12} />
                                            </Group>
                                            <Text size="xs" opacity={0.8}>{agent.role}</Text>
                                        </Stack>
                                    </Group>
                                    <ActionIcon variant="subtle" color="white" onClick={() => setOpened(false)}>
                                        <IconX size={20} />
                                    </ActionIcon>
                                </Group>

                                {/* Chat Area */}
                                <ScrollArea h={450} viewportRef={viewport} p="md" bg="gray.0" style={{ flexGrow: 1 }}>
                                    <Stack gap="md" py="sm">
                                        {messages.map((msg, idx) => (
                                            <Stack 
                                              key={idx} 
                                              gap={4}
                                              align={msg.sender === 'ai' ? 'flex-start' : 'flex-end'}
                                            >
                                              <Group gap="xs" align="flex-end" justify={msg.sender === 'ai' ? 'flex-start' : 'flex-end'} wrap="nowrap">
                                                {msg.sender === 'ai' && (
                                                  <Avatar radius="xl" size="sm" color={agent.color} variant="light">
                                                    <IconRobot size={14} />
                                                  </Avatar>
                                                )}
                                                <Card 
                                                  p="sm" 
                                                  radius="md" 
                                                  bg={msg.sender === 'ai' ? 'white' : `${agent.color}.6`}
                                                  c={msg.sender === 'ai' ? 'dark.8' : 'white'}
                                                  style={{ 
                                                    maxWidth: '85%',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                    border: msg.sender === 'ai' ? '1px solid #eee' : 'none'
                                                  }}
                                                >
                                                  <Text size="sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                    {msg.text}
                                                  </Text>
                                                </Card>
                                              </Group>
                                            </Stack>
                                        ))}
                                        {loading && (
                                          <Group gap="xs" align="center" pl={5}>
                                            <Avatar radius="xl" size="sm" color={agent.color} variant="light">
                                              <IconRobot size={14} />
                                            </Avatar>
                                            <Loader size="xs" color={agent.color} type="dots" />
                                          </Group>
                                        )}
                                    </Stack>
                                </ScrollArea>

                                {/* Input Area */}
                                <Box p="md" bg="white" style={{ borderTop: '1px solid #eee' }}>
                                    <Group gap="sm">
                                        <TextInput
                                            placeholder={t('ai_concierge_placeholder')}
                                            variant="filled"
                                            radius="md"
                                            style={{ flexGrow: 1 }}
                                            value={input}
                                            onChange={(e) => setInput(e.currentTarget.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            disabled={loading}
                                        />
                                        <ActionIcon 
                                          variant="filled" 
                                          color={agent.color} 
                                          radius="md" 
                                          size="lg" 
                                          onClick={handleSend}
                                          disabled={!input.trim() || loading}
                                        >
                                          <IconSend size={18} />
                                        </ActionIcon>
                                    </Group>
                                    <Text size="xxxxs" ta="center" c="dimmed" mt={8}>
                                      {t('ai_concierge_powered')}
                                    </Text>
                                </Box>
                            </Card>
                        )}
                    </Box>
                )}
            </Transition>
        </Affix>
    );
}
