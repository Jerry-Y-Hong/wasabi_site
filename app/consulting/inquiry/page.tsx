'use client';

import { Container, Title, Text, TextInput, Textarea, Button, Group, SimpleGrid, Select, MultiSelect, NumberInput, Paper, Stack, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { saveConsultingInquiry } from '@/lib/actions';

export default function ConsultingInquiryPage() {
    const form = useForm({
        initialValues: {
            name: '',
            organization: '',
            email: '',
            phone: '',
            location: '',
            facilitySize: 500,
            budget: '',
            interests: [],
            message: '',
        },

        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            organization: (value) => (value.length < 2 ? 'Please enter your organization' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await saveConsultingInquiry(values);
            notifications.show({
                title: 'Inquiry Submitted',
                message: 'Thank you for your interest. Our consulting team has received your request.',
                color: 'wasabi',
            });
            form.reset();
        } catch (error) {
            notifications.show({
                title: 'Submission Error',
                message: 'An error occurred while saving your request. Please try again.',
                color: 'red',
            });
        }
    };

    return (
        <Container size="md" py={80}>
            <Stack align="center" mb={40} gap="xs">
                <Title order={1}>Consulting Inquiry</Title>
                <Text c="dimmed" ta="center">
                    Please provide some details about your project. Our experts will get back to you with a customized strategic proposal.
                </Text>
            </Stack>

            <Paper shadow="xl" p="xl" radius="lg" withBorder>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="xl">
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput
                                label="Contact Name"
                                placeholder="Your full name"
                                required
                                {...form.getInputProps('name')}
                            />
                            <TextInput
                                label="Organization / Company"
                                placeholder="Name of your business"
                                required
                                {...form.getInputProps('organization')}
                            />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput
                                label="Email Address"
                                placeholder="your@email.com"
                                required
                                {...form.getInputProps('email')}
                            />
                            <TextInput
                                label="Phone Number"
                                placeholder="+1 (555) 000-0000"
                                required
                                {...form.getInputProps('phone')}
                            />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput
                                label="Proposed Location"
                                placeholder="City, Country"
                                required
                                {...form.getInputProps('location')}
                            />
                            <NumberInput
                                label="Planned Facility Size (sq. meters)"
                                placeholder="e.g. 1000"
                                min={50}
                                step={50}
                                {...form.getInputProps('facilitySize')}
                            />
                        </SimpleGrid>

                        <Select
                            label="Estimated Budget Range"
                            placeholder="Select a range"
                            data={[
                                { value: 'under-100k', label: 'Under $100,000' },
                                { value: '100k-500k', label: '$100,000 - $500,000' },
                                { value: '500k-1m', label: '$500,000 - $1M' },
                                { value: 'over-1m', label: 'Over $1M' },
                            ]}
                            {...form.getInputProps('budget')}
                        />

                        <MultiSelect
                            label="Specific Interests"
                            placeholder="Pick all that apply"
                            data={[
                                { value: 'design', label: 'Facility Design & Layout' },
                                { value: 'systems', label: 'Aeroponic Systems & Hardware' },
                                { value: 'seedlings', label: 'Tissue Culture Seedling Supply' },
                                { value: 'training', label: 'Cultivation Training & Tech Transfer' },
                                { value: 'roi', label: 'ROI Modeling & Business Strategy' },
                                { value: 'distribution', label: 'Purchase Guarantee & Distribution' },
                            ]}
                            {...form.getInputProps('interests')}
                            clearable
                        />

                        <Textarea
                            label="Additional Message"
                            placeholder="Tell us more about your vision and specific requirements"
                            minRows={4}
                            {...form.getInputProps('message')}
                        />

                        <Box>
                            <Button
                                type="submit"
                                size="lg"
                                color="wasabi"
                                fullWidth
                                variant="gradient"
                                gradient={{ from: 'wasabi.6', to: 'lime.6' }}
                            >
                                Submit Consultation Request
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>

            <Box mt={40} ta="center">
                <Text size="sm" c="dimmed">
                    Your information is protected by our global privacy policy and will only be used for consulting purposes.
                </Text>
            </Box>
        </Container>
    );
}
