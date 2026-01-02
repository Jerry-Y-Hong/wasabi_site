'use client';

import { Group, Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

const LANGUAGES = [
    { value: 'ko', label: 'Korean' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'es', label: 'Spanish' },
    { value: 'ar', label: 'Arabic' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' },
];

export function TranslationWidget() {
    const { language, setLanguage } = useTranslation();

    return (
        <Group gap={0} align="center">
            <Select
                data={LANGUAGES}
                value={language}
                onChange={(val) => setLanguage(val as any)}
                size="xs"
                w={100}
                variant="unstyled"
                leftSection={<IconLanguage size={16} color="var(--mantine-color-wasabi-7)" />}
                allowDeselect={false}
                styles={{
                    input: {
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--mantine-color-dark-4)',
                        paddingLeft: '33px'
                    },
                    option: {
                        fontSize: '12px',
                        fontWeight: 600
                    }
                }}
                comboboxProps={{
                    shadow: 'xl',
                    transitionProps: { transition: 'pop-top-right', duration: 200 },
                    withinPortal: true
                }}
            />
        </Group>
    );
}
