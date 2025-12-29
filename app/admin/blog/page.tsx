'use client';

import { Container, Title, Text, TextInput, Textarea, Button, Group, Stack, Select, Paper, Badge, Loader, SimpleGrid, Card, Code, CopyButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { IconRobot, IconPencil, IconDeviceFloppy, IconEye } from '@tabler/icons-react';
import { generateBlogContent } from '@/lib/ai'; // We need to update this function signature
import { saveBlogPost, getBlogPosts } from '@/lib/actions';

export default function BlogAdminPage() {
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [suggestedPrompt, setSuggestedPrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [aiTitle, setAiTitle] = useState(''); // Store AI generated title separately
    const [posts, setPosts] = useState<any[]>([]);

    const form = useForm({
        initialValues: {
            topic: '',
            keywords: '',
            tone: 'Professional & Authoritative',
            language: 'Korean', // Default to Korean for local SEO
            category: 'Company Blog', // Default category
        },
        validate: {
            topic: (value) => (value.length < 2 ? 'Topic is required' : null),
        },
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const data = await getBlogPosts();
        setPosts(data);
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Call AI Generation
            const result = await generateBlogContent(
                form.values.topic,
                form.values.tone,
                form.values.language,
                form.values.keywords
            );

            if (result.content) {
                setGeneratedContent(result.content); // Markdown content

                // Store title but DO NOT overwrite user's topic input
                if (result.title) {
                    setAiTitle(result.title);
                }

                // 🚀 Generate AI Image using Pollinations.ai (Free & High Quality)
                if (result.imagePrompt) {
                    setSuggestedPrompt(result.imagePrompt);
                    const safePrompt = encodeURIComponent(result.imagePrompt);
                    // Add seed to ensure unique image every time
                    const seed = Math.floor(Math.random() * 1000000);
                    // Use 'flux' model for realistic quality
                    const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=1024&height=600&seed=${seed}&model=flux&nologo=true`;

                    setSelectedImage(imageUrl);
                }

                notifications.show({ title: 'Draft Generated', message: 'Review the content below.', color: 'wasabi' });

            } else {
                notifications.show({ title: 'Error', message: 'Failed to generate content.', color: 'red' });
            }
        } catch (error) {
            notifications.show({ title: 'Error', message: 'AI Service unavailable.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!generatedContent) return;

        // Use AI title if available, otherwise user topic
        const title = aiTitle || form.values.topic;

        const postData = {
            title: title,
            content: generatedContent, // Markdown
            topic: form.values.topic,
            keywords: form.values.keywords,
            tags: form.values.keywords.split(',').map(s => s.trim()).filter(Boolean),
            author: 'AI Writer', // or 'K-Farm Team'
            image: selectedImage, // Save the selected image path
            category: form.values.category // Save category
        };

        const result = await saveBlogPost(postData);
        if (result.success) {
            notifications.show({ title: 'Published!', message: 'Blog post saved successfully.', color: 'green' });
            loadPosts();
            setGeneratedContent('');
            form.reset();
        } else {
            notifications.show({ title: 'Error', message: 'Failed to save post.', color: 'red' });
        }
    };

    return (
        <Container size="xl" py="xl">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {/* Left Column: Generator */}
                <Stack>
                    <Title order={2}>AI Blog Writer</Title>
                    <Text c="dimmed">Generate SEO-optimized articles in seconds.</Text>

                    <Paper p="md" withBorder radius="md">
                        <Stack>
                            <TextInput
                                label="Topic / Title Idea"
                                placeholder="e.g. Benefits of Wasabi in Vertical Farming"
                                required
                                {...form.getInputProps('topic')}
                            />

                            <Select
                                label="Post Category"
                                data={[
                                    { value: 'Company Blog', label: 'Company Blog (K-Farm News)' },
                                    { value: 'Global News', label: 'Global Tech & Trends' },
                                    { value: 'Innovation', label: 'Innovation & Tech Data (Technical Materials)' }
                                ]}
                                {...form.getInputProps('category')}
                            />

                            <TextInput
                                label="Target Keywords (Optional)"
                                placeholder="e.g. smart farm, hydroponics, investment"
                                {...form.getInputProps('keywords')}
                            />
                            <Group grow>
                                <Select
                                    label="Tone"
                                    data={[
                                        'Professional & Authoritative',
                                        'Friendly & Educational',
                                        'Persuasive (Sales-focused)',
                                        'Technical & Data-driven'
                                    ]}
                                    {...form.getInputProps('tone')}
                                />
                                <Select
                                    label="Language"
                                    data={['Korean', 'English', 'Japanese']}
                                    {...form.getInputProps('language')}
                                />
                            </Group>
                            <Button
                                leftSection={<IconRobot size={20} />}
                                color="wasabi"
                                size="md"
                                onClick={handleGenerate}
                                loading={loading}
                                disabled={!form.isValid()}
                            >
                                Generate Draft
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Image Selection Panel */}
                    {generatedContent && (
                        <Paper p="md" withBorder radius="md">
                            <Stack>
                                <Title order={4}>Cover Image Selection</Title>

                                {suggestedPrompt && (
                                    <Stack gap={5}>
                                        <Text size="xs" fw={700} c="dimmed">AI SUGGESTED IMAGE PROMPT (Copy for Midjourney/DALL-E):</Text>
                                        <Group>
                                            <Code block style={{ flex: 1, whiteSpace: 'normal' }}>
                                                {suggestedPrompt}
                                            </Code>
                                            <CopyButton value={suggestedPrompt}>
                                                {({ copied, copy }) => (
                                                    <Button color={copied ? 'teal' : 'gray'} onClick={copy} size="xs">
                                                        {copied ? 'Copied' : 'Copy'}
                                                    </Button>
                                                )}
                                            </CopyButton>
                                        </Group>
                                    </Stack>
                                )}

                                <Text size="sm" fw={500} mt="sm">Or Select a Quick Stock Image:</Text>
                                <SimpleGrid cols={3}>
                                    {[
                                        { id: 'stock_lab', src: '/images/blog/stock_lab.png', label: 'Lab' },
                                        { id: 'stock_leaf', src: '/images/blog/stock_leaf.png', label: 'Leaf' },
                                        { id: 'none', src: '', label: 'None' }
                                    ].map((img) => (
                                        <Card
                                            key={img.id}
                                            p={0}
                                            radius="sm"
                                            withBorder
                                            style={{
                                                cursor: 'pointer',
                                                borderColor: selectedImage === img.src ? '#40C057' : 'transparent',
                                                borderWidth: 3
                                            }}
                                            onClick={() => setSelectedImage(img.src)}
                                        >
                                            {img.src ? (
                                                <img src={img.src} alt={img.label} style={{ width: '100%', height: 60, objectFit: 'cover' }} />
                                            ) : (
                                                <Stack align="center" justify="center" h={60} bg="gray.1">
                                                    <Text size="xs" c="dimmed">No Image</Text>
                                                </Stack>
                                            )}
                                        </Card>
                                    ))}
                                </SimpleGrid>
                            </Stack>
                        </Paper>
                    )}

                    {/* Editor Area */}
                    {generatedContent && (
                        <Paper p="md" withBorder radius="md" style={{ borderColor: '#40C057', borderWidth: 2 }}>
                            <Group justify="space-between" mb="xs">
                                <Title order={4} c="wasabi">Editor (Markdown)</Title>
                                <Badge color="gray">Draft Mode</Badge>
                            </Group>
                            <Textarea
                                autosize
                                minRows={15}
                                value={generatedContent}
                                onChange={(e) => setGeneratedContent(e.currentTarget.value)}
                                style={{ fontFamily: 'monospace' }}
                            />
                            <Group justify="flex-end" mt="md">
                                <Button variant="default" onClick={() => setGeneratedContent('')}>Discard</Button>
                                <Button
                                    leftSection={<IconDeviceFloppy size={20} />}
                                    color="blue"
                                    onClick={handlePublish}
                                >
                                    Publish to Blog
                                </Button>
                            </Group>
                        </Paper>
                    )}
                </Stack>

                {/* Right Column: Recent Posts */}
                <Stack>
                    <Title order={3}>Recent Posts</Title>
                    {posts.length === 0 ? (
                        <Text c="dimmed">No posts yet.</Text>
                    ) : (
                        posts.map((post: any) => (
                            <Card key={post.id} withBorder padding="sm" radius="md">
                                <Group justify="space-between" mb="xs">
                                    <Text fw={700} lineClamp={1}>{post.title}</Text>
                                    <Badge size="sm" variant="light">{new Date(post.timestamp).toLocaleDateString()}</Badge>
                                </Group>
                                <Text size="sm" c="dimmed" lineClamp={2}>
                                    {post.content.replace(/[#*`]/g, '')}
                                </Text>
                                <Group justify="flex-end" mt="xs">
                                    <Button component="a" href={`/blog/${post.slug}`} target="_blank" size="xs" variant="subtle" rightSection={<IconEye size={14} />}>
                                        View
                                    </Button>
                                </Group>
                            </Card>
                        ))
                    )}
                </Stack>
            </SimpleGrid>
        </Container>
    );
}
