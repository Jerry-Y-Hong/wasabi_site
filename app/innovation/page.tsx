import { Container, Title, Text, Stack, Badge } from '@mantine/core';

export default function InsightsPage() {
    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60} gap="xs">
                <Badge variant="filled" color="wasabi" size="lg">Innovation & Tech Trends</Badge>
                <Title order={1} ta="center" size="h1">The Global Wasabi Innovation</Title>
                <Text c="dimmed" ta="center" maw={800} size="lg">
                    This page is currently being updated. Please check back shortly.
                </Text>
            </Stack>
        </Container>
    );
}
