'use client';

import { Container, Group, Anchor, Text, Stack, Image, ActionIcon } from '@mantine/core';
import { IconBrandTwitterFilled, IconBrandYoutubeFilled, IconBrandInstagram } from '@tabler/icons-react';
import classes from './Footer.module.css';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
    const { t } = useTranslation();

    const links = [
        { link: '/contact', label: t('nav_contact') },
        { link: '/privacy', label: 'Privacy' },
        { link: '/blog', label: 'Blog' },
    ];

    const items = links.map((link) => (
        <Anchor
            c="dimmed"
            key={link.label}
            href={link.link}
            lh={1}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <Container className={classes.inner} size="xl">
                <Group gap="md">
                    <Image src="/images/logo.jpg?v=100" alt="Logo" h={80} w="auto" className={classes.logo} style={{ borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }} />
                    <Stack gap={0}>
                        <Text size="lg" fw={800} c="wasabi.8">K-Farm Group / Wasabi Div.</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_addr')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_tel')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>Email: info@k-wasabi.kr</Text>
                        <Text size="xs" c="gray.6" mt={5} fw={600}>{t('footer_ceo')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>Web: www.k-wasabi.kr</Text>
                    </Stack>
                </Group>

                <Group className={classes.links}>{items}</Group>

                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" color="#1DA1F2" variant="subtle">
                        <IconBrandTwitterFilled size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" color="#FF0000" variant="subtle">
                        <IconBrandYoutubeFilled size={24} />
                    </ActionIcon>
                    <ActionIcon size="lg" color="#E1306C" variant="subtle">
                        <IconBrandInstagram size={24} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Container>
        </div>
    );
}
