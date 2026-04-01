'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Loader,
    Center,
    Stack,
    Text,
    AppShell,
    Burger,
    Group,
    NavLink,
    Title,
    Box,
    ScrollArea,
    Button,
    rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from '@/lib/i18n';
import { checkAuthStatus } from '@/lib/checkAuth';
import {
    IconLayoutDashboard,
    IconRocket,
    IconVideo,
    IconBox,
    IconSettings,
    IconExternalLink,
    IconLogout,
    IconChartBar,
    IconBuildingStore,
    IconSettingsAutomation
} from '@tabler/icons-react';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import { Logo } from '@/components/Branding/Logo';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { t } = useTranslation();
    const pathname = usePathname();
    const [opened, { toggle }] = useDisclosure();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    useEffect(() => {
        const verify = async () => {
            const isValid = await checkAuthStatus();
            if (!isValid) {
                router.replace('/login');
            } else {
                setIsAuthorized(true);
            }
            setChecking(false);
        };
        verify();
    }, [router]);

    const menuItems = [
        { icon: IconLayoutDashboard, label: 'Dashboard', link: '/admin', active: pathname === '/admin' },
        { icon: IconChartBar, label: 'Analytics', link: '/admin/analytics', active: pathname === '/admin/analytics' },
        { icon: IconSettingsAutomation, label: 'Control Tower', link: '/admin/control', active: pathname === '/admin/control', color: 'grape' },
        { icon: IconRocket, label: 'Hunter AI', link: '/admin/hunter', active: pathname === '/admin/hunter', color: 'blue' },
        { icon: IconVideo, label: 'Studio', link: '/admin/studio', active: pathname === '/admin/studio' },
        { icon: IconBox, label: 'Inventory', link: '/admin/inventory', active: pathname === '/admin/inventory' },
        { icon: IconBuildingStore, label: 'Marketing', link: '/admin/marketing', active: pathname === '/admin/marketing' },
        { icon: IconSettings, label: 'Settings', link: '/admin/settings', active: pathname === '/admin/settings' },
    ];

    if (checking) {
        return (
            <Center h="100vh">
                <Stack align="center">
                    <Loader color="wasabi" />
                    <Text size="sm" c="dimmed">{t('admin_verifying_auth')}</Text>
                </Stack>
            </Center>
        );
    }

    if (!isAuthorized) return null;

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 260,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
            styles={{
                main: { backgroundColor: '#f8f9fa' }
            }}
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <Logo size={30} withText={true} />
                            <Text size="xs" fw={700} c="dimmed" ml={5} style={{ letterSpacing: '1px' }}>ADMIN</Text>
                        </Link>
                    </Group>
                    <Group visibleFrom="sm">
                        <Button
                            variant="subtle"
                            color="gray"
                            leftSection={<IconExternalLink size={16} />}
                            component={Link}
                            href="/"
                        >
                            View Site
                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="xs">
                <AppShell.Section grow component={ScrollArea}>
                    <Stack gap={4}>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                component={Link}
                                href={item.link}
                                label={item.label}
                                leftSection={<item.icon size={20} stroke={1.5} />}
                                active={item.active}
                                color={item.color || 'wasabi'}
                                variant="light"
                                styles={{
                                    root: { borderRadius: '8px' },
                                    label: { fontWeight: 600 }
                                }}
                            />
                        ))}
                    </Stack>
                </AppShell.Section>

                <AppShell.Section>
                    <Stack gap={4} pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                        <NavLink
                            label="Logout"
                            leftSection={<IconLogout size={20} />}
                            onClick={handleLogout}
                            styles={{
                                root: { borderRadius: '8px' },
                                label: { fontWeight: 600 }
                            }}
                        />
                    </Stack>
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
