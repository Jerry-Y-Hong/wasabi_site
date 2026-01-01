'use client';

import { Container, Title, Text, Card, Badge, Group, ThemeIcon, Stack, Loader, Box } from '@mantine/core';
import { IconArrowRight, IconLeaf } from '@tabler/icons-react';
import { getBlogPosts } from '@/lib/actions';
import { useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';

export default function NewsPage() {
    const { t, language } = useTranslation();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getBlogPosts(language);
                setPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [language]);

    const validPosts = posts.filter((p: any) => p && p.title);

    return (
        <Container size="xl" py={60}>
            {/* Hero Section */}
            <Box mb={60} ta="center">
                <Badge size="lg" variant="dot" color="wasabi" mb="md">{t('news_hero_badge')}</Badge>
                <Title order={1} size={48} mb="sm" style={{ fontFamily: 'Greycliff CF, sans-serif' }}>
                    {t('news_hero_title')}
                </Title>
                <Text c="dimmed" size="lg" maw={600} mx="auto">
                    {t('news_hero_desc')}
                </Text>
            </Box>

            {loading ? (
                <Stack align="center" py={100}>
                    <Loader color="wasabi" />
                </Stack>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {validPosts.length > 0 ? (
                        validPosts.map((post: any) => (
                            <Card key={`${language}-${post.id || Math.random()}`} padding="lg" radius="md" withBorder shadow="sm" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Group justify="space-between" mb="xs" wrap="nowrap">
                                    <Badge color="wasabi" variant="light" style={{ maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {post.topic || 'News'}
                                    </Badge>
                                    <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                                        {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Date'}
                                    </Text>
                                </Group>

                                <a href={`/blog/${post.slug || '#'}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Title order={3} size="h4" mb="sm" lineClamp={2} style={{ minHeight: '3.1em', lineHeight: 1.3, cursor: 'pointer' }}>
                                        {post.title}
                                    </Title>
                                </a>

                                <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ minHeight: '4.5em' }}>
                                    {(post.content || '')
                                        .replace(new RegExp(`^#\\s*${post.title?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n?`, 'i'), '') // Remove title if it starts the content
                                        .replace(/[#*`]/g, '')}
                                </Text>

                                <Group mt="auto">
                                    <a
                                        href={`/blog/${post.slug || '#'}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '8px 12px',
                                            color: '#2b8a3e',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            textDecoration: 'none',
                                            backgroundColor: '#ebfbee',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t('news_read_more')} <IconArrowRight size={16} style={{ marginLeft: 6 }} />
                                    </a>
                                </Group>
                            </Card>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                            <ThemeIcon size={60} radius="xl" color="gray" variant="light" mb="md">
                                <IconLeaf size={30} />
                            </ThemeIcon>
                            <Title order={3} c="dimmed">{t('news_no_posts_title')}</Title>
                            <Text c="dimmed">{t('news_no_posts_desc')}</Text>
                        </div>
                    )}
                </div>
            )}
        </Container>
    );
}
