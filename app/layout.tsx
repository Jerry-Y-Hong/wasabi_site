'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import AIConcierge from '@/components/ui/AIConcierge';
import { LanguageProvider } from '@/lib/i18n';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <LanguageProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            <Header />
            <main>{children}</main>
            <Footer />
            <AIConcierge />
          </MantineProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
