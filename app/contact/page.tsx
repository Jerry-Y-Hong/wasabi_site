'use client';

import { Container, Title, Text, TextInput, Textarea, Button, Group, SimpleGrid, Paper, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { saveContactInquiry } from '@/lib/actions';

export default function ContactPage() {
    const form = useForm({
        initialValues: {
            category: 'Product Inquiry',
            name: '',
            email: '',
            subject: '',
            message: '',
        },
        validate: {
            name: (value: string) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            subject: (value: string) => (value.length < 1 ? 'Subject is required' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await saveContactInquiry(values);
            notifications.show({
                title: 'Message Sent',
                message: 'Thank you for reaching out. We have received your message.',
                color: 'wasabi',
            });
            form.reset();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to save your inquiry. Please try again.',
                color: 'red',
            });
        }
    };

    return (
        <Container size="sm" py="xl">
            <Title order={1} ta="center" mb="lg">Contact Us</Title>
            <Text c="dimmed" ta="center" mb="xl">
                Have questions about our products or consulting services?
                Fill out the form below and we will get back to you shortly.
            </Text>

            <Paper p="md" withBorder mb="lg" bg="gray.0">
                <Text fw={500} size="sm" ta="center">Direct Contact</Text>
                <Text ta="center" size="sm">Email: <Text span c="wasabi" fw={700}>info@k-wasabi.kr</Text></Text>
                <Text ta="center" size="sm" c="dimmed">Mobile: 82-10-4355-0633</Text>
            </Paper>

            <Paper p="xl" withBorder radius="md shadow-md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Inquiry Category"
                        placeholder="Select category"
                        data={[
                            'Product Inquiry',
                            'Partnership',
                            'Farm Visit',
                            'Investment',
                            'Other'
                        ]}
                        mb="md"
                        required
                        {...form.getInputProps('category')}
                    />

                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            required
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Email"
                            placeholder="your@email.com"
                            required
                            {...form.getInputProps('email')}
                        />
                    </SimpleGrid>

                    <TextInput
                        mt="md"
                        label="Subject"
                        placeholder="Subject"
                        required
                        {...form.getInputProps('subject')}
                    />

                    <Textarea
                        mt="md"
                        label="Message"
                        placeholder="Your message"
                        minRows={4}
                        {...form.getInputProps('message')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" color="wasabi" size="md">Send Message</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
}
