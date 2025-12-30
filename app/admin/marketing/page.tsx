'use client';

import { Container, Title, Text, Stack, Group, Button, TextInput, Textarea, SimpleGrid, Card, Tabs, CopyButton, ActionIcon, Badge, Loader } from '@mantine/core';
import { IconBrandInstagram, IconBrandTwitter, IconArticle, IconArrowLeft, IconRobot, IconCopy, IconCheck, IconShare } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from '@/lib/i18n';

// MOCK AI GENERATOR (나중에 실제 AI로 교체)
const mockGenerateContent = async (topic: string, platform: 'blog' | 'instagram' | 'twitter') => {
    await new Promise(r => setTimeout(r, 1500)); // 1.5초 딜레이

    if (platform === 'twitter') {
        return `🚀 ${topic} - 혁신의 시작!\n\n와사비 스마트팜 기술로 농업의 미래를 바꿉니다. 더 많은 소식은 링크에서 확인하세요.\n\n#KFARM #Wasabi #AgTech #SmartFarm #${topic.replace(/\s/g, '')}`;
    }
    if (platform === 'instagram') {
        return `🌿 ${topic}\n\n자연과 기술이 만나는 곳, K-FARM입니다.\n\n우리는 오늘도 가장 신선하고 완벽한 와사비를 위해 연구합니다. 🔬✨\n\n📌 Check our bio for more info!\n\n#KFARM #SmartFarm #Wasabi #Premium #EcoFriendly #Innovation #Daily #FarmLife #${topic.replace(/\s/g, '')}`;
    }
    return `# ${topic}\n\n안녕하세요, K-FARM입니다.\n\n오늘은 **${topic}**에 대해 이야기해 보려 합니다.\n\n## 1. 혁신의 배경\n최근 스마트팜 기술은 비약적으로 발전하고 있습니다. 우리는 에어로포닉스 기술을 통해...\n\n## 2. 우리의 솔루션\nK-FARM의 독자적인 재배 방식은...\n\n더 자세한 내용은 홈페이지에서 확인해 주세요.\n\n감사합니다.`;
};

