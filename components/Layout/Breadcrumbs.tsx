'use client';

import { Container, Breadcrumbs as MantineBreadcrumbs, Anchor, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { IconChevronRight } from '@tabler/icons-react';

export function Breadcrumbs() {
    const pathname = usePathname();
    const { t } = useTranslation();

    if (pathname === '/') return null;

    const items = pathname
        .split('/')
        .filter((part) => part)
        .map((part, index, all) => {
            const href = `/${all.slice(0, index + 1).join('/')}`;
            const labelKey = `nav_${part.replace(/-/g, '_')}`;
            const label = t(labelKey) !== labelKey ? t(labelKey) : part;

            const isLast = index === all.length - 1;

            if (isLast) {
                return (
                    <Text key={index} size="sm" fw={500} c="wasabi.6">
                        {label}
                    </Text>
                );
            }

            return (
                <Anchor component={Link} href={href} key={index} size="sm" c="dimmed">
                    {label}
                </Anchor>
            );
        });

    return (
        <Container size="xl" py="md">
            <MantineBreadcrumbs separator={<IconChevronRight size={14} />} separatorMargin="md">
                <Anchor component={Link} href="/" size="sm" c="dimmed">
                    {t('nav_home')}
                </Anchor>
                {items}
            </MantineBreadcrumbs>
        </Container>
    );
}
