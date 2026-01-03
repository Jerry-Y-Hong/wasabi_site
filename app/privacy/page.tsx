'use client';

import { Container, Title, Text, List, ThemeIcon, Paper, Anchor, Divider } from '@mantine/core';

export default function PrivacyPolicyPage() {
    return (
        <Container size="md" py={80}>
            <Paper p="xl" withBorder radius="md" shadow="sm">
                <Title order={1} mb="lg" size={32}>Privacy Policy</Title>
                <Text c="dimmed" mb="xl">Last updated: December 29, 2025</Text>

                <Text mb="md">
                    K-Farm ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by K-Farm.
                </Text>

                <Title order={3} mt="xl" mb="md">1. Information We Collect</Title>
                <Text mb="sm">We collect information that you voluntarily provide to us when you:</Text>
                <List withPadding mb="md">
                    <List.Item>Fill out a contact form or consulting inquiry.</List.Item>
                    <List.Item>Subscribe to our newsletter or blog updates.</List.Item>
                    <List.Item>Download our whitepapers or materials.</List.Item>
                </List>
                <Text mb="sm">This information may include your name, email address, phone number, company name, and any other details you choose to provide.</Text>

                <Title order={3} mt="xl" mb="md">2. How We Use Your Information</Title>
                <Text mb="sm">We use the information we collect for various purposes, including to:</Text>
                <List withPadding mb="md">
                    <List.Item>Provide, operate, and maintain our website and services.</List.Item>
                    <List.Item>Respond to your comments, questions, and requests.</List.Item>
                    <List.Item>Send you technical notices, updates, and support messages.</List.Item>
                    <List.Item>Communicate with you about products, services, offers, and events offered by K-Farm.</List.Item>
                </List>

                <Title order={3} mt="xl" mb="md">3. Sharing of Information</Title>
                <Text mb="md">
                    We do not share your personal information with third parties without your consent, except in the following circumstances:
                </Text>
                <List withPadding mb="md">
                    <List.Item><strong>Service Providers:</strong> We may share information with vendors who perform services on our behalf.</List.Item>
                    <List.Item><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in the good faith belief that such action is necessary.</List.Item>
                </List>

                <Title order={3} mt="xl" mb="md">4. Data Security</Title>
                <Text mb="md">
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet transmission is completely secure.
                </Text>

                <Title order={3} mt="xl" mb="md">5. Contact Us</Title>
                <Text mb="md">
                    If you have any questions about this Privacy Policy, please contact us at:
                </Text>
                <Paper withBorder p="md" bg="gray.0">
                    <Text fw={700}>K-Farm Inc.</Text>
                    <Text>Email: info@k-wasabi.kr</Text>
                    <Text>Phone: +82-2-123-4567</Text>
                    <Text>Address: Seoul, Republic of Korea</Text>
                </Paper>
            </Paper>
        </Container>
    );
}
