import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Breadcrumbs } from '@/components/Layout/Breadcrumbs';
import AIConcierge from '@/components/ui/AIConcierge';
import { Providers } from '@/components/Layout/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'ko',
                  includedLanguages: 'en,ja,zh-CN,fr,de,es,ar,vi,th',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
      </head>
      <body suppressHydrationWarning={true}>
        {/* Hidden but present for Google Translate initialization */}
        <div id="google_translate_element" style={{ visibility: 'hidden', width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}></div>
        <Providers>
          <Header />
          <Breadcrumbs />
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
          <AIConcierge />
        </Providers>
      </body>
    </html>
  );
}
