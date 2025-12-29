'use client';

import { Container, Title, Text, TextInput, Button, Table, Badge, Card, Group, Stack, ActionIcon, Modal, Select, Textarea, CopyButton, Tooltip, Tabs, Menu, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconExternalLink, IconRobot, IconFileText, IconDownload, IconCheck, IconMail, IconCopy, IconArrowLeft, IconPlus, IconEdit, IconWorld, IconTrash, IconX, IconScan } from '@tabler/icons-react';
import pptxgen from 'pptxgenjs';
import { notifications } from '@mantine/notifications';
import { saveHunterResult, getHunterResults, updateHunterStatus, searchPartners, updateHunterInfo, deleteHunterResult, scanWebsite } from '@/lib/actions';
import { generateProposalEmail } from '@/lib/ai';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    country?: string; // Added Country
}

const APP_STATUS: Record<string, string> = {
    'New': 'gray',
    'Proposal Sent': 'blue',
    'Proceeding': 'green',
    'Contracted': 'grape',
    'Dropped': 'red'
};

const COUNTRIES = [
    { value: '', label: 'Global (All) 🌍' },
    { value: 'KR', label: 'Korea 🇰🇷' },
    { value: 'JP', label: 'Japan 🇯🇵' },
    { value: 'US', label: 'USA 🇺🇸' },
    { value: 'CN', label: 'China 🇨🇳' },
    { value: 'VN', label: 'Vietnam 🇻🇳' }
];

// Smart Targets Definition
const TARGET_PRESETS = [
    {
        label: 'Wasabi Distributors',
        icon: '🌱',
        keywords: {
            'KR': '와사비 유통 도매 업체',
            'JP': '山葵 わさび 卸売業者 流通',
            'US': 'Wasabi wholesale distributors',
            'CN': '芥末 批发商',
            'VN': 'Nhà phân phối Wasabi',
            'Global': 'Wasabi distributors wholesale'
        }
    },
    {
        label: 'Smart Farm Research',
        icon: '🔬',
        keywords: {
            'KR': '스마트팜 연구소 농업기술원',
            'JP': 'スマートファーム 農業 研究所',
            'US': 'Smart AgTech Research Institute',
            'CN': '智慧农业 研究院',
            'VN': 'Viện nghiên cứu nông nghiệp thông minh',
            'Global': 'Smart Farming Research Institute'
        }
    },
    {
        label: 'Food Processing',
        icon: ' Bento',
        keywords: {
            'KR': '식품 가공 제조 업체 (소스, 양념)',
            'JP': '食品加工 会社 調味料',
            'US': 'Food processing companies ingredients',
            'CN': '食品加工厂',
            'VN': 'Công ty chế biến thực phẩm',
            'Global': 'Food Processing Manufactures'
        }
    },
    {
        label: 'High-end Restaurants',
        icon: '🍣',
        keywords: {
            'KR': '고급 일식 오마카세 식자재 납품',
            'JP': '高級 寿司 料亭 仕入れ',
            'US': 'High-end Japanese Restaurant Suppliers',
            'CN': '高端 日本料理 供应商',
            'VN': 'Nhà hàng Nhật Bản cao cấp',
            'Global': 'Premium Japanese Restaurant Suppliers'
        }
    },
    {
        label: 'Big Fish (Prestige)',
        icon: '🐋',
        keywords: {
            'KR': 'site:.ac.kr 스마트팜 연구원 교수 생명공학',
            'JP': 'site:.ac.jp スマートファーム 教授 研究所',
            'US': 'site:.edu plant science vertical farming research lab director',
            'CN': '智慧农业 教授 研究院',
            'VN': 'Nghiên cứu nông nghiệp đại học',
            'Global': 'site:.edu agricultural biotech research institute director'
        }
    },
    {
        label: '파리채',
        icon: '🪰',
        keywords: {
            'KR': '와사비 식자재 납품 업체 유통 도매 리스트',
            'JP': '山葵 卸売業者 販売店 リスト',
            'US': 'wasabi supply chain distributors wholesalers list',
            'CN': '芥末 批发 零售 列表',
            'VN': 'Danh sách nhà bán lẻ Wasabi',
            'Global': 'wasabi food service suppliers wholesalers directory'
        }
    },
    {
        label: 'Investors / VC',
        icon: '💰',
        keywords: {
            'KR': '스마트팜 스타트업 투자 벤처캐피털 AC VC',
            'JP': 'アグリテック スタートアップ 投資 VC',
            'US': 'AgTech venture capital indoor farming investment corp',
            'CN': '农业科技 投资 风险投资',
            'VN': 'Đầu tư nông nghiệp thông minh',
            'Global': 'Agricultural technology venture capital firms'
        }
    },
    {
        label: 'Gov / Tenders',
        icon: '🏛️',
        keywords: {
            'KR': '스마트팜 정부 국책 사업 입찰 공고',
            'JP': 'スマートファーム 政府 補助금 公募',
            'US': 'smart farm government grants USDA tender opportunities',
            'CN': '农业部 智慧农业 招标',
            'VN': 'Thầu nông nghiệp chính phủ',
            'Global': 'Government smart farming grant and tender opportunities'
        }
    }
];

