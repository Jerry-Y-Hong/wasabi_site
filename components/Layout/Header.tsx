'use client';

import { Container, Group, Burger, Drawer, Stack, Text, Box, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { TranslationWidget } from './TranslationWidget';
import classes from './Header.module.css';
import { useTranslation, dictionary } from '@/lib/i18n';

export function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const { t } = useTranslation();

    const links = [
        { link: '/', label: t('nav_home') },
        { link: '/products/seedlings', label: t('nav_seedlings') },
        { link: '/cultivation', label: t('nav_cultivation') },
        { link: '/products/fresh', label: t('nav_products') },
        { link: '/video', label: t('nav_video') },
        { link: '/insights', label: t('nav_revolution') },
        { link: '/news', label: t('nav_news') },
        { link: '/partnership', label: t('nav_partnership') },
        { link: '/consulting', label: t('nav_consulting') },
        { link: '/contact', label: t('nav_contact') },
    ];

    const items = links.map((link, idx) => (
        <Link
            key={idx}
            href={link.link}
            className={classes.link}
            onClick={close}
            style={{ fontSize: '12px', padding: '8px 5px', fontWeight: 800, whiteSpace: 'nowrap' }}
        >
            {link.label}
        </Link>
    ));

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
                    <Stack>{items}</Stack>
                </Drawer>
            </Container>
        </header >
    );
}
