import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export const metadata = {
  title: 'K-Farm Group / Wasabi Div.',
  description: 'Premium Wasabi, AI-Aeroponic Systems, and Global Smart Farm Innovation',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <Header />
          {children}
          {/* AIConcierge is resting per user request */}
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
