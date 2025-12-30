'use client';

import { Container, Title, Text, TextInput, Textarea, Button, Group, SimpleGrid, Paper, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { saveContactInquiry } from '@/lib/actions';
import { useTranslation } from '@/lib/i18n';

export default function ContactPage() {
    const { t } = useTranslation();
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
            <Title order={1} ta="center" mb="lg">{t('contact_title')}</Title>
            <Text c="dimmed" ta="center" mb="xl">
                {t('contact_desc')}
            </Text>

            <Paper p="md" withBorder mb="lg" bg="gray.0">
                <Text fw={500} size="sm" ta="center">{t('contact_direct')}</Text>
                <Text ta="center" size="sm">Email: <Text span c="wasabi" fw={700}>info@k-wasabi.kr</Text></Text>
                <Text ta="center" size="sm" c="dimmed">{t('contact_tel_label')}: 82-10-4355-0633</Text>
            </Paper>

            <Paper p="xl" withBorder radius="md shadow-md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label={t('contact_cat_label')}
                        placeholder={t('contact_cat_label')}
                        data={[
                            { value: 'Product Inquiry', label: t('contact_cat_1') },
                            { value: 'Partnership', label: t('contact_cat_2') },
                            { value: 'Farm Visit', label: t('contact_cat_3') },
                            { value: 'Investment', label: t('contact_cat_4') },
                            { value: 'Other', label: t('contact_cat_5') }
                        ]}
                        mb="md"
                        required
                        {...form.getInputProps('category')}
                    />

                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput
                            label={t('contact_name_label')}
                            placeholder={t('cons_inquiry_name_ph')}
                            required
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label={t('contact_email_label')}
                            placeholder="your@email.com"
                            required
                            {...form.getInputProps('email')}
                        />
                    </SimpleGrid>

                    <TextInput
                        mt="md"
                        label={t('contact_subject_label')}
                        placeholder={t('contact_subject_label')}
                        required
                        {...form.getInputProps('subject')}
                    />

                    <Textarea
                        mt="md"
                        label={t('contact_message_label')}
                        placeholder={t('cons_inquiry_msg_ph')}
                        minRows={4}
                        {...form.getInputProps('message')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" color="wasabi" size="md">{t('contact_btn_send')}</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
}
