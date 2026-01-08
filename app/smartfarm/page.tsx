'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Container,
    Title,
    Text,
    List,
    ListItem,
    Anchor,
    ThemeIcon,
    Card,
    Grid,
    Group,
    Stack,
    Divider,
    Box,
    Badge,
} from '@mantine/core';
import Head from 'next/head';
import { IconArrowRight, IconFileText, IconApi, IconCpu, IconTrack } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

// Hard-coded PDF list
const pdfFiles = [
    { file: '1장_01_수직농장의 개념.pdf', titleEn: 'Concept of Vertical Farming', titleKo: '수직농장의 개념' },
    { file: '1장_02_수직농장의 필요성.pdf', titleEn: 'Necessity of Vertical Farming', titleKo: '수직농장의 필요성' },
    { file: '1장_03_수직농장의 구성.pdf', titleEn: 'Components of Vertical Farming', titleKo: '수직농장의 구성' },
    { file: '1장_04_수직농장의 발전 과정.pdf', titleEn: 'Evolution of Vertical Farming', titleKo: '수직농장의 발전 과정' },
    { file: '1장_05_국내외 수직농장 현황.pdf', titleEn: 'Global Vertical Farm Status', titleKo: '국내외 수직농장 현황' },
    { file: '2장_수직농장의 주요 기술 문서_ 04_에너지관리 기술.pdf', titleEn: 'Energy Management Technology', titleKo: '에너지관리 기술' },
    { file: '2장_수직농장의 주요 기술 문서_ 05_자동화.pdf', titleEn: 'Automation Systems', titleKo: '자동화 시스템' },
    { file: '2장_수직농장의 주요 기술 문서_01광제어기술.pdf', titleEn: 'Light Control Technology', titleKo: '광제어 기술' },
    { file: '2장_수직농장의 주요 기술 문서_02_환경제어 기술.pdf', titleEn: 'Environmental Control', titleKo: '환경제어 기술' },
    { file: '2정_수직농장의 주요 기술 문서_ 03_수경재배 기술.pdf', titleEn: 'Hydroponics Technology', titleKo: '수경재배 기술' },
    { file: '3장_수직농장 국내외 사례.pdf', titleEn: 'Global Case Studies', titleKo: '수직농장 국내외 사례' },
    { file: '4장_수직농장의 전망.pdf', titleEn: 'Future Outlook', titleKo: '수직농장의 전망' },
];

export default function SmartFarmLanding() {
    const { t, language } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <Head>
                <title>{t('sf_hub_title')} | K-WASABI</title>
            </Head>

            <Container size="lg" py="xl">
                <Stack gap="xl">
                    <Box ta="center">
                        <Title order={1} size={42} fw={900}>
                            <Text component="span" variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 45 }} inherit>
                                {t('sf_hub_title')}
                            </Text>
                        </Title>
                        <Text size="xl" c="dimmed" mt="md" maw={800} mx="auto">
                            {t('sf_hub_desc')}
                        </Text>
                    </Box>

                    <Divider my="xl" label={t('sf_hub_divider')} labelPosition="center" />

                    <Grid gutter="xl">
                        {/* Vertical Farm Technical Documents Section */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                <Group mb="md">
                                    <ThemeIcon color="teal" size="xl" radius="md">
                                        <IconFileText size={24} />
                                    </ThemeIcon>
                                    <Title order={2} size="h3">{t('sf_docs_title')}</Title>
                                </Group>
                                <Text size="sm" c="dimmed" mb="md">
                                    {t('sf_docs_desc')}
                                </Text>
                                <Divider mb="md" />
                                <List spacing="xs" size="sm" icon={<IconFileText size={14} color="teal" />}>
                                    {pdfFiles.slice(0, 8).map((item) => {
                                        const isDoc101 = item.file === '1장_01_수직농장의 개념.pdf';
                                        const isDoc204 = item.file === '2장_수직농장의 주요 기술 문서_ 04_에너지관리 기술.pdf';
                                        const docId = isDoc101 ? '1-01' : isDoc204 ? '2-04' : null;
                                        const displayTitle = language === 'ko' ? item.titleKo : item.titleEn;

                                        return (
                                            <ListItem key={item.file}>
                                                <Group gap="xs" wrap="nowrap">
                                                    <Anchor
                                                        component={(docId ? Link : 'a') as any}
                                                        {...(docId ? { href: `/smartfarm/docs/${docId}` } : { href: `/smartfarm/docs/${item.file}`, target: "_blank", rel: "noopener" })}
                                                        fw={docId ? 700 : 400}
                                                        c={docId ? 'teal' : 'dimmed'}
                                                    >
                                                        {displayTitle}
                                                    </Anchor>
                                                    {docId && <Badge size="xs" variant="outline" color="teal">Digital EN/KO</Badge>}
                                                </Group>
                                            </ListItem>
                                        );
                                    })}
                                    {pdfFiles.length > 8 && (
                                        <ListItem style={{ listStyleType: 'none', marginTop: 10 }}>
                                            <Text size="xs" fw={700} c="teal">
                                                {t('pdf_plus')} {pdfFiles.length - 8} {t('sf_docs_more')}
                                            </Text>
                                        </ListItem>
                                    )}
                                </List>
                            </Card>
                        </Grid.Col>

                        {/* Other Technical Sections */}
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Stack gap="md" h="100%">
                                {/* RDA API */}
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Link href="/smartfarm/rda-api" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Group>
                                            <ThemeIcon color="blue" size="xl" radius="md">
                                                <IconApi size={24} />
                                            </ThemeIcon>
                                            <Box style={{ flex: 1 }}>
                                                <Text fw={700} size="lg">{t('sf_rda_title')}</Text>
                                                <Text size="xs" c="dimmed">{t('sf_rda_desc')}</Text>
                                            </Box>
                                            <IconArrowRight size={18} color="gray" />
                                        </Group>
                                    </Link>
                                </Card>

                                {/* Hardware */}
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Link href="/smartfarm/hardware" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Group>
                                            <ThemeIcon color="lime" size="xl" radius="md">
                                                <IconCpu size={24} />
                                            </ThemeIcon>
                                            <Box style={{ flex: 1 }}>
                                                <Text fw={700} size="lg">{t('sf_hw_title')}</Text>
                                                <Text size="xs" c="dimmed">{t('sf_hw_desc')}</Text>
                                            </Box>
                                            <IconArrowRight size={18} color="gray" />
                                        </Group>
                                    </Link>
                                </Card>

                                {/* Roadmap */}
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    <Link href="/smartfarm/roadmap" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Group>
                                            <ThemeIcon color="orange" size="xl" radius="md">
                                                <IconTrack size={24} />
                                            </ThemeIcon>
                                            <Box style={{ flex: 1 }}>
                                                <Text fw={700} size="lg">{t('sf_rd_title')}</Text>
                                                <Text size="xs" c="dimmed">{t('sf_rd_desc')}</Text>
                                            </Box>
                                            <IconArrowRight size={18} color="gray" />
                                        </Group>
                                    </Link>
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}
