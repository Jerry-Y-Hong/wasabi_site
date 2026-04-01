'use client';
import { Container, Group, Burger, Drawer, Stack, Text, Box, Image, Menu, Affix, Transition, Button as MantineButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TranslationWidget } from './TranslationWidget';
import classes from './Header.module.css';
import { useTranslation, dictionary } from '@/lib/i18n';
import { IconHome, IconArrowUp, IconLeaf, IconShoppingCart, IconWorld } from '@tabler/icons-react';
import { Logo } from '../Branding/Logo';

export function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const { t } = useTranslation();
    const pathname = usePathname();

    interface LinkItem {
        link: string;
        label: string;
        icon?: React.ReactNode;
        submenu?: { link: string; label: string }[];
        external?: boolean;
    }

    // Unified Global Navigation
    const links: LinkItem[] = [
        { link: '/', label: t('nav_home'), icon: <IconHome size={16} /> },
        {
            link: '/tech/solutions',
            label: t('nav_aero'),
            icon: <IconLeaf size={16} />,
            submenu: [
                { link: '/tech/solutions', label: t('nav_aero_home') },
                { link: '/tech/solutions/control-system', label: t('nav_control_system') },
                { link: '/tech/smartfarm/modular', label: t('nav_modular') },
                { link: '/tech/smartfarm', label: t('sf_hub_title') },
            ]
        },
        {
            link: '/food',
            label: t('nav_food'),
            icon: <IconShoppingCart size={16} />,
            submenu: [
                { link: '/food', label: t('nav_food_home') },
                { link: '/food', label: t('nav_food_story') },
                { link: '/products/fresh', label: t('nav_food_best') },
            ]
        },
        {
            link: '/trade',
            label: t('nav_trade'),
            icon: <IconWorld size={16} />,
            submenu: [
                { link: '/trade', label: t('nav_trade_home') },
                { link: '/trade', label: t('nav_trade_export') },
            ]
        },
        {
            link: '/company',
            label: t('nav_company'),
            submenu: [
                { link: '/partnership', label: t('nav_partnership') },
                { link: '/consulting', label: t('nav_consulting') },
            ]
        },
        { link: '/contact', label: t('nav_contact') },
    ];

    const items = links.map((link, idx) => {
        if (link.submenu) {
            // ... (submenu logic remains same)
            return (
                <Menu key={idx} id={link.label.replace(/\s+/g, '-').toLowerCase()} shadow="lg" width={220} trigger="hover" openDelay={50} closeDelay={200}>
                    <Menu.Target>
                        <Link
                            href={link.link}
                            className={classes.link}
                            data-active={pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'true' : undefined}
                        >
                            <Group gap={6} wrap="nowrap">
                                {link.icon}
                                {link.label}
                            </Group>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown style={{
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255,255,255,0.9)'
                    }}>
                        {link.submenu.map((sub, sidx) => (
                            <Menu.Item
                                key={sidx}
                                component={Link}
                                href={sub.link}
                                onClick={close}
                                fw={600}
                                style={{ borderRadius: '8px', margin: '2px 4px' }}
                            >
                                {sub.label}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            );
        }

        // (Other link types logic)
        return (
            <Link
                key={idx}
                href={link.link}
                className={classes.link}
                onClick={close}
                target={link.external ? "_blank" : undefined}
                data-active={pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'true' : undefined}
            >
                <Group gap={6} wrap="nowrap">
                    {link.icon}
                    {link.label}
                </Group>
            </Link>
        );
    });

    const [scroll, scrollTo] = useWindowScroll();

    return (
        <header className={classes.header}>
            <Container fluid className={classes.inner} px="md" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '60px',
                maxWidth: '100%'
            }}>

                {/* Left: Logo */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Logo size={40} withText={true} />
                    </Link>
                </div>

                {/* Middle: Navigation */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Group gap={0} visibleFrom="lg" wrap="nowrap">
                        {items}
                    </Group>
                </div>

                {/* Right: Widget */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Group justify="flex-end" wrap="nowrap">
                        <Box visibleFrom="sm">
                            <TranslationWidget />
                        </Box>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" />
                    </Group>
                </div>

                <Drawer opened={opened} onClose={close} size="100%" padding="md" title={t('menu_title')} hiddenFrom="lg" zIndex={1000000}>
                    <Stack>
                        <Stack gap="xs">
                            {links.map((link, idx) => (
                                <Box key={idx} p="xs" style={{
                                    borderRadius: '12px',
                                    backgroundColor: pathname === link.link ? 'var(--mantine-color-wasabi-0)' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}>
                                    <Link
                                        href={link.link}
                                        className={classes.link}
                                        onClick={close}
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            padding: '8px 0',
                                            color: pathname === link.link ? 'var(--mantine-color-wasabi-8)' : 'inherit'
                                        }}
                                    >
                                        <Group gap="md">
                                            <Box style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: pathname === link.link ? 'var(--mantine-color-wasabi-1)' : 'var(--mantine-color-gray-1)',
                                                color: pathname === link.link ? 'var(--mantine-color-wasabi-7)' : 'var(--mantine-color-gray-6)'
                                            }}>
                                                {link.icon || <IconLeaf size={18} />}
                                            </Box>
                                            {link.label}
                                        </Group>
                                    </Link>
                                    {link.submenu && (
                                        <Stack gap={4} pl={44} mt={4}>
                                            {link.submenu.map((sub, sidx) => (
                                                <Link
                                                    key={sidx}
                                                    href={sub.link}
                                                    onClick={close}
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: 'var(--mantine-color-dimmed)',
                                                        textDecoration: 'none',
                                                        padding: '6px 0',
                                                        display: 'block'
                                                    }}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Drawer>
            </Container>

            {/* Floating Navigation Buttons */}
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 200}>
                    {(transitionStyles) => (
                        <Stack gap="xs" style={transitionStyles}>
                            <Tooltip label={t('nav_home_tooltip')} position="left" withArrow>
                                <ActionIcon
                                    component={Link}
                                    href="/"
                                    size="xl"
                                    radius="xl"
                                    color="wasabi.7"
                                    variant="filled"
                                >
                                    <IconHome size={rem(24)} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('nav_top_tooltip')} position="left" withArrow>
                                <ActionIcon
                                    onClick={() => scrollTo({ y: 0 })}
                                    size="lg"
                                    radius="xl"
                                    color="gray"
                                    variant="light"
                                >
                                    <IconArrowUp size={rem(20)} />
                                </ActionIcon>
                            </Tooltip>
                        </Stack>
                    )}
                </Transition>
            </Affix>
        </header >
    );
}
