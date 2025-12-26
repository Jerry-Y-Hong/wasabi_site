'use client';

import { Container, Title, Text, TextInput, Button, Table, Badge, Card, Group, Stack, Loader, ActionIcon, Modal, List, ThemeIcon } from '@mantine/core';
import { useState } from 'react';
import { IconSearch, IconExternalLink, IconRobot, IconFileText, IconDownload, IconCheck } from '@tabler/icons-react';
import pptxgen from 'pptxgenjs';

interface HunterResult {
    id: number;
    name: string;
    type: string;
    relevance: string;
    contact?: string;
    phone?: string;
    url: string;
}

export default function HunterPage() {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<HunterResult[]>([]);

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setLoading(true);

        // Simulation of AI Search Process
        // In a real scenario, this would call a server action connected to a search API
        setTimeout(() => {
            const mockResults = [
                { id: 1, name: 'Kangwon National University - College of Agriculture', type: 'University', relevance: 'High (Smart Farm Research)', contact: 'Prof. Kim Cheol-soo', phone: '033-250-1234', url: 'https://cals.kangwon.ac.kr' },
                { id: 2, name: 'Rural Development Administration (RDA)', type: 'Government', relevance: 'High (Funding & Policy)', contact: 'Dr. Lee Young-hee', phone: '063-238-1000', url: 'https://www.rda.go.kr' },
                { id: 3, name: 'Green Bio Venture Campus', type: 'Incubator', relevance: 'Medium (Startup Support)', contact: 'Manager Park', phone: '033-333-5678', url: '#Link' },
                { id: 4, name: 'Smart Farm Korea', type: 'Association', relevance: 'High (Industry Network)', contact: 'Secretariat', phone: '1522-2911', url: 'https://www.smartfarmkorea.net' },
                { id: 5, name: 'Seoul National University - Dept. of Plant Science', type: 'University', relevance: 'Medium (Bio-Tech)', contact: 'Admin Office', phone: '02-880-5114', url: 'https://cals.snu.ac.kr' },
            ];
            setResults(mockResults);
            setLoading(false);
        }, 1500);
    };

    const handleGeneratePPT = (partner: HunterResult) => {
        // 1. Create a new Presentation
        let pres = new pptxgen();

        // 2. Add Cover Slide
        let slide1 = pres.addSlide();
        slide1.background = { color: 'F1F3F5' };
        slide1.addText('Strategic Partnership Proposal', { x: 1, y: 2, w: '80%', fontSize: 36, bold: true, color: '2B8A3E' });
        slide1.addText(`K-Farm International  x  ${partner.name}`, { x: 1, y: 3.5, w: '80%', fontSize: 24, color: '343A40' });
        slide1.addText(`Prepared for: ${partner.contact}`, { x: 1, y: 5, fontSize: 14, color: '868E96' });
        slide1.addText('Confidential', { x: 8, y: 5, fontSize: 12, color: 'Red' });

        // 3. Add Context/Analysis Slide
        let slide2 = pres.addSlide();
        slide2.addText('Why We Connected', { x: 0.5, y: 0.5, fontSize: 18, color: '2B8A3E', bold: true });
        slide2.addText(`Analysis of ${partner.name}`, { x: 0.5, y: 1.0, fontSize: 24, bold: true });
        slide2.addText([
            { text: `Target Relevance: ${partner.relevance}`, options: { bullet: true, breakLine: true } },
            { text: `Organization Type: ${partner.type}`, options: { bullet: true, breakLine: true } },
            { text: 'Potential Synergy: Shared R&D goals in smart agriculture.', options: { bullet: true } }
        ], { x: 0.5, y: 2.0, w: '40%', fontSize: 14 });

        // 4. Add Our Solution Slide
        let slide3 = pres.addSlide();
        slide3.addText('Our Core Competency', { x: 0.5, y: 0.5, fontSize: 18, color: '2B8A3E', bold: true });
        slide3.addText('K-Farm Smart Solutions', { x: 0.5, y: 1.0, fontSize: 24, bold: true });
        slide3.addText([
            { text: 'Virus-Free Seedlings (Tissue Culture)', options: { bullet: true, breakLine: true } },
            { text: 'Hyper-Cycle Aeroponic Systems (9 Months Cycle)', options: { bullet: true, breakLine: true } },
            { text: 'ESG & Energy Efficient LED Technology', options: { bullet: true } }
        ], { x: 0.5, y: 2.0, fontSize: 16 });

        // 5. Save the Presentation
        pres.writeFile({ fileName: `K-Farm_Proposal_${partner.name}.pptx` });
    };

    return (
        <Container size="xl" py={80}>
            <Stack align="center" mb={60}>
                <Badge variant="filled" color="grape" size="lg">Sales Agent Beta</Badge>
                <Title order={1}>Hunter: Partner Discovery Engine</Title>
                <Text c="dimmed" ta="center" maw={600}>
                    I will scour the web to find the best potential partners for K-Farm.
                    Just enter a keyword, and I'll do the digging.
                </Text>
            </Stack>

            <Card shadow="sm" radius="md" p="xl" withBorder mb={60}>
                <Group align="flex-end">
                    <TextInput
                        label="Target Keyword"
                        placeholder="e.g., Smart Farm Research Centers in Korea"
                        description="Be specific for better results."
                        style={{ flex: 1 }}
                        value={keyword}
                        onChange={(event) => setKeyword(event.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        size="md"
                        leftSection={<IconSearch size={16} />}
                    />
                    <Button
                        size="md"
                        color="grape"
                        onClick={handleSearch}
                        loading={loading}
                        leftSection={<IconRobot size={20} />}
                    >
                        Start Hunt
                    </Button>
                </Group>
            </Card>

            {results.length > 0 && (
                <Stack>
                    <Title order={3}>Discovery Results ({results.length})</Title>
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Organization Name</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Relevance Analysis</Table.Th>
                                <Table.Th>Contact Person</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {results.map((element) => (
                                <Table.Tr key={element.id}>
                                    <Table.Td fw={500}>{element.name}</Table.Td>
                                    <Table.Td><Badge variant="light" color="blue">{element.type}</Badge></Table.Td>
                                    <Table.Td>{element.relevance}</Table.Td>
                                    <Table.Td>{element.contact}</Table.Td>
                                    <Table.Td>{element.phone}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Button component="a" href={element.url} target="_blank" variant="subtle" size="xs" color="gray">
                                                <IconExternalLink size={14} />
                                            </Button>
                                            <Button
                                                variant="light"
                                                size="xs"
                                                color="wasabi"
                                                leftSection={<IconFileText size={14} />}
                                                onClick={() => handleGeneratePPT(element)}
                                            >
                                                Proposal
                                            </Button>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" color="gray">Export List</Button>
                    </Group>
                </Stack>
            )}
        </Container>
    );
}