export default function HunterPage() {
    // Search State
    const [keyword, setKeyword] = useState('');
    const [country, setCountry] = useState<string | null>(''); // Default to Global (All)
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

    const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // Initial Data Load
    useEffect(() => {
        loadSavedPartners();
    }, []);

    const loadSavedPartners = async () => {
        try {
            const data = await getHunterResults();

            if (Array.isArray(data)) {
                setSavedPartners(data);
            } else {
                notifications.show({ title: 'Error', message: 'Data sync invalid.', color: 'red' });
            }
        } catch (error) {
            console.error('Failed to load partners:', error);
            notifications.show({ title: 'Connection Error', message: 'Could not fetch data.', color: 'red' });
        }
    };

    const handlePresetClick = (preset: any) => {
        const activeCountry = country || 'Global';
        const searchTerm = preset.keywords[activeCountry] || preset.keywords['Global'];
        setKeyword(searchTerm);
        performSearch(searchTerm, country);
    };

    const performSearch = async (term: string, countryCode: string | null) => {
        setLoading(true);
        setResults([]);
        setPage(1);

        try {
            const data = await searchPartners(term, 1, countryCode || '');
            setResults(data);

            if (data.length > 0) {
                notifications.show({ title: 'Target Locked 🎯', message: `Found partners for: ${term}`, color: 'teal' });
            } else {
                notifications.show({ title: 'No Results', message: 'Try a different target.', color: 'gray' });
            }
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to search partners.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => performSearch(keyword, country);

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setLoading(true);

        try {
            const data = await searchPartners(keyword, nextPage, country || '');
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
            notifications.show({ title: 'Notice', message: (result as any).message || (result as any).warning || 'Partner already saved.', color: 'orange' });
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

    const handleChangeCountry = async (partnerId: number, newCountry: string) => {
        const result = await updateHunterInfo(partnerId, { country: newCountry });
        if (result.success) {
            notifications.show({ title: 'Country Updated', message: `Region changed.`, color: 'teal' });
            loadSavedPartners();
        }
    };

    const handleDismiss = (id: number) => {
        setResults((prev) => prev.filter((item) => item.id !== id));
        notifications.show({ title: 'Dismissed', message: 'Removed from search results.', color: 'gray', autoClose: 1500 });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to remove this partner from your pipeline?')) {
            const result = await deleteHunterResult(id);
            if (result.success) {
                notifications.show({ title: 'Deleted', message: 'Partner removed from pipeline.', color: 'red' });
                loadSavedPartners();
            } else {
                notifications.show({ title: 'Error', message: 'Failed to delete partner.', color: 'red' });
            }
        }
    };

    const handleScan = async (partner: HunterResult) => {
        if (!partner.url) return notifications.show({ title: 'No Link', message: 'This partner has no website to scan.', color: 'red' });

        notifications.show({ title: 'Scanning...', message: `Visiting ${partner.name}...`, color: 'blue', loading: true });
        const result = await scanWebsite(partner.url);

        if (result.success) {
            let updateMsg = '';
            const updates: any = {};

            if (result.emails && result.emails.length > 0) {
                updates.email = result.emails[0];
                updateMsg += `Email: ${result.emails[0]} `;
            }
            if (result.phones && result.phones.length > 0) {
                updates.phone = result.phones[0];
                updateMsg += `Phone: ${result.phones[0]}`;
            }

            if (Object.keys(updates).length > 0) {
                if (savedPartners.some(p => p.id === partner.id)) {
                    await updateHunterInfo(partner.id, updates);
                    loadSavedPartners();
                } else {
                    setResults(prev => prev.map(p => p.id === partner.id ? { ...p, ...updates } : p));
                }
                notifications.show({ title: 'Scan Complete', message: updateMsg || 'Found contact info!', color: 'green' });
            } else {
                notifications.show({ title: 'Scan Complete', message: 'No contact info found on the main page.', color: 'orange' });
            }
        } else {
            notifications.show({ title: 'Scan Failed', message: (result as any).error || 'Could not access site.', color: 'red' });
        }
    };

    const handlePreview = (partner: HunterResult) => {
        setSelectedPartner(partner);
        setEmailMode(false);
        setDraftEmail({ subject: '', body: '' });
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
            setLoading(true);

            try {
                await saveHunterResult(selectedPartner);
                await updateHunterStatus(selectedPartner.id, 'Proposal Sent');
                loadSavedPartners();

                const aiResponse = await generateProposalEmail({
                    partnerName: selectedPartner.name,
                    partnerType: selectedPartner.type,
                    relevance: selectedPartner.relevance,
                    contactPerson: selectedPartner.contact,
                    country: selectedPartner.country
                });

                if (aiResponse.body && (aiResponse.body.includes("error") || aiResponse.body.includes("Unavailable"))) {
                    notifications.show({ title: 'AI Notice', message: 'AI is momentarily busy. Using standard template.', color: 'orange' });
                }

                const signature = `\n\n------------------------------\n洪泳喜 (Jerry Y. Hong)\nK-Farm International\nMobile: +82-10-4355-0633\nEmail: sbienv0633@gmail.com\nWeb: www.ksmart-farm.com`;
                setDraftEmail({
                    subject: aiResponse.subject || `[Proposal] Partnership with K-Farm International`,
                    body: (aiResponse.body || getEmailContent(selectedPartner).body) + signature
                });

            } catch (error) {
                notifications.show({ title: 'System Error', message: 'Failed to generate proposal.', color: 'red' });
            } finally {
                setLoading(false);
            }
        }
    };

    const getEmailContent = (partner: HunterResult) => {
        const subject = `[Proposal] Strategic Partnership: K-Farm x ${partner.name}`;
        const body = `Dear ${partner.contact || 'Partner'},\n\nI hope this email finds you well.\n\nMy name is Jerry Y. Hong, representing K-Farm International. We have been following the work of ${partner.name} with great interest.\n\nWe believe there is a strong potential for synergy between our organizations.\n\nBest regards,`;
        return { subject, body };
    };

    return (
        <Container size="xl" py={40}>
            <Stack align="center" mb={40}>
                <Group justify="space-between" w="100%">
                    <div />
                    <Stack align="center" gap="xs">
                        <Badge variant="filled" color="grape" size="lg">Sales Agent Beta</Badge>
                        <Title order={1}>Hunter <Badge color="red" variant="light" size="sm">SECURE v2.1</Badge></Title>
                    </Stack>
                    <Group>
                        <Button component={Link} href="/admin" variant="subtle" color="gray">
                            Dashboard
                        </Button>
                        <Button onClick={handleLogout} size="sm" color="red" variant="light">
                            Logout
                        </Button>
                    </Group>
                </Group>
                <Text c="dimmed" ta="center" maw={600}>
                    I will scour the web to find the best potential partners for K-Farm.
                    Save them to your pipeline and manage your outreach.
                </Text>
                <Button
                    variant="outline"
                    color="green"
                    mt="md"
                    leftSection={<IconDownload size={16} />}
                    onClick={() => {
                        const escapeCsv = (val: string) => `"${(val || '').toString().replace(/"/g, '""')}"`;
                        const headers = ["Name", "Type", "Relevance", "Contact", "Phone", "Email", "URL", "Status"];
                        const rows = savedPartners.map(e => [
                            e.name, e.type, e.relevance, e.contact || "", e.phone || "", e.email || "", e.url, e.status || "New"
                        ].map(val => escapeCsv(val)).join(","));

                        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `k_farm_partners_${new Date().toISOString().split('T')[0]}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        notifications.show({ title: 'Exported', message: 'Partner list downloaded as CSV.', color: 'green' });
                    }}
                >
                    Export Pipeline to Google Sheets (CSV)
                </Button>
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
                            <Select
                                label="Target Country"
                                data={COUNTRIES}
                                value={country}
                                onChange={setCountry}
                                style={{ width: 150 }}
                                allowDeselect={false}
                            />
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

                    <Stack gap="xs" mb="xl">
                        <Text size="sm" fw={500} c="dimmed">Quick Target (Click to auto-search):</Text>
                        <Group gap={8}>
                            {TARGET_PRESETS.map((preset) => (
                                <Badge
                                    key={preset.label}
                                    size="lg"
                                    variant="outline"
                                    color="gray"
                                    style={{ cursor: 'pointer', textTransform: 'none' }}
                                    onClick={() => handlePresetClick(preset)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {preset.icon} {preset.label}
                                </Badge>
                            ))}
                        </Group>
                    </Stack>

                    {results.length > 0 && (
                        <Stack>
                            <Group justify="space-between" mb={-10}>
                                <Text size="sm" c="dimmed">Found {results.length} results</Text>
                                {results[0].isMock && <Badge color="orange" variant="light">Demo Mode</Badge>}
                            </Group>
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w={60}>Cntry</Table.Th>
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
                                            <Table.Td>
                                                <Badge variant="outline" color="gray" size="sm">{element.country || 'Global'}</Badge>
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
                                            <Table.Td><Badge variant="light" color="blue">{element.type}</Badge></Table.Td>
                                            <Table.Td style={{ maxWidth: 300 }}>
                                                <Text size="xs" lineClamp={2}>{element.relevance}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                {element.contact && element.contact.includes('@') ? (
                                                    <Group gap={4} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `mailto:${element.contact}`}>
                                                        <IconMail size={12} color="gray" />
                                                        <Text size="xs" fw={500} c="blue" style={{ textDecoration: 'underline' }}>{element.contact}</Text>
                                                    </Group>
                                                ) : (
                                                    <Text size="xs" fw={500}>{element.contact?.startsWith('http') ? '-' : element.contact}</Text>
                                                )}
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
                                                    <Tooltip label="Scan Website">
                                                        <ActionIcon variant="light" color="grape" size="sm" onClick={() => handleScan(element)}>
                                                            <IconScan size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Dismiss">
                                                        <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleDismiss(element.id)}>
                                                            <IconX size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
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
                            <Title order={3}>My Pipeline <Text span size="sm" c="dimmed">({savedPartners.length})</Text></Title>
                            <Button
                                variant="subtle"
                                color="gray"
                                size="sm"
                                leftSection={<IconCheck size={14} />}
                                onClick={() => {
                                    notifications.show({ title: 'Syncing', message: 'Checking for updates...', color: 'blue', autoClose: 1000 });
                                    loadSavedPartners();
                                }}
                            >
                                Sync Data
                            </Button>
                        </Group>

                        {savedPartners.length === 0 ? (
                            <Text c="dimmed" fs="italic" ta="center" py="xl">No partners saved yet.</Text>
                        ) : (
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w={60}>Cntry</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Organization</Table.Th>
                                        <Table.Th>Contact</Table.Th>
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
                                                        <Badge variant="outline" color="gray" size="sm" style={{ cursor: 'pointer' }}>{element.country || 'Global'}</Badge>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        {COUNTRIES.map((c) => (
                                                            <Menu.Item key={c.value} onClick={() => handleChangeCountry(element.id, c.value || 'Global')}>
                                                                {c.label}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
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
                                                    <Tooltip label="Scan Website">
                                                        <ActionIcon variant="light" color="grape" size="sm" onClick={() => handleScan(element)}>
                                                            <IconScan size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Visit Website">
                                                        <ActionIcon component="a" href={element.url} target="_blank" variant="default" size="sm">
                                                            <IconWorld size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Delete">
                                                        <ActionIcon variant="subtle" color="red" size="sm" onClick={() => handleDelete(element.id)}>
                                                            <IconTrash size={14} />
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

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={emailMode ? "Draft Email" : "Proposal Preview"}
                size="xl"
                centered
            >
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
                        <TextInput label="Subject" value={draftEmail.subject || ''} onChange={(e) => setDraftEmail({ ...draftEmail, subject: e.currentTarget.value })} rightSection={<CopyButton value={draftEmail.subject || ''}>
                            {({ copied, copy }) => (<ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}><IconCopy size={16} /></ActionIcon>)}
                        </CopyButton>} />
                        <Textarea label="Body" value={draftEmail.body || ''} onChange={(e) => setDraftEmail({ ...draftEmail, body: e.currentTarget.value })} autosize minRows={10} rightSection={<CopyButton value={draftEmail.body || ''}>
                            {({ copied, copy }) => (
                                <Stack>
                                    <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}><IconCopy size={16} /></ActionIcon>
                                    {loading && <Loader size="xs" color="pink" />}
                                </Stack>
                            )}
                        </CopyButton>} />

                        <Button
                            component="a"
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(editForm.email || selectedPartner.email || '')}&su=${encodeURIComponent(draftEmail.subject)}&body=${encodeURIComponent(draftEmail.body)}`}
                            target="_blank"
                            leftSection={<IconMail size={16} />}
                            color="blue"
                            size="md"
                            fullWidth
                            onClick={() => {
                                notifications.show({ title: 'Opening Gmail', message: 'Check the new tab to send your proposal.', color: 'blue' });
                                setOpened(false);
                            }}
                        >
                            Send via Gmail
                        </Button>
                    </Stack>
                )}
            </Modal>

            <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Partner Info" centered>
                <Stack>
                    <TextInput label="Organization Name" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <Select
                        label="Country"
                        data={COUNTRIES}
                        value={editForm.country || 'Global'}
                        onChange={(val) => setEditForm({ ...editForm, country: val || 'Global' })}
                    />
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
