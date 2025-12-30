'use client';

import { Container, Title, Text, TextInput, Textarea, Button, Group, SimpleGrid, Select, MultiSelect, NumberInput, Paper, Stack, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { saveConsultingInquiry } from '@/lib/actions';
import { useTranslation } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default function ConsultingInquiryPage() {
    const { t } = useTranslation();
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
                <Title order={1}>{t('cons_inquiry_title')}</Title>
                <Text c="dimmed" ta="center">
                    {t('cons_inquiry_desc')}
                </Text>
            </Stack>

            <Paper shadow="xl" p="xl" radius="lg" withBorder>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="xl">
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput
                                label={t('cons_inquiry_name')}
                                placeholder={t('cons_inquiry_name_ph')}
                                required
                                {...form.getInputProps('name')}
                            />
                            <TextInput
                                label={t('cons_inquiry_org')}
                                placeholder={t('cons_inquiry_org_ph')}
                                required
                                {...form.getInputProps('organization')}
                            />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput
                                label={t('cons_inquiry_email')}
                                placeholder="your@email.com"
                                required
                                {...form.getInputProps('email')}
                            />
                            <TextInput
                                label={t('cons_inquiry_phone')}
                                placeholder="+1 (555) 000-0000"
                                required
                                {...form.getInputProps('phone')}
                            />
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput
                                label={t('cons_inquiry_loc')}
                                placeholder={t('cons_inquiry_loc_ph')}
                                required
                                {...form.getInputProps('location')}
                            />
                            <NumberInput
                                label={t('cons_inquiry_size')}
                                placeholder="e.g. 1000"
                                min={50}
                                step={50}
                                {...form.getInputProps('facilitySize')}
                            />
                        </SimpleGrid>

                        <Select
                            label={t('cons_inquiry_budget')}
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
                            label={t('cons_inquiry_interests')}
                            placeholder="Pick all that apply"
                            data={[
                                { value: 'design', label: t('cons_label_arch') },
                                { value: 'systems', label: t('cons_label_sys') },
                                { value: 'seedlings', label: t('feat_1_title') },
                                { value: 'training', label: 'Cultivation Training' },
                                { value: 'roi', label: 'ROI Modeling' },
                                { value: 'distribution', label: 'Distribution' },
                            ]}
                            {...form.getInputProps('interests')}
                            clearable
                        />

                        <Textarea
                            label={t('cons_inquiry_msg')}
                            placeholder={t('cons_inquiry_msg_ph')}
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
                                {t('cons_inquiry_btn_submit')}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>

            <Box mt={40} ta="center">
                <Text size="sm" c="dimmed">
                    {t('cons_inquiry_privacy')}
                </Text>
            </Box>
        </Container>
    );
}
