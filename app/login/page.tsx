'use client';

import { useState } from 'react';
import { Container, Paper, Title, PasswordInput, Button, Stack, Text, Center } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from './actions';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const success = await setAuthCookie(password);
            if (success) {
                router.push('/admin');
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt={100}>
            <Paper radius="md" p="xl" withBorder>
                <Title order={3} ta="center" mb="lg">
                    Admin Access
                </Title>

                <Stack>
                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Enter admin code"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        error={error}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                    />

                    <Button fullWidth onClick={handleLogin} loading={loading} color="wasabi">
                        Login
                    </Button>

                    <Center>
                        <Text size="xs" c="dimmed">Restricted Area</Text>
                    </Center>
                </Stack>
            </Paper>
        </Container>
    );
}
