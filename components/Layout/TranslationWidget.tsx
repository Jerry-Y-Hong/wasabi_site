'use client';

import { useEffect, useState } from 'react';
import { Group, Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
    { value: 'zh-CN', label: '中文 (简体)' },
    { value: 'zh-TW', label: '中文 (繁體)' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'ar', label: 'Arabic (العربية)' },
];

export function TranslationWidget() {
    // Default to English if no preference
    const [selected, setSelected] = useState<string | null>('en');

    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,ko,ja,zh-CN,zh-TW,de,fr,es,ar',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        const scriptId = 'google-translate-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleChange = (value: string | null) => {
        if (!value) return;
        setSelected(value);

        // Magic: Control the hidden Google Widget
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (combo) {
            combo.value = value;
            combo.dispatchEvent(new Event('change'));
        }
    };

    return (
        <Group gap={5} align="center" style={{ marginRight: 10 }}>
            {/* Custom Native Language Selector */}
            <Select
                placeholder="Language"
                data={LANGUAGES}
                value={selected}
                onChange={handleChange}
                size="xs"
                w={110}
                variant="filled"
                leftSection={<IconLanguage size={14} />}
                allowDeselect={false}
                styles={{
                    input: {
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: '#f1f3f5',
                        border: 'none'
                    }
                }}
            />

            {/* Completely Hidden Google Translate Widget */}
            <div id="google_translate_element" style={{ display: 'none' }}></div>
        </Group>
    );
}
