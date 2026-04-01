import { Container, Title, Text, Button, Paper, Group, Badge, ThemeIcon, TypographyStylesProvider } from '@mantine/core';
import { IconArrowLeft, IconCalendar, IconUser, IconShare } from '@tabler/icons-react';
import Link from 'next/link';
import { getBlogPost } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { Metadata } from 'next';

interface BlogPostProps {
    params: Promise<{ slug: string }>;
}

// 🚀 Dynamic Metadata for SEO & Social Sharing (Open Graph)
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getBlogPost(decodedSlug);

    if (!post) {
        return {
            title: 'Article Not Found | K-Farm',
        };
    }

    return {
        title: `${post.title} | K-Farm Newsroom`,
        description: post.content ? post.content.substring(0, 160).replace(/[#*`]/g, '') + '...' : 'Read more at K-Farm.',
        openGraph: {
            title: post.title,
            description: post.content ? post.content.substring(0, 160).replace(/[#*`]/g, '') : undefined,
            images: post.image ? [post.image] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.content ? post.content.substring(0, 160).replace(/[#*`]/g, '') : undefined,
            images: post.image ? [post.image] : [],
        }
    };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getBlogPost(decodedSlug);

    if (!post) {
        return notFound();
    }

    // Animation Styles
    const fadeInUpVal = "20px";
    const animDuration = "0.8s";

    // Determine Theme based on Category
    const isGlobalNews = post.category === 'Global News';
    const themeColor = isGlobalNews ? 'blue' : 'wasabi';
    const badgeLabel = isGlobalNews ? 'Global Tech & Trends' : (post.theme || post.topic || 'K-Farm Blog');

    return (
        <Container size="sm" py={60}>
            {/* Simple CSS Animation using style tag in body won't work easily here, so we use inline styles with keyframes workaround or just simple delays if possible. 
               Actually, for SSR pages, simple keyframes defined globally or module CSS is best. 
               Let's use a simple opacity transition on mount if it was client, but for server, we can just ensure clean layout.
               We will use a style block to inject keyframes.
            */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0; /* Start hidden */
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>

            {/* Navigation */}
            <Link href="/blog" style={{ textDecoration: 'none' }}>
                <Button
                    component="div"
                    variant="subtle"
                    color="gray"
                    size="sm"
                    leftSection={<IconArrowLeft size={16} />}
                    mb="xl"
                    style={{ cursor: 'pointer' }}
                >
                    Back to Articles
                </Button>
            </Link>

            {/* Header */}
            <div style={{ marginBottom: 40 }} className="animate-fade-up">
                <Group gap="xs" mb="md">
                    <Badge color={themeColor} size="lg" variant="light">{badgeLabel}</Badge>
                    <Badge color="gray" size="lg" variant="outline">{post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Draft'}</Badge>
                </Group>

                <Title order={1} size={42} style={{ lineHeight: 1.2, fontFamily: 'Greycliff CF, sans-serif' }} mb="lg">
                    {post.title}
                </Title>

                {/* Cover Image */}
                {post.image && (
                    <Paper
                        radius="md"
                        mb="xl"
                        shadow="md"
                        className="animate-fade-up delay-200"
                        style={{ overflow: 'hidden', border: '1px solid #eee' }}
                    >
                        <img
                            src={post.image}
                            alt={post.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: 450,
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </Paper>
                )}

                <Group c="dimmed" gap="lg" className="animate-fade-up delay-300">
                    <Group gap={6}>
                        <IconUser size={16} />
                        <Text size="sm">{post.author || 'K-Farm Editor'}</Text>
                    </Group>
                </Group>
            </div>

            {/* Content Body */}
            <Paper p={0} bg="transparent" className="animate-fade-up delay-300">
                <TypographyStylesProvider>
                    <div className="react-markdown-content" style={{ fontSize: '1.125rem', lineHeight: 1.75, color: '#333' }}>
                        <ReactMarkdown>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </TypographyStylesProvider>
            </Paper>

            {/* Footer / Share */}
            <Paper
                withBorder
                p="lg"
                radius="md"
                mt={80}
                bg="gray.0"
                className="animate-fade-up delay-300"
            >
                <Group justify="space-between" align="center">
                    <div>
                        <Text fw={700}>Found this interesting?</Text>
                        <Text size="sm" c="dimmed">Share it with your network.</Text>
                    </div>

                    {/* 🚀 Social Share Buttons (Free Component) */}
                    <ShareButtons title={post.title} url={`/blog/${slug}`} />
                </Group>
            </Paper>
        </Container>
    );
}
