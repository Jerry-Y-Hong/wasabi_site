'use client';

import { Card, Image, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';
import classes from './FeatureCard.module.css';

interface FeatureCardProps {
    image: string;
    title: string;
    description: string;
    link: string;
}

export function FeatureCard({ image, title, description, link }: FeatureCardProps) {
    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image
                    src={image}
                    alt={title}
                    height={200}
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        display: 'block'
                    }}
                />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz="lg" fw={500}>
                        {title}
                    </Text>
                </Group>
                <Text fz="sm" mt="xs" c="dimmed">
                    {description}
                </Text>
            </Card.Section>

            <Group mt="xs">
                <Button component={Link} href={link} radius="md" style={{ flex: 1 }}>
                    Learn More
                </Button>
            </Group>
        </Card>
    );
}
