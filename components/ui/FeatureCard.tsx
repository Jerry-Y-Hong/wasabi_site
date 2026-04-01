'use client';

import { Card, Image, Text, Button, Group, Box } from '@mantine/core';
import Link from 'next/link';
import classes from './FeatureCard.module.css';
import { useTranslation } from '@/lib/i18n';
import { IconArrowRight } from '@tabler/icons-react';

interface FeatureCardProps {
    image: string;
    title: string;
    description: string;
    link: string;
}

export function FeatureCard({ image, title, description, link }: FeatureCardProps) {
    const { t } = useTranslation();

    return (
        <Card radius="lg" p={0} className={`${classes.card} feature-card-hover`}>
            <Box className={classes.imageSection}>
                <Image
                    src={image}
                    alt={title}
                    className={classes.image}
                />
                <Box className={classes.overlay} />
            </Box>

            <Box className={classes.content}>
                <Text fz="lg" fw={800} c="dark.9" mb={5} className={classes.title}>
                    {title}
                </Text>
                <Text fz="sm" c="gray.7" fw={500} lineClamp={3}>
                    {description}
                </Text>

                <Group mt="auto" pt="xl">
                    <Button
                        component={Link}
                        href={link}
                        radius="md"
                        fullWidth
                        className={classes.button}
                        color="wasabi.8"
                        rightSection={<IconArrowRight size={16} />}
                    >
                        {t('btn_more')}
                    </Button>
                </Group>
            </Box>
        </Card>
    );
}
