'use client';
import { Container, Group, Anchor, Text, Stack, Image, ActionIcon } from '@mantine/core';
import { IconBrandTwitterFilled, IconBrandYoutubeFilled, IconBrandInstagram, IconBrandX, IconArticle } from '@tabler/icons-react';
import { Logo } from '../Branding/Logo';
import classes from './Footer.module.css';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export function Footer() {
    const { t } = useTranslation();

    const groups = [
        {
            title: t('footer_title_aero'),
            links: [
                { label: t('nav_smartfarm_tech'), link: '/solutions' },
                { label: t('nav_seedlings'), link: '/products/seedlings' },
                { label: t('nav_control_system'), link: '/solutions/control-system' },
            ],
        },
        {
            title: t('footer_title_food'),
            links: [
                { label: t('nav_fresh_wasabi'), link: '/products/fresh' },
                { label: t('nav_processed_food'), link: '/food' },
                { label: t('nav_dist_partner'), link: '/food' },
            ],
        },
        {
            title: t('footer_title_trade'),
            links: [
                { label: t('nav_export'), link: '/trade' },
                { label: t('nav_sourcing'), link: '/trade' },
                { label: t('nav_b2b_platform'), link: '/trade' },
            ],
        },
        {
            title: t('footer_title_company'),
            links: [
                { label: t('nav_news'), link: '/news' },
                { label: t('nav_contact'), link: '/contact' },
                { label: t('nav_terms'), link: '/terms' },
            ],
        },
    ];

    const items = groups.map((group) => {
        const links = group.links.map((link, index) => (
            <Anchor
                key={index}
                c="dimmed"
                href={link.link}
                lh={1}
                component={Link}
                size="sm"
            >
                {link.label}
            </Anchor>
        ));

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        );
    });

    return (
        <div className={classes.footer}>
            <Container className={classes.inner} size="xl">
                <Group gap="md">
                    <Link href="/">
                        <Logo size={60} withText={false} />
                    </Link>
                    <Stack gap={0}>
                        <Text size="lg" fw={800} c="wasabi.8">K-Farm Group</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_addr')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_farm_addr')}</Text>
                        <Text size="xs" c="gray.6" fw={500} mt={5}>{t('footer_license_title')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_company')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_ceo')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_business_license')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_ecommerce_license')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>{t('footer_tel')}</Text>
                        <Text size="xs" c="gray.6" fw={500}>Business Contact: Jerry Y. Hong</Text>
                        <Text size="xs" c="gray.6" fw={500}>Email: sbienv0633@gmail.com</Text>
                        <Text size="xs" c="gray.6" fw={500}>Web: ksmart-farm.com</Text>
                    </Stack>
                </Group>

                <Group className={classes.links}>{items}</Group>

                <Group gap="xs" justify="flex-end" wrap="nowrap">
                    <ActionIcon size="lg" color="black" variant="subtle">
                        <IconBrandX size={24} />
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
