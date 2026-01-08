// src/app/수직농장/page.tsx
import { Container, Title, Text, Divider, List, Anchor } from '@mantine/core';
import Head from 'next/head';
import path from 'path';
import fs from 'fs/promises';

/**
 * Server component – reads the PDF files from the public/수직농장 folder at request time.
 * This ensures that any PDF added to the folder appears instantly without a rebuild.
 */
export const generateMetadata = async () => {
    return {
        title: '수직농장 기술자료 | K‑WASABI',
        description: '수직농장 설계·운영·영양액 관리 등 기술자료 PDF 다운로드.',
        robots: 'index,follow',
        openGraph: {
            title: '수직농장 기술자료',
            description: '수직농장 설계·운영·영양액 관리 등 기술자료 PDF 다운로드.',
            url: '/수직농장',
        },
    };
};

// Helper to turn a file name into a readable title
const fileNameToTitle = (fileName: string) => {
    const base = fileName.replace(/\.pdf$/i, '');
    return base
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

// The page component – async because we use await inside
export default async function TechDocsPage() {
    const folderPath = path.join(process.cwd(), 'public', '수직농장');
    let pdfFiles: string[] = [];
    try {
        const entries = await fs.readdir(folderPath);
        pdfFiles = entries.filter((name) => name.toLowerCase().endsWith('.pdf'));
    } catch (e) {
        console.warn('수직농장 폴더를 찾을 수 없습니다.', e);
    }

    const docs = pdfFiles.map((file) => ({
        title: fileNameToTitle(file),
        fileName: file,
    }));

    return (
        <>
            <Head>
                <title>수직농장 기술자료 | K‑WASABI</title>
                <meta
                    name="description"
                    content="수직농장 설계·운영·영양액 관리 등 기술자료 PDF 다운로드."
                />
                <link rel="canonical" href="/수직농장" />
            </Head>

            <Container size="md" py="xl">
                <Title order={1} ta="center" mb="lg">
                    수직농장 기술자료
                </Title>
                <Text ta="center" c="dimmed" mb="xl">
                    아래 PDF 파일을 클릭하면 새 창에서 열리며, 필요 시 바로 다운로드할 수 있습니다.
                </Text>
                <Divider my="lg" />
                {docs.length === 0 ? (
                    <Text ta="center">📦 현재 등록된 자료가 없습니다.</Text>
                ) : (
                    <List spacing="sm" size="lg" center>
                        {docs.map((doc) => (
                            <List.Item key={doc.fileName}>
                                <strong>{doc.title}</strong>{' '}
                                <Anchor
                                    href={`/수직농장/${doc.fileName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    다운로드
                                </Anchor>
                            </List.Item>
                        ))}
                    </List>
                )}
            </Container>
        </>
    );
}
