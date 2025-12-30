'use client';

import { Container, Group, Anchor, Text, Stack, Image } from '@mantine/core';
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
                <Group gap="md">
                    <Image src="/images/logo.jpg?v=5" alt="Logo" h={60} w={75} className={classes.logo} style={{ borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }} />
                    <Stack gap={0}>
                        <Text size="lg" fw={700} c="wasabi">K-Farm Group / Wasabi Div.</Text>
                        <Text size="xs" c="dimmed">745, Damok-ri, Sangseo-myeon, Hwacheon-gun, Gangwon-state, Republic of Korea</Text>
                        <Text size="xs" c="dimmed">Tel: 82-10-4355-0633</Text>
                        <Text size="xs" c="dimmed">Email: info@k-wasabi.kr</Text>
                        <Text size="xs" c="dimmed" mt={5}>International Marketing / Jerry Y. Hong</Text>
                        <Text size="xs" c="dimmed">Premium Quality & Technology</Text>
                    </Stack>
                </Group>

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
