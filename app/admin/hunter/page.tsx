'use client';

import { Container, Title, Text, TextInput, Button, Table, Badge, Card, Group, Stack, ActionIcon, Modal, List, Textarea, CopyButton, Tooltip, Tabs, Menu, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconExternalLink, IconRobot, IconFileText, IconDownload, IconCheck, IconMail, IconCopy, IconArrowLeft, IconPlus, IconEdit, IconWorld } from '@tabler/icons-react';
import pptxgen from 'pptxgenjs';
import { notifications } from '@mantine/notifications';
import { saveHunterResult, getHunterResults, updateHunterStatus, searchPartners, updateHunterInfo } from '@/lib/actions';
import { generateProposalEmail } from '@/lib/ai';

interface HunterResult {
    id: number;
    name: string;
    type: string;
    relevance: string;
    contact?: string; // Contact Person Name
    email?: string;   // Email Address
    phone?: string;
    url: string;
    status?: string;
    lastContacted?: string;
    isMock?: boolean;
}

const APP_STATUS: Record<string, string> = {
    'New': 'gray',
    'Contacted': 'blue',
    'In Discussion': 'green',
    'Partner': 'grape',
    'Dropped': 'red'
};

export default function HunterPage() {
    // Search State
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<HunterResult[]>([]);
    const [page, setPage] = useState(1);

    // CRM State
    const [activeTab, setActiveTab] = useState<string | null>('search');
    const [savedPartners, setSavedPartners] = useState<HunterResult[]>([]);

    // Modal State
    const [opened, setOpened] = useState(false);
    const [editOpened, setEditOpened] = useState(false); // Edit Modal
    const [selectedPartner, setSelectedPartner] = useState<HunterResult | null>(null);
    const [emailMode, setEmailMode] = useState(false);

    // Edit Form State
    const [editForm, setEditForm] = useState<Partial<HunterResult>>({});
    const [draftEmail, setDraftEmail] = useState({ subject: '', body: '' });

    // Initial Data Load
    useEffect(() => {
        loadSavedPartners();
    }, []);

    const loadSavedPartners = async () => {
        const data = await getHunterResults();
        setSavedPartners(data);
    };

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        setLoading(true);
        setResults([]);
        setPage(1);

        try {
            const data = await searchPartners(keyword, 1);
            setResults(data);

            if (data.length > 0 && data[0].isMock) {
                notifications.show({
                    title: 'Demo Mode Active',
                    message: 'API connection failed or key missing. Showing simulation data.',
                    color: 'orange',
                    autoClose: 5000
                });
            } else if (data.length > 0) {
                notifications.show({
                    title: 'Hunt Successful',
                    message: `Found ${data.length} potential partners.`,
                    color: 'teal'
                });
            }
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to search partners.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setLoading(true);

        try {
            const data = await searchPartners(keyword, nextPage);
            setResults(prev => [...prev, ...data]);
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to load more.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToList = async (partner: HunterResult) => {
        const result = await saveHunterResult(partner);
        if (result.success) {
            notifications.show({ title: 'Saved', message: `${partner.name} added to your pipeline.`, color: 'green' });
            loadSavedPartners();
        } else {
            notifications.show({ title: 'Notice', message: result.message, color: 'orange' });
        }
    };

    const handleEdit = (partner: HunterResult) => {
        setSelectedPartner(partner);
        setEditForm(partner);
        setEditOpened(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedPartner || !editForm) return;

        const result = await updateHunterInfo(selectedPartner.id, editForm);
        if (result.success) {
            notifications.show({ title: 'Updated', message: 'Partner information updated.', color: 'green' });
            setEditOpened(false);
            loadSavedPartners();
        } else {
            notifications.show({ title: 'Error', message: 'Failed to update info.', color: 'red' });
        }
    };

    const handleChangeStatus = async (partnerId: number, newStatus: string) => {
        const result = await updateHunterStatus(partnerId, newStatus);
        if (result.success) {
            notifications.show({ title: 'Status Updated', message: `Status changed to ${newStatus}`, color: APP_STATUS[newStatus] || 'blue' });
            loadSavedPartners();
        }
    };

    const handlePreview = (partner: HunterResult) => {
        setSelectedPartner(partner);
        setEmailMode(false);
        setDraftEmail({ subject: '', body: '' }); // Reset draft
        setOpened(true);
    };

    const handleDownloadPPT = (partner: HunterResult) => {
        let pres = new pptxgen();
        let slide1 = pres.addSlide();
        slide1.background = { color: 'F1F3F5' };
        slide1.addText('Strategic Partnership Proposal', { x: 1, y: 2, w: 8, h: 1, fontSize: 36, bold: true, color: '2B8A3E' });
        slide1.addText(`K-Farm International  x  ${partner.name}`, { x: 1, y: 3.5, w: 8, h: 1, fontSize: 24, color: '343A40' });
        const contactInfo = partner.contact || 'Partner';
        slide1.addText(`Prepared for: ${contactInfo}`, { x: 1, y: 5, w: 8, h: 0.5, fontSize: 14, color: '868E96' });
        slide1.addText('Confidential', { x: 8, y: 5, w: 1.5, h: 0.5, fontSize: 12, color: 'FF0000' });

        let slide2 = pres.addSlide();
        slide2.addText('Why We Connected', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, color: '2B8A3E', bold: true });
        slide2.addText(`Analysis of ${partner.name}`, { x: 0.5, y: 1.0, w: 9, h: 0.8, fontSize: 24, bold: true });
        slide2.addText([
            { text: `Target Relevance: ${partner.relevance}`, options: { bullet: true, breakLine: true } },
            { text: `Organization Type: ${partner.type}`, options: { bullet: true, breakLine: true } },
            { text: 'Potential Synergy: Shared R&D goals in smart agriculture.', options: { bullet: true } }
        ], { x: 0.5, y: 2.0, w: 9, h: 4, fontSize: 14, color: '343A40' });

        let slide3 = pres.addSlide();
        slide3.addText('Our Core Competency', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, color: '2B8A3E', bold: true });
        slide3.addText('K-Farm Smart Solutions', { x: 0.5, y: 1.0, w: 9, h: 0.8, fontSize: 24, bold: true });
        slide3.addText([
            { text: 'Virus-Free Seedlings (Tissue Culture)', options: { bullet: true, breakLine: true } },
            { text: 'Hyper-Cycle Aeroponic Systems (9 Months Cycle)', options: { bullet: true, breakLine: true } },
            { text: 'ESG & Energy Efficient LED Technology', options: { bullet: true } }
        ], { x: 0.5, y: 2.0, w: 9, h: 4, fontSize: 16, color: '343A40' });

        const safeName = partner.name.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        pres.writeFile({ fileName: `K-Farm_Proposal_${safeName}.pptx` });

        notifications.show({ title: 'PPT Downloaded', message: 'Attach this file when sending email!', color: 'green' });
    };

    const handleDraftEmail = async () => {
        setEmailMode(true);
        if (selectedPartner) {
            setLoading(true); // Reuse loading state for AI generation

            try {
                // Save and update status first
                await saveHunterResult(selectedPartner);
                await updateHunterStatus(selectedPartner.id, 'Contacted');
                loadSavedPartners();

                // Generate AI Proposal
                const aiResponse = await generateProposalEmail({
                    partnerName: selectedPartner.name,
                    partnerType: selectedPartner.type,
                    relevance: selectedPartner.relevance,
                    contactPerson: selectedPartner.contact
                });

                // Update the view with AI content (Need state for this, or use the getter)
                // Since getEmailContent was valid, we need to store the AI result in state
                const signature = `\n\n------------------------------\n洪泳喜 (Jerry Y. Hong)\nK-Farm International\nMobile: +82-10-4355-0633\nEmail: sbienv0633@gmail.com\nWeb: www.k-farm.or.kr`;
                setDraftEmail({ subject: aiResponse.subject, body: aiResponse.body + signature });

            } catch (error) {
                notifications.show({ title: 'AI Error', message: 'Failed to generate proposal.', color: 'red' });
            } finally {
                setLoading(false);
            }
        }
    };

    const getEmailContent = (partner: HunterResult) => {
        const subject = `[Proposal] Strategic Partnership: K-Farm x ${partner.name}`;
        const body = `Dear ${partner.contact || 'Partner'},

I hope this email finds you well.

My name is [Your Name], representing K-Farm International. We have been following the work of ${partner.name} with great interest, particularly your achievements in ${partner.relevance}.

We believe there is a strong potential for synergy between our organizations, specifically in the area of Smart Farm R&D and sustainable agriculture.

We have prepared a brief proposal outlining how we might collaborate. Please find the attached presentation for your review.

We would welcome the opportunity to discuss this further at your earliest convenience.

Best regards,

洪泳喜 (Jerry Y. Hong)
K-Farm International
Mobile: +82-10-4355-0633
Email: sbienv0633@gmail.com
Web: www.k-farm.or.kr`;
        return { subject, body };
    };

    return (
        <Container size="xl" py={40}>
            <Stack align="center" mb={40}>
                <Badge variant="filled" color="grape" size="lg">Sales Agent Beta</Badge>
                <Title order={1}>Hunter: Partner Discovery Engine</Title>
                <Text c="dimmed" ta="center" maw={600}>
                    I will scour the web to find the best potential partners for K-Farm.
                    Save them to your pipeline and manage your outreach.
                </Text>
            </Stack>

            <Tabs value={activeTab} onChange={setActiveTab} color="grape" variant="pills" radius="md">
                <Tabs.List mb="md" justify="center">
                    <Tabs.Tab value="search" leftSection={<IconSearch size={16} />}>Search Discovery</Tabs.Tab>
                    <Tabs.Tab value="pipeline" leftSection={<IconCheck size={16} />}>
                        My Pipeline
                        {savedPartners.length > 0 && <Badge size="xs" circle ml={5} color="gray">{savedPartners.length}</Badge>}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="search">
                    <Card shadow="sm" radius="md" p="xl" withBorder mb={40}>
                        <Group align="flex-end">
                            <TextInput
                                label="Target Keyword"
                                placeholder="Search partners..."
                                style={{ flex: 1 }}
                                value={keyword}
                                onChange={(event) => setKeyword(event.currentTarget.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                size="md"
                                leftSection={<IconSearch size={16} />}
                            />
                            <Button size="md" color="grape" onClick={handleSearch} loading={loading} leftSection={<IconRobot size={20} />}>
                                Start Hunt
                            </Button>
                        </Group>
                    </Card>

                    {results.length > 0 && (
                        <Stack>
                            <Group justify="space-between" mb={-10}>
                                <Text size="sm" c="dimmed">Found {results.length} results</Text>
                                {results[0].isMock && <Badge color="orange" variant="light">Demo Mode</Badge>}
                            </Group>
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Organization</Table.Th>
                                        <Table.Th>Type</Table.Th>
                                        <Table.Th>Relevance Analysis</Table.Th>
                                        <Table.Th>Contact</Table.Th>
                                        <Table.Th>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {results.map((element) => (
                                        <Table.Tr key={element.id} style={{ fontSize: '0.9rem' }}>
                                            <Table.Td fw={500}>
                                                <Group gap={8}>
                                                    <a href={element.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {element.name}
                                                    </a>
                                                    {element.url && (
                                                        <ActionIcon size="xs" variant="subtle" color="gray" component="a" href={element.url} target="_blank">
                                                            <IconExternalLink size={12} />
                                                        </ActionIcon>
                                                    )}
                                                </Group>
                                            </Table.Td>
                                            <Table.Td><Badge variant="light" color="blue">{element.type}</Badge></Table.Td>
                                            <Table.Td style={{ maxWidth: 300 }}>
                                                <Text size="xs" lineClamp={2}>{element.relevance}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="xs" fw={500}>{element.contact}</Text>
                                                <Text size="xs" c="dimmed">{element.phone}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap={4}>
                                                    <Tooltip label="Save">
                                                        <ActionIcon variant="light" color="blue" size="sm" onClick={() => handleSaveToList(element)}>
                                                            <IconPlus size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Button variant="light" size="compact-xs" color="wasabi" onClick={() => handlePreview(element)}>
                                                        Proposal
                                                    </Button>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                            <Button variant="default" onClick={handleLoadMore} loading={loading} fullWidth size="xs">Load More Results</Button>
                        </Stack>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="pipeline">
                    <Stack>
                        <Group justify="space-between">
                            <Title order={3}>My Pipeline</Title>
                            <Button variant="outline" color="gray" size="xs" onClick={loadSavedPartners}>Refresh</Button>
                        </Group>

                        {savedPartners.length === 0 ? (
                            <Text c="dimmed" fs="italic" ta="center" py="xl">No partners saved yet.</Text>
                        ) : (
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Organization</Table.Th>
                                        <Table.Th>Contact</Table.Th> {/* Header Updated */}
                                        <Table.Th>Last Contact</Table.Th>
                                        <Table.Th>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {savedPartners.map((element) => (
                                        <Table.Tr key={element.id} style={{ fontSize: '0.85rem' }}>
                                            <Table.Td>
                                                <Menu shadow="md" width={150}>
                                                    <Menu.Target>
                                                        <Badge
                                                            size="sm"
                                                            color={APP_STATUS[element.status || 'New']}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {element.status || 'New'}
                                                        </Badge>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        {Object.keys(APP_STATUS).map((status) => (
                                                            <Menu.Item
                                                                key={status}
                                                                color={APP_STATUS[status]}
                                                                onClick={() => handleChangeStatus(element.id, status)}
                                                            >
                                                                {status}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                            <Table.Td fw={500}>
                                                <Group gap={8}>
                                                    <a href={element.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        {element.name}
                                                    </a>
                                                    {element.url && (
                                                        <ActionIcon size="xs" variant="subtle" color="gray" component="a" href={element.url} target="_blank">
                                                            <IconExternalLink size={12} />
                                                        </ActionIcon>
                                                    )}
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Stack gap={0}>
                                                    {element.email && <Text size="xs" fw={700} c="blue">{element.email}</Text>}
                                                    <Text size="xs">{element.contact || '-'}</Text>
                                                    {element.phone && element.phone !== '-' && (
                                                        <Text size="xs" c="dimmed">{element.phone}</Text>
                                                    )}
                                                </Stack>
                                            </Table.Td>
                                            <Table.Td>{element.lastContacted ? new Date(element.lastContacted).toLocaleDateString() : '-'}</Table.Td>
                                            <Table.Td>
                                                <Group gap={4}>
                                                    <Tooltip label="Edit Info">
                                                        <ActionIcon variant="outline" color="blue" size="sm" onClick={() => handleEdit(element)}>
                                                            <IconEdit size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Button variant="light" size="compact-xs" color="wasabi" onClick={() => handlePreview(element as any)}>
                                                        Proposal
                                                    </Button>
                                                    <Tooltip label="Visit Website">
                                                        <ActionIcon component="a" href={element.url} target="_blank" variant="default" size="sm">
                                                            <IconWorld size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}
                    </Stack>
                </Tabs.Panel>
            </Tabs>

            {/* ... (Modals remain same) ... */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={emailMode ? "Draft Email" : "Proposal Preview"}
                size="xl"
                centered
            >
                {/* ... existing modal content ... */}
                {selectedPartner && !emailMode && (
                    <Stack>
                        <Card withBorder shadow="sm" bg="gray.1" padding="xl">
                            <Text size="xl" fw={700} c="green.9" ta="center" mt="md">Strategic Partnership Proposal</Text>
                            <Text size="lg" ta="center" mt="sm">K-Farm International x {selectedPartner.name}</Text>
                            <Text size="sm" c="dimmed" ta="center" mt="xl">Prepared for: {selectedPartner.contact}</Text>
                            <Badge color="red" variant="outline" mx="auto" mt="md">CONFIDENTIAL</Badge>
                        </Card>
                        <Group grow mt="md">
                            <Button leftSection={<IconDownload size={16} />} color="grape" variant="outline" onClick={() => handleDownloadPPT(selectedPartner)}>
                                1. Download PPTX
                            </Button>
                            <Button leftSection={<IconMail size={16} />} color="grape" onClick={handleDraftEmail} loading={loading}>
                                2. Generate AI Proposal & Draft
                            </Button>
                        </Group>
                    </Stack>
                )}

                {selectedPartner && emailMode && (
                    <Stack>
                        <Button variant="subtle" color="gray" size="xs" leftSection={<IconArrowLeft size={12} />} onClick={() => setEmailMode(false)}>
                            Back to Proposal
                        </Button>
                        <TextInput label="Subject" value={draftEmail.subject || getEmailContent(selectedPartner).subject} onChange={(e) => setDraftEmail({ ...draftEmail, subject: e.currentTarget.value })} rightSection={<CopyButton value={draftEmail.subject || getEmailContent(selectedPartner).subject}>
                            {({ copied, copy }) => (<ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}><IconCopy size={16} /></ActionIcon>)}
                        </CopyButton>} />
                        <Textarea label="Body" value={draftEmail.body || getEmailContent(selectedPartner).body} onChange={(e) => setDraftEmail({ ...draftEmail, body: e.currentTarget.value })} autosize minRows={10} rightSection={<CopyButton value={draftEmail.body || getEmailContent(selectedPartner).body}>
                            {({ copied, copy }) => (
                                <Stack>
                                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}><IconCopy size={16} /></ActionIcon>
                                    {loading && <Loader size="xs" color="pink" />}
                                </Stack>
                            )}
                        </CopyButton>} />
                    </Stack>
                )}
            </Modal>

            <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Partner Info" centered>
                <Stack>
                    <TextInput label="Organization Name" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <TextInput label="Type" value={editForm.type || ''} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} />
                    <TextInput label="Contact Person" placeholder="Name of person" value={editForm.contact || ''} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} />
                    <TextInput label="Email Address" placeholder="email@address.com" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                    <TextInput label="Phone Number" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                    <Textarea label="Notes / Relevance" autosize minRows={3} value={editForm.relevance || ''} onChange={(e) => setEditForm({ ...editForm, relevance: e.target.value })} />
                    <Button color="blue" onClick={handleSaveEdit}>Save Changes</Button>
                </Stack>
            </Modal>
        </Container>
    );
}
