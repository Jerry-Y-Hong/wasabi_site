'use client';

import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { LanguageProvider } from '@/lib/i18n';
import { theme } from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <MantineProvider theme={theme}>
                <Notifications />
                {children}
            </MantineProvider>
        </LanguageProvider>
    );
}
