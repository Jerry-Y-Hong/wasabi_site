'use client';

import { Container, Title, Text, SimpleGrid, Card, Badge, Group } from '@mantine/core';

export default function VideoTestPage() {
    return (
        <Container size="xl" py={50}>
            <Title mb="xl" ta="center">🎬 Video File Comparison Test</Title>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {/* CARD 1: Small File */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Badge color="blue" size="lg">FILE A (Small)</Badge>
                        <Badge variant="outline">2.5 MB</Badge>
                    </Group>
                    <Text fw={500} size="lg" mt="md" mb="xs">
                        Preview Version
                    </Text>
                    <video
                        src="/videos/preview_ver.mp4"
                        controls
                        style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }}
                    />
                    <Text size="sm" c="dimmed" mt="sm">
                        Uses far less data. Loads instantly. Good for mobile.
                    </Text>
                </Card>

                {/* CARD 2: Large File */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="xs">
                        <Badge color="red" size="lg">FILE B (Large)</Badge>
                        <Badge variant="outline">36 MB</Badge>
                    </Group>
                    <Text fw={500} size="lg" mt="md" mb="xs">
                        Full Business Vision
                    </Text>
                    <video
                        src="/videos/biz_vision.mp4"
                        controls
                        style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }}
                    />
                    <Text size="sm" c="dimmed" mt="sm">
                        High quality, but slower to load. Better for desktop wifi.
                    </Text>
                </Card>
            </SimpleGrid>
        </Container>
    );
}
