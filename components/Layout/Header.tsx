'use client';

import { useState } from 'react';
import { Container, Group, Burger, Drawer, Stack, Button, Text, Box, Image, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { IconPlant } from '@tabler/icons-react';
import { TranslationWidget } from './TranslationWidget';
import classes from './Header.module.css';

const links = [
    { link: '/', label: 'Home' },
    { link: '/products/seedlings', label: 'Seedlings' },
    { link: '/cultivation', label: 'Cultivation' },
    { link: '/products/fresh', label: 'Products' },
    { link: '/video', label: 'Video' }, // Added Video Link
    { link: '/innovation', label: 'Innovation' },
    { link: '/news', label: 'News' },
    { link: '/partnership', label: 'Partnership' },
    { link: '/consulting', label: 'Consulting' },
    { link: '/contact', label: 'Contact' },
];

export function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);

    const items = links.map((link) => (
        <Link
            key={link.label}
            href={link.link}
            className={classes.link}
            onClick={close}
        >
            {link.label}
        </Link>
    ));

    return (
        <header className={classes.header}>
            <Container size="xl" className={classes.inner}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Group gap="xs">
                        <Image src="/images/logo.jpg?v=5" alt="K-Farm Logo" h={40} w={50} className={classes.logo} style={{ borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }} />
                        <Box>
                            <Text
                                size="xl"
                                fw={900}
                                variant="gradient"
                                gradient={{ from: 'wasabi.9', to: 'wasabi.5', deg: 45 }}
                                style={{ lineHeight: 1.2 }}
                            >
                                K-Farm Group / Wasabi Div.
                            </Text>
                            <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '0.5px' }}>
                                International Marketing / Jerry Y. Hong
                            </Text>
                        </Box>
                    </Group>
                </Link>
                <Group gap={5} visibleFrom="xs">
                    {items}
                    <TranslationWidget />
                </Group>

                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

                <Drawer
                    opened={opened}
                    onClose={close}
                    size="100%"
                    padding="md"
                    title="Navigation"
                    hiddenFrom="xs"
                    zIndex={1000000}
                >
                    <Stack>
                        {items}
                    </Stack>
                </Drawer>
            </Container>
        </header>
    );
}
