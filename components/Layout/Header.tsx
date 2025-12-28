'use client';

import { useState } from 'react';
import { Container, Group, Burger, Drawer, Stack, Button, Text, Box, Image, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { IconPlant } from '@tabler/icons-react';
import classes from './Header.module.css';

const links = [
    { link: '/', label: 'Home' },
    { link: '/products/seedlings', label: 'Seedlings' },
    { link: '/cultivation', label: 'Cultivation' },
    { link: '/products/fresh', label: 'Products' },
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
                        <Image src="/images/logo.jpg" alt="K-Farm Logo" h={40} w="auto" radius="50%" />
                        <Text
                            size="xl"
                            fw={900}
                            variant="gradient"
                            gradient={{ from: 'wasabi.9', to: 'wasabi.5', deg: 45 }}
                        >
                            K-Farm International
                        </Text>
                    </Group>
                </Link>
                <Group gap={5} visibleFrom="xs">
                    {items}
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
