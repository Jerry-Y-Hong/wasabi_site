'use client';

import { useParams } from 'next/navigation';
import {
    Container,
    Title,
    Text,
    Paper,
    Stack,
    Button,
    Group,
    Divider,
    Breadcrumbs,
    Anchor,
    Box,
    TypographyStylesProvider,
    Table,
    Badge
} from '@mantine/core';
import { IconChevronLeft, IconFileDownload, IconShare } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';

export default function TechDocPage() {
    const params = useParams();
    const id = params.id as string; // e.g., '1-01' or '2-04'
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Document Content Routing Logic
    const contentMap: Record<string, any> = {
        '1-01': {
            title: t('doc_1_01_title'),
            intro: t('doc_1_01_intro'),
            pdf: '1장_01_수직농장의 개념.pdf',
            body: (
                <Stack gap="xl">
                    <section>
                        <Title order={2} size="h3" mb="md" c="teal">{t('doc_1_01_section1_title')}</Title>
                        <Text style={{ lineHeight: 1.8 }}>{t('doc_1_01_section1_content')}</Text>
                    </section>
                    <section>
                        <Title order={2} size="h3" mb="md" c="teal">{t('doc_1_01_section2_title')}</Title>
                        <Text style={{ lineHeight: 1.8 }}>{t('doc_1_01_section2_content')}</Text>
                    </section>
                </Stack>
            )
        },
        '2-04': {
            title: t('doc_2_04_title'),
            intro: t('doc_2_04_intro'),
            pdf: '2장_수직농장의 주요 기술 문서_ 04_에너지관리 기술.pdf',
            body: (
                <Stack gap="xl">
                    <section>
                        <Title order={2} size="h3" mb="md" c="teal">{t('doc_2_04_table_title')}</Title>
                        <Paper withBorder radius="md" p={0} style={{ overflow: 'hidden' }}>
                            <Table striped highlightOnHover withColumnBorders verticalSpacing="md">
                                <Table.Thead bg="teal.0">
                                    <Table.Tr>
                                        <Table.Th>{t('doc_2_04_col_item')}</Table.Th>
                                        <Table.Th>{t('doc_2_04_col_spec')}</Table.Th>
                                        <Table.Th>{t('doc_2_04_col_remark')}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td fw={700}>{t('doc_2_04_row1_item')}</Table.Td>
                                        <Table.Td>{t('doc_2_04_row1_spec')}</Table.Td>
                                        <Table.Td><Text size="sm" c="dimmed">{t('doc_2_04_row1_remark')}</Text></Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td fw={700}>{t('doc_2_04_row2_item')}</Table.Td>
                                        <Table.Td>{t('doc_2_04_row2_spec')}</Table.Td>
                                        <Table.Td><Text size="sm" c="dimmed">{t('doc_2_04_row2_remark')}</Text></Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td fw={700}>{t('doc_2_04_row3_item')}</Table.Td>
                                        <Table.Td>{t('doc_2_04_row3_spec')}</Table.Td>
                                        <Table.Td><Text size="sm" c="dimmed">{t('doc_2_04_row3_remark')}</Text></Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </section>
                    <Box bg="blue.0" p="md" style={{ borderLeft: '4px solid var(--mantine-color-blue-6)' }}>
                        <Text size="sm">
                            {t('doc_2_04_remark')}
                        </Text>
                    </Box>
                </Stack>
            )
        }
    };

    const docData = contentMap[id];

    if (!docData) {
        return (
            <Container size="md" py={60} ta="center">
                <Title>Document Not Found</Title>
                <Button component={Link} href="/smartfarm" mt="xl">Go Back</Button>
            </Container>
        );
    }

    return (
        <Container size="md" py={40}>
            <Stack gap="lg">
                <Breadcrumbs>
                    <Anchor component={Link} href="/smartfarm" size="sm">Smart Farm</Anchor>
                    <Text size="sm" c="dimmed">Technical Docs</Text>
                    <Text size="sm" c="dimmed">{id}</Text>
                </Breadcrumbs>

                <Box>
                    <Title order={1} size={36} fw={900}>{docData.title}</Title>
                    <Text size="lg" c="dimmed" mt="sm">
                        {docData.intro}
                    </Text>
                </Box>

                <Group>
                    <Button
                        variant="light"
                        color="teal"
                        leftSection={<IconFileDownload size={16} />}
                        component="a"
                        href={`/smartfarm/docs/${docData.pdf}`}
                        target="_blank"
                    >
                        {t('doc_original_download')}
                    </Button>
                    <Button variant="subtle" color="gray" leftSection={<IconShare size={16} />}>
                        {t('doc_share')}
                    </Button>
                </Group>

                <Divider />

                <Paper shadow="xs" p="xl" radius="md" withBorder>
                    <TypographyStylesProvider>
                        {docData.body}
                    </TypographyStylesProvider>
                </Paper>

                <Group justify="space-between" mt="xl">
                    <Button
                        variant="subtle"
                        leftSection={<IconChevronLeft size={16} />}
                        component={Link}
                        href="/smartfarm"
                    >
                        {t('doc_back_list')}
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
}
