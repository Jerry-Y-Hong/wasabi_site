'use client';

import { useEffect } from 'react';
import { Group, Text } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

export function TranslationWidget() {
    useEffect(() => {
        // Define the initialization function globally
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en', // Main site language
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        // Inject the Google Translate script if not already present
        const scriptId = 'google-translate-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <Group gap="xs" align="center" style={{ marginRight: 10 }}>
            {/* Provide a container for the Google Translate widget */}
            <div id="google_translate_element" style={{ minHeight: '20px' }}></div>
        </Group>
    );
}
