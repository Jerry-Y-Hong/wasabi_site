'use client';

import { useState } from 'react';
import { Container, Paper, Title, PasswordInput, Button, Stack, Text, Alert } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { updateAdminPassword } from '../actions';

export default function PasswordSettingsPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        try {
            const result = await updateAdminPassword(password);
            if (result.success) {
                setMessage({ type: 'success', text: result.message });
                setPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" py={50}>
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mb="lg">Change Admin Password</Title>

                <form onSubmit={handleSubmit}>
                    <Stack>
                        {message && (
                            <Alert
                                color={message.type === 'success' ? 'green' : 'red'}
                                icon={message.type === 'success' ? <IconCheck /> : <IconAlertCircle />}
                            >
                                {message.text}
                            </Alert>
                        )}

                        <PasswordInput
                            required
                            label="New Password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                        />

                        <PasswordInput
                            required
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                        />

                        <Button type="submit" fullWidth mt="xl" loading={loading} color="red">
                            Update Password
                        </Button>

                        <Text c="dimmed" size="sm" ta="center" mt="md">
                            This will define the password for both Dashboard and Simulator login.
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
