'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader, Center, Stack, Text } from '@mantine/core';

import { checkAuthStatus } from '@/lib/checkAuth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const verify = async () => {
            const isValid = await checkAuthStatus();
            if (!isValid) {
                router.replace('/login');
            } else {
                setIsAuthorized(true);
            }
            setChecking(false);
        };
        verify();
    }, [router]);

    if (checking) {
        return (
            <Center h="100vh">
                <Stack align="center">
                    <Loader color="wasabi" />
                    <Text size="sm" c="dimmed">Verifying Security Credentials...</Text>
                </Stack>
            </Center>
        );
    }

    if (!isAuthorized) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {children}
        </div>
    );
}
