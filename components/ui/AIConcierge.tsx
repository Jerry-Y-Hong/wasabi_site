'use client';

import { useState, useEffect } from 'react';
import { Affix, Button, Transition, Card, Text, Group, Stack, ActionIcon, ScrollArea, Avatar, ThemeIcon, Box } from '@mantine/core';
import { IconMessageChatbot, IconX, IconArrowRight, IconRobot, IconShoppingCart, IconArchive, IconTarget, IconHeadset } from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AIConcierge() {
    const [opened, setOpened] = useState(false);
    const [lang, setLang] = useState<'ko' | 'en'>('en'); // Default to English
    const router = useRouter();
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string, actions?: any[] }[]>([]);

    useEffect(() => {
        const content = {
            en: {
                admin: {
                    text: 'Welcome back, Chairman. [ADMIN] Mode active. How shall we proceed today?',
                    actions: [
                        { label: 'Run Partner Hunter (DB)', link: '/admin/hunter', icon: IconTarget, color: 'blue' },
                        { label: 'Performance Dashboard', link: '/admin', icon: IconArchive, color: 'teal' },
                        { label: 'Go to Site', link: '/', icon: IconArrowRight, color: 'gray' },
                    ]
                },
                customer: {
                    text: 'Welcome to K-Farm Premium Concierge. How can I assist you today?',
                    actions: [
                        { label: 'Shop Wasabi', link: '/products/fresh', icon: IconShoppingCart, color: 'green' },
                        { label: 'Digital Vault', link: '/video', icon: IconArchive, color: 'violet' },
                        { label: '1:1 Business Inquiry', link: '/consulting/inquiry', icon: IconHeadset, color: 'orange' },
                    ]
                },
                navigating: 'Understood. Navigating to'
            },
            ko: {
                admin: {
                    text: '회장님, 관리자 모드입니다. 어떤 작업을 진행할까요?',
                    actions: [
                        { label: '파트너 헌터 실행', link: '/admin/hunter', icon: IconTarget, color: 'blue' },
                        { label: '실적 대시보드', link: '/admin', icon: IconArchive, color: 'teal' },
                        { label: '메인으로 이동', link: '/', icon: IconArrowRight, color: 'gray' },
                    ]
                },
                customer: {
                    text: 'K-Farm 프리미엄 컨시어지입니다. 무엇을 도와드릴까요?',
                    actions: [
                        { label: '와사비 구매하기', link: '/products/fresh', icon: IconShoppingCart, color: 'green' },
                        { label: '디지털 금고 구경', link: '/video', icon: IconArchive, color: 'violet' },
                        { label: '1:1 비즈니스 문의', link: '/consulting/inquiry', icon: IconHeadset, color: 'orange' },
                    ]
                },
                navigating: '알겠습니다. 다음 페이지로 안내합니다:'
            }
        };

        const current = content[lang][isAdminPath ? 'admin' : 'customer'];
        setMessages([{
            sender: 'ai',
            text: current.text,
            actions: current.actions
        }]);
    }, [isAdminPath, lang]);

    // Auto-open greeting after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => setOpened(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleAction = (link: string, label: string) => {
        const navText = lang === 'ko' ? '알겠습니다. 안내해 드릴게요:' : 'Understood. Navigating to:';
        setMessages(prev => [...prev,
        { sender: 'user', text: label },
        { sender: 'ai', text: `${navText} ${label}` }
        ]);

        setTimeout(() => {
            router.push(link);
            if (link.startsWith('/admin') || link === '/') {
                setOpened(false);
            }
        }, 800);
    };

    return (
        <Affix position={{ bottom: 20, right: 20 }} zIndex={1000}>
            <Transition transition="slide-up" mounted={true}>
                {(transitionStyles) => (
                    <Box style={transitionStyles}>
                        {!opened ? (
                            <Button
                                onClick={() => setOpened(true)}
                                leftSection={<IconMessageChatbot size={20} />}
                                variant="gradient"
                                gradient={isAdminPath ? { from: 'dark.6', to: 'blue.9' } : { from: 'green.7', to: 'lime.8' }}
                                radius="xl"
                                size="lg"
                                styles={{
                                    root: {
                                        boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                    }
                                }}
                            >
                                {isAdminPath ? 'Admin Manager' : 'K-Farm Concierge'}
                            </Button>
                        ) : (
                            <Card
                                shadow="xl"
                                radius="lg"
                                p="md"
                                withBorder
                                w={350}
                                styles={{
                                    root: {
                                        backgroundColor: isAdminPath ? '#1a1b1e' : '#fff',
                                        borderColor: isAdminPath ? '#373a40' : '#e9ecef',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                    }
                                }}
                            >
                                <Group justify="space-between" mb="sm">
                                    <Group gap="xs">
                                        <ThemeIcon
                                            variant="light"
                                            color={isAdminPath ? 'blue' : 'green'}
                                            radius="xl"
                                        >
                                            <IconRobot size={18} />
                                        </ThemeIcon>
                                        <Text fw={700} size="sm" c={isAdminPath ? 'white' : 'dark'}>
                                            {isAdminPath ? (lang === 'ko' ? '[관리자] AI 메신저' : 'Admin AI') : (lang === 'ko' ? 'K-Farm AI 비서' : 'K-Farm AI')}
                                        </Text>
                                    </Group>
                                    <Group gap={5}>
                                        <Button.Group>
                                            <Button
                                                variant={lang === 'ko' ? 'filled' : 'light'}
                                                color="gray"
                                                size="compact-xs"
                                                onClick={() => setLang('ko')}
                                            >
                                                KO
                                            </Button>
                                            <Button
                                                variant={lang === 'en' ? 'filled' : 'light'}
                                                color="gray"
                                                size="compact-xs"
                                                onClick={() => setLang('en')}
                                            >
                                                EN
                                            </Button>
                                        </Button.Group>
                                        <ActionIcon variant="subtle" color="gray" onClick={() => setOpened(false)}>
                                            <IconX size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>

                                <ScrollArea h={300} mb="md" offsetScrollbars>
                                    <Stack gap="sm">
                                        {messages.map((msg, idx) => (
                                            <Box
                                                key={idx}
                                                style={{
                                                    alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                                                    maxWidth: '85%',
                                                }}
                                            >
                                                <Card
                                                    p="xs"
                                                    radius="md"
                                                    bg={msg.sender === 'ai'
                                                        ? (isAdminPath ? '#2c2e33' : '#f8f9fa')
                                                        : (isAdminPath ? 'blue.9' : 'green.7')}
                                                    withBorder={msg.sender === 'ai'}
                                                >
                                                    <Text size="sm" c={msg.sender === 'user' ? 'white' : (isAdminPath ? 'gray.3' : 'dark')}>
                                                        {msg.text}
                                                    </Text>
                                                </Card>
                                                {msg.actions && (
                                                    <Stack gap={5} mt="xs">
                                                        {msg.actions.map((action, aidx) => (
                                                            <Button
                                                                key={aidx}
                                                                variant="light"
                                                                color={action.color || 'gray'}
                                                                size="xs"
                                                                fullWidth
                                                                justify="flex-start"
                                                                leftSection={<action.icon size={14} />}
                                                                onClick={() => handleAction(action.link, action.label)}
                                                                styles={{
                                                                    inner: { justifyContent: 'flex-start' }
                                                                }}
                                                            >
                                                                {action.label}
                                                            </Button>
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </ScrollArea>
                                <Text size="xs" c="dimmed" ta="center">
                                    {isAdminPath ? 'Authorized Personnel Only' : '24/7 Smart Support'}
                                </Text>
                            </Card>
                        )}
                    </Box>
                )}
            </Transition>
        </Affix>
    );
}
