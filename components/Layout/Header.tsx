'use client';

import { Container, Group, Burger, Drawer, Stack, Text, Box, Image, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TranslationWidget } from './TranslationWidget';
import classes from './Header.module.css';
import { useTranslation, dictionary } from '@/lib/i18n';

export function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const { t } = useTranslation();
    const pathname = usePathname();

    const links = [
        { link: '/', label: t('nav_home') },
        { link: '/products/seedlings', label: t('nav_seedlings') },
        { link: '/cultivation', label: t('nav_cultivation') },
        { link: '/products/fresh', label: t('nav_products') },
        { link: '/insights', label: t('nav_revolution') },
        {
            link: '/news',
            label: t('nav_news'),
            submenu: [
                { link: '/news', label: t('nav_news_all') },
                { link: '/news/smart-farm-tech', label: t('nav_news_tech') },
            ],
        },
        { link: '/partnership', label: t('nav_partnership') },
        { link: '/consulting', label: t('nav_consulting') },
        { link: '/contact', label: t('nav_contact') },
    ];

    const items = links.map((link, idx) => {
        if (link.submenu) {
            return (
                <Menu key={idx} shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={400}>
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
                            {link.label}
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
        return (
            <Link
                key={idx}
                href={link.link}
                className={classes.link}
                onClick={close}
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
                {link.label}
            </Link>
        );
    });

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

                <Drawer opened={opened} onClose={close} size="100%" padding="md" title="Menu" hiddenFrom="lg" zIndex={1000000}>
                    <Stack>
                        {links.map((link, idx) => (
                            <Box key={idx}>
                                <Link
                                    href={link.link}
                                    className={classes.link}
                                    onClick={close}
                                    style={{ fontSize: '16px', fontWeight: 800, display: 'block', padding: '10px 0' }}
                                >
                                    {link.label}
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
        </header >
    );
}
