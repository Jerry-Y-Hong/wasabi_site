'use client';

import { useState, useEffect } from 'react';
import { Affix, Button, Transition, Card, Text, Group, Stack, ActionIcon, ScrollArea, Avatar, ThemeIcon, Box } from '@mantine/core';
import { IconMessageChatbot, IconX, IconArrowRight, IconRobot, IconShoppingCart, IconArchive, IconTarget, IconHeadset } from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AIConcierge() {
    const [opened, setOpened] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string, actions?: any[] }[]>([]);

    useEffect(() => {
        // Dynamic greeting based on path
        const greeting = isAdminPath
            ? {
                sender: 'ai' as const,
                text: '회장님, 관리자 모드로 접속하셨습니다. 어떤 작업을 진행할까요? 🛠️',
                actions: [
                    { label: '파트너 헌터 실행', link: '/admin/hunter', icon: IconTarget },
                    { label: '실적 대시보드', link: '/admin', icon: IconArchive },
                    { label: '메인 페이지로', link: '/', icon: IconArrowRight },
                ]
            }
            : {
                sender: 'ai' as const,
                text: '반갑습니다! K-Farm 스마트 비서입니다. 무엇을 도와드릴까요? 🌱',
                actions: [
                    { label: '프리미엄 와사비 구매', link: '/products/fresh', icon: IconShoppingCart },
                    { label: '디지털 보관소 투어', link: '/video', icon: IconArchive },
                    { label: '1:1 컨설팅 문의', link: '/consulting/inquiry', icon: IconHeadset },
                ]
            };

        setMessages([greeting]);
    }, [isAdminPath]);

    // Auto-open greeting after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => setOpened(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleAction = (action: any) => {
        // User message
        setMessages(prev => [...prev, { sender: 'user', text: action.label }]);

        // AI Response Logic
        setTimeout(() => {
            let responseText = '';
            if (action.link === '/video') responseText = '디지털 사서함(Archive)으로 모시겠습니다. 보안 잠금 해제 중...';
            else if (action.link === '/admin/hunter') responseText = '영업 파트너 발굴 시스템을 가동합니다.';
            else responseText = '해당 페이지로 즉시 안내합니다.';

            setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);

            // Navigate
            setTimeout(() => {
                router.push(action.link);
                // setOpened(false); // Valid choice to keep open or close
            }, 1000);
        }, 500);
    };

    return (
        <>
            <Affix position={{ bottom: 30, right: 30 }} zIndex={9999}>
                <Transition transition="slide-up" mounted={!opened}>
                    {(styles) => (
                        <Button
                            style={styles}
                            leftSection={<IconMessageChatbot size={24} />}
                            color="dark"
                            radius="xl"
                            size="lg"
                            onClick={() => setOpened(true)}
                            styles={{ root: { boxShadow: '0 8px 16px rgba(0,0,0,0.3)', border: '1px solid #495057' } }}
                        >
                            AI Manager
                        </Button>
                    )}
                </Transition>
            </Affix>

            <Affix position={{ bottom: 30, right: 30 }} zIndex={9999}>
                <Transition transition="slide-up" mounted={opened}>
                    {(styles) => (
                        <Card
                            style={styles}
                            w={340}
                            h={500}
                            radius="lg"
                            shadow="xl"
                            padding={0}
                            withBorder
                            bg="#212529"
                        >
                            {/* Header */}
                            <Group justify="space-between" p="md" bg="#343a40" style={{ borderBottom: '1px solid #495057' }}>
                                <Group gap="xs">
                                    <ThemeIcon variant="light" color="green" size="lg" radius="xl">
                                        <IconRobot size={20} />
                                    </ThemeIcon>
                                    <Text fw={700} c="white">K-Farm Concierge</Text>
                                </Group>
                                <ActionIcon onClick={() => setOpened(false)} variant="subtle" color="gray">
                                    <IconX size={18} />
                                </ActionIcon>
                            </Group>

                            {/* Chat Area */}
                            <ScrollArea h={380} p="md" scrollbarSize={6}>
                                <Stack gap="md">
                                    {messages.map((msg, idx) => (
                                        <Group key={idx} justify={msg.sender === 'user' ? 'flex-end' : 'flex-start'} align="flex-start">
                                            {msg.sender === 'ai' && (
                                                <Avatar size="sm" src={null} color="green" radius="xl"><IconRobot size={16} /></Avatar>
                                            )}
                                            <Stack gap={4} maw="80%">
                                                <Card
                                                    radius="md"
                                                    p="sm"
                                                    bg={msg.sender === 'user' ? 'blue.9' : 'dark.6'}
                                                    c="white"
                                                    style={{
                                                        borderTopLeftRadius: msg.sender === 'ai' ? 0 : undefined,
                                                        borderTopRightRadius: msg.sender === 'user' ? 0 : undefined
                                                    }}
                                                >
                                                    <Text size="sm">{msg.text}</Text>
                                                </Card>

                                                {/* Action Buttons if AI */}
                                                {msg.actions && (
                                                    <Stack gap={6} mt={4}>
                                                        {msg.actions.map((action: any, i: number) => (
                                                            <Button
                                                                key={i}
                                                                variant="default"
                                                                size="xs"
                                                                justify="flex-start"
                                                                leftSection={<action.icon size={14} />}
                                                                onClick={() => handleAction(action)}
                                                                styles={{ root: { backgroundColor: '#343a40', color: '#dee2e6', border: '1px solid #495057' } }}
                                                            >
                                                                {action.label}
                                                            </Button>
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </Group>
                                    ))}
                                </Stack>
                            </ScrollArea>

                            {/* Input Area (Visual only for now) */}
                            <Box p="sm" bg="#343a40" style={{ borderTop: '1px solid #495057', position: 'absolute', bottom: 0, width: '100%' }}>
                                <Group gap={6}>
                                    <Button fullWidth variant="light" color="gray" size="xs" radius="xl">
                                        Ask me anything... (Demo)
                                    </Button>
                                </Group>
                            </Box>
                        </Card>
                    )}
                </Transition>
            </Affix>
        </>
    );
}
