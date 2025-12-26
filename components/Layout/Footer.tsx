'use client';

import { Container, Group, Anchor, Text, Stack } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from './Footer.module.css';

const links = [
    { link: '/contact', label: 'Contact' },
    { link: '/privacy', label: 'Privacy' },
    { link: '/blog', label: 'Blog' },
];

export function Footer() {
    const items = links.map((link) => (
        <Anchor
            c="dimmed"
            key={link.label}
            href={link.link}
            lh={1}
            onClick={(event) => event.preventDefault()}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <Container className={classes.inner} size="xl">
                <Stack gap={0}>
                    <Text size="lg" fw={700} c="wasabi">K-Farm International Co., Ltd</Text>
                    <Text size="xs" c="dimmed">강원특별자치도 화천군 상서면 다목리 745</Text>
                    <Text size="xs" c="dimmed">Premium Quality & Technology</Text>
                </Stack>

                <Group className={classes.links}>{items}</Group>
                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <IconBrandTwitter size={18} stroke={1.5} />
                    <IconBrandYoutube size={18} stroke={1.5} />
                    <IconBrandInstagram size={18} stroke={1.5} />
                </Group>
            </Container>
        </div>
    );
}
