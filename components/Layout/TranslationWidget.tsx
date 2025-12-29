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
                    includedLanguages: 'en,ko,ja,zh-CN,zh-TW,de,fr,es,ar', // Major languages only
                    layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL, // Force dropdown for language selection
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
        <Group gap={5} align="center" style={{ marginRight: 10 }}>
            <IconLanguage size={18} />
            <Text size="sm" fw={700}>Language</Text>
            {/* Google Translate Container */}
            <div id="google_translate_element" style={{ minHeight: '20px' }}></div>

            {/* Force hide the 'Select Language' text from Google using Global Styles */}
            <style jsx global>{`
                .goog-te-gadget {
                    font-family: 'Roboto', sans-serif !important;
                    font-size: 0 !important; /* Hide text */
                }
                .goog-te-gadget span {
                    display: none !important; /* Hide 'Select Language' label */
                }
                .goog-te-combo {
                    margin: 0 !important;
                    padding: 4px !important;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    font-size: 14px !important; /* Restore font size for dropdown items */
                }
            `}</style>
        </Group>
    );
}
