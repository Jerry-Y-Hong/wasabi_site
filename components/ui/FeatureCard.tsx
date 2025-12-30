'use client';

import { Card, Image, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';
import classes from './FeatureCard.module.css';
import { useTranslation } from '@/lib/i18n';

interface FeatureCardProps {
    image: string;
    title: string;
    description: string;
    link: string;
}

export function FeatureCard({ image, title, description, link }: FeatureCardProps) {
    const { t } = useTranslation();

    return (
        <Card withBorder radius="md" p="md" className="feature-card-hover">
            <Card.Section>
                <Image
                    src={image}
                    alt={title}
                    height={200}
                    style={{ objectFit: 'cover' }}
                />
            </Card.Section>

            <Card.Section mt="md" px="md" pb="md">
                <Text fz="lg" fw={800} c="dark.9" mb={5}>
                    {title}
                </Text>
                <Text fz="sm" c="gray.7" fw={500} lineClamp={3}>
                    {description}
                </Text>
            </Card.Section>

            <Group mt="auto" px="md" pb="md">
                <Button
                    component={Link}
                    href={link}
                    radius="md"
                    style={{ flex: 1 }}
                    color="wasabi.8"
                >
                    {t('btn_more')}
                </Button>
            </Group>
        </Card>
    );
}