export default function MarketingPage() {
    const { t } = useTranslation();
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState<string | null>('instagram');

    const [results, setResults] = useState({
        blog: '',
        instagram: '',
        twitter: ''
    });

    const handleGenerate = async () => {
        if (!topic) return notifications.show({ title: 'Topic Required', message: 'Please enter a topic first.', color: 'red' });

        setLoading(true);
        try {
            // 실제로는 병렬로 AI 호출
            const blog = await mockGenerateContent(topic, 'blog');
            const instagram = await mockGenerateContent(topic, 'instagram');
            const twitter = await mockGenerateContent(topic, 'twitter');

            setResults({ blog, instagram, twitter });
            notifications.show({ title: 'Content Generated', message: 'Ready to share on all platforms!', color: 'green' });
        } catch (e) {
            notifications.show({ title: 'Error', message: 'Generation failed.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xl" py={40}>
            {/* Header */}
            <Group justify="space-between" mb={40}>
                <Stack gap={0}>
                    <Group>
                        <Button component={Link} href="/admin" variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />}>
                            {t('marketing_back')}
                        </Button>
                    </Group>
                    <Title order={1}>{t('marketing_title')}</Title>
                    <Text c="dimmed">{t('marketing_desc')}</Text>
                </Stack>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {/* Left: Input */}
                <Stack>
                    <Card withBorder radius="md" p="xl" shadow="sm">
                        <Stack>
                            <Title order={3}>🎯 {t('marketing_topic')}</Title>
                            <Text size="sm" c="dimmed">{t('marketing_topic_desc')}</Text>

                            <TextInput
                                label={t('marketing_topic_label')}
                                placeholder={t('marketing_topic_ph')}
                                size="md"
                                value={topic}
                                onChange={(e) => setTopic(e.currentTarget.value)}
                            />

                            <Textarea
                                label={t('marketing_key_label')}
                                placeholder={t('marketing_key_ph')}
                                minRows={4}
                            />

                            <Button
                                size="lg"
                                color="grape"
                                mt="md"
                                onClick={handleGenerate}
                                loading={loading}
                                leftSection={<IconRobot size={20} />}
                            >
                                {t('marketing_btn_gen')}
                            </Button>
                        </Stack>
                    </Card>

                    {/* Preview of Platforms */}
                    <Group grow>
                        <Card withBorder p="md" radius="md">
                            <Stack align="center" gap="xs">
                                <IconBrandInstagram size={32} color="#E1306C" />
                                <Text size="sm" fw={700}>{t('marketing_tab_insta')}</Text>
                                <Badge color={results.instagram ? 'green' : 'gray'}>{results.instagram ? t('marketing_ready') : t('marketing_waiting')}</Badge>
                            </Stack>
                        </Card>
                        <Card withBorder p="md" radius="md">
                            <Stack align="center" gap="xs">
                                <IconBrandTwitter size={32} color="#1DA1F2" />
                                <Text size="sm" fw={700}>{t('marketing_tab_twitter')}</Text>
                                <Badge color={results.twitter ? 'green' : 'gray'}>{results.twitter ? t('marketing_ready') : t('marketing_waiting')}</Badge>
                            </Stack>
                        </Card>
                        <Card withBorder p="md" radius="md">
                            <Stack align="center" gap="xs">
                                <IconArticle size={32} color="#228BE6" />
                                <Text size="sm" fw={700}>{t('marketing_tab_blog')}</Text>
                                <Badge color={results.blog ? 'green' : 'gray'}>{results.blog ? t('marketing_ready') : t('marketing_waiting')}</Badge>
                            </Stack>
                        </Card>
                    </Group>
                </Stack>

                {/* Right: Output */}
                <Card withBorder radius="md" p="xl" bg="gray.0">
                    <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
                        <Tabs.List mb="md" grow>
                            <Tabs.Tab value="instagram" leftSection={<IconBrandInstagram size={16} />}>{t('marketing_tab_insta')}</Tabs.Tab>
                            <Tabs.Tab value="twitter" leftSection={<IconBrandTwitter size={16} />}>{t('marketing_tab_twitter')}</Tabs.Tab>
                            <Tabs.Tab value="blog" leftSection={<IconArticle size={16} />}>{t('marketing_tab_blog')}</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="instagram">
                            <ContentPreview
                                content={results.instagram}
                                placeholder={t('marketing_ph_insta')}
                                loading={loading}
                                t={t}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="twitter">
                            <ContentPreview
                                content={results.twitter}
                                placeholder={t('marketing_ph_twitter')}
                                loading={loading}
                                t={t}
                            />
                        </Tabs.Panel>
                        <Tabs.Panel value="blog">
                            <ContentPreview
                                content={results.blog}
                                placeholder={t('marketing_ph_blog')}
                                loading={loading}
                                isLong
                                t={t}
                            />
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </SimpleGrid>
        </Container>
    );
}

function ContentPreview({ content, placeholder, loading, isLong, t }: any) {
    return (
        <Stack>
            <Card withBorder shadow="inner" bg="white" radius="md" style={{ minHeight: isLong ? 400 : 200, position: 'relative' }}>
                {loading && (
                    <Center style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10 }}>
                        <Loader type="dots" />
                    </Center>
                )}
                {content ? (
                    <Text style={{ whiteSpace: 'pre-wrap' }}>{content}</Text>
                ) : (
                    <Center h="100%">
                        <Text c="dimmed" fs="italic">{placeholder}</Text>
                    </Center>
                )}
            </Card>
            <Group justify="flex-end">
                <CopyButton value={content || ''}>
                    {({ copied, copy }) => (
                        <Button color={copied ? 'teal' : 'blue'} onClick={copy} leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />} disabled={!content}>
                            {copied ? t('marketing_copied') : t('marketing_copy')}
                        </Button>
                    )}
                </CopyButton>
                <Button variant="light" color="grape" disabled={!content} leftSection={<IconShare size={16} />}>
                    {t('marketing_autopost')}
                </Button>
            </Group>
        </Stack>
    );
}

// Helper to center loader
import { Center } from '@mantine/core';
