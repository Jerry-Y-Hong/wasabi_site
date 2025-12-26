'use client';

import { Container, Title, Text, Card, SimpleGrid, Badge, Group, Image, Stack, Button } from '@mantine/core';
import newsData from '@/data/news.json';
import Link from 'next/link';

export default function NewsPage() {
    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60}>
                <Badge variant="filled" color="wasabi" size="lg">Official News & Innovation</Badge>
                <Title order={1}>K-Farm Newsroom</Title>
                <Text c="dimmed" ta="center" maw={600}>
                    The latest updates from our laboratories, smart farms, and global partnerships.
                </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                {newsData.map((item) => (
                    <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                                src={item.image}
                                height={200}
                                alt={item.title}
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Badge color="blue" variant="light">{item.category}</Badge>
                            <Text size="xs" c="dimmed">{item.date}</Text>
                        </Group>

                        <Title order={3} size="h4" mb="sm">
                            {item.title}
                        </Title>

                        <Text size="sm" c="dimmed" mb="lg" lineClamp={3}>
                            {item.summary}
                        </Text>

                        <Button
                            variant="light"
                            color="wasabi"
                            fullWidth
                            mt="auto"
                            radius="md"
                            component={Link}
                            href={`/news/${item.id}`}
                        >
                            Read Full Story
                        </Button>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
