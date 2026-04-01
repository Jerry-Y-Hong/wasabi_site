'use client';

import { Group, Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

const LANGUAGES = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'zh-CN', label: '简体中文' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'ar', label: 'العربية' },
    { value: 'th', label: 'ไทย' },
    { value: 'vi', label: 'Tiếng Việt' },
];

export function TranslationWidget() {
    const { language, setLanguage } = useTranslation();

    const handleLanguageChange = (val: string | null) => {
        if (!val) return;

        // Update local state and cookie for i18n
        setLanguage(val as any);
        localStorage.setItem('kfarm_lang', val);

        // Google Translate Cookie Fallback (Crucial for persistence)
        // Format: /ko/[target_lang]
        const gtCookieValue = val === 'ko' ? '' : `/ko/${val}`;
        document.cookie = `googtrans=${gtCookieValue}; path=/`;
        document.cookie = `googtrans=${gtCookieValue}; path=/; domain=${window.location.hostname}`;

        // Google Translate programmatic trigger
        const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (gtCombo) {
            gtCombo.value = val === 'ko' ? 'ko' : val;
            gtCombo.dispatchEvent(new Event('change'));
        } else {
            console.warn('Google Translate widget not found, falling back to cookie and reload if necessary');
            // Force reload if element not found to let cookie take effect
            // window.location.reload(); 
        }
    };

    return (
        <Group gap={0} align="center">
            <Select id="translation-widget"
                data={LANGUAGES}
                value={language}
                onChange={handleLanguageChange}
                size="xs"
                w={110}
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
