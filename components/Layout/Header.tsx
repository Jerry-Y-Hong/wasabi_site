'use client';
import { Container, Group, Burger, Drawer, Stack, Text, Box, Image, Menu, Affix, Transition, Button as MantineButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TranslationWidget } from './TranslationWidget';
import classes from './Header.module.css';
import { useTranslation, dictionary } from '@/lib/i18n';
import { IconHome, IconArrowUp } from '@tabler/icons-react';

export function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const { t } = useTranslation();
    const pathname = usePathname();

    const links = [
        { link: '/', label: t('nav_home'), icon: <IconHome size={16} /> },
        { link: '/products/seedlings', label: t('nav_seedlings') },
        { link: '/cultivation', label: t('nav_cultivation') },
        { link: '/products/fresh', label: t('nav_products') },
        { link: '/insights', label: t('nav_revolution') },
        {
            link: '/news',
            label: t('nav_news'),
            submenu: [
                { link: '/news', label: t('nav_news_all') },
                { link: '/smartfarm', label: t('sf_hub_title') },
                { link: '/smartfarm/rda-api', label: t('sf_rda_title') },
                { link: '/smartfarm/hardware', label: t('sf_hw_title') },
                { link: '/smartfarm/roadmap', label: t('sf_rd_title') },
                { link: '/smartfarm/hardware', label: t('nav_au_prime') },
            ],
        },
        { link: '/smartfarm/modular', label: t('nav_modular') },
        { link: '/partnership', label: t('nav_partnership') },
        { link: '/consulting', label: t('nav_consulting') },
        { link: '/solutions/control-system', label: t('nav_control_system') },
        { link: '/simulator', label: t('nav_simulator') },
        { link: 'https://k-hamp-div.vercel.app', label: t('nav_hemp'), external: true },
        { link: '/contact', label: t('nav_contact') },
    ];

    const items = links.map((link, idx) => {
        if (link.submenu) {
            // ... (submenu logic remains same)
            return (
                <Menu key={idx} id={link.label.replace(/\s+/g, '-').toLowerCase()} shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400}>
                    <Menu.Target>
                        <Link
                            href={link.link}
                            className={classes.link}
                            data-active={pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'true' : undefined}
                            style={{
                                fontSize: '12px',
                                padding: '8px 5px',
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                backgroundColor: pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'var(--mantine-color-wasabi-1)' : undefined,
                                color: pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'var(--mantine-color-wasabi-7)' : undefined
                            }}
                        >
                            <Group gap={4} wrap="nowrap">
                                {link.icon}
                                {link.label}
                            </Group>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {link.submenu.map((sub, sidx) => (
                            <Menu.Item key={sidx} component={Link} href={sub.link} onClick={close}>
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
                style={{
                    fontSize: '12px',
                    padding: '8px 12px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    backgroundColor: link.link === 'https://k-hamp-div.vercel.app' ? '#4ade80' :
                        (pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'var(--mantine-color-wasabi-1)' : undefined),
                    color: link.link === 'https://k-hamp-div.vercel.app' ? 'black' :
                        (pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link)) ? 'var(--mantine-color-wasabi-7)' : undefined),
                    borderRadius: link.link === 'https://k-hamp-div.vercel.app' ? '20px' : 'var(--mantine-radius-md)',
                    marginLeft: link.link === 'https://k-hamp-div.vercel.app' ? '10px' : '0'
                }}
            >
                <Group gap={4} wrap="nowrap">
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
                        <Group gap={8} align="center" wrap="nowrap">
                            <Image src="/images/logo.jpg?v=100" alt="Logo" h={38} w="auto" style={{ borderRadius: '50%' }} />
                            <Text size="lg" fw={900} variant="gradient" gradient={{ from: 'wasabi.9', to: 'wasabi.6', deg: 45 }} style={{ whiteSpace: 'nowrap' }}>
                                {t('nav_brand')}
                            </Text>
                        </Group>
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
                        {links.map((link, idx) => (
                            <Box key={idx}>
                                <Link
                                    href={link.link}
                                    className={classes.link}
                                    onClick={close}
                                    style={{ fontSize: '16px', fontWeight: 800, display: 'block', padding: '10px 0' }}
                                >
                                    <Group gap="sm">
                                        {link.icon}
                                        {link.label}
                                    </Group>
                                </Link>
                                {link.submenu && (
                                    <Stack gap={4} pl="md" mt={4}>
                                        {link.submenu.map((sub, sidx) => (
                                            <Link
                                                key={sidx}
                                                href={sub.link}
                                                onClick={close}
                                                style={{ fontSize: '14px', fontWeight: 600, color: 'var(--mantine-color-dimmed)', textDecoration: 'none' }}
                                            >
                                                • {sub.label}
                                            </Link>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        ))}
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
