"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import {
    Container,
    Title,
    Text,
    Card,
    Group,
    Badge,
    Button,
    Stack,
    ActionIcon,
    Tooltip,
    Table,
    Checkbox,
    Tabs,
    SegmentedControl,
    Menu,
    Divider,
    Modal,
    Select,
    TextInput,
    Pagination,
    Loader,
    Center,
    FileButton,
    SimpleGrid
} from '@mantine/core';
import {
    IconSearch,
    IconExternalLink,
    IconRobot,
    IconDownload,
    IconCheck,
    IconMail,
    IconArrowLeft,
    IconPlus,
    IconEdit,
    IconWorld,
    IconTrash,
    IconX,
    IconScan,
    IconCopy,
    IconRocket,
    IconCircleCheck,
    IconFileDescription,
    IconPdf
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
    getHunterResults,
    saveHunterResult,
    deleteHunterResult,
    updateHunterStatus,
    updateHunterInfo,
    updateHunterInfoBulk,
    searchPartners,
    sendBulkProposals,
    scanWebsite,
    runDeepResearch,
    importPartnersBulk,
    uploadHunterFile
} from '@/lib/actions';
import { useTranslation } from '@/lib/i18n';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { translateSearchKeyword, generateProposalEmail } from '@/lib/ai';

export interface HunterResult {
    id: number;
    name: string;
    url: string;
    description?: string;
    country: string;
    type: string;
    relevance: string;
    status: string;
    email?: string;
    phone?: string;
    contact?: string;
    lastContacted?: string;
    aiSummary?: {
        score: number;
        analysis: string;
        angle: string;
    };
    intelligenceReport?: string;
    sns?: {
        instagram?: string;
        facebook?: string;
        linkedin?: string;
        youtube?: string;
    };
    address?: string;
    category?: string;
    catalogs?: string[];
    techSpecs?: { label: string; value: string }[];
    isMock?: boolean;
}

const COUNTRIES = [
    { label: 'Global (All)', value: '' },
    { label: 'South Korea 🇰🇷', value: 'KR' },
    { label: 'Japan 🇯🇵', value: 'JP' },
    { label: 'United States 🇺🇸', value: 'US' },
    { label: 'China 🇨🇳', value: 'CN' }
];

// Fixed mapping for display labels vs value
const COUNTRY_DISPLAY: Record<string, string> = {
    '': 'Global',
    'JP': 'Japan',
    'US': 'United States',
    'KR': 'South Korea',
    'CN': 'China'
};

const APP_STATUS: Record<string, string> = {
    'New': 'gray',
    'AI Analyzed': 'cyan',
    'Proposal Sent': 'blue',
    'Proceeding': 'green',
    'Contracted': 'grape',
    'Dropped': 'red'
};

const PARTNER_TYPES = [
    'Sales: Wholesale/B2B',
    'Sales: Direct/F&B',
    'Vendor: Procurement',
    'Partner: R&D/Tech',
    'Investor',
    'Lead',
    'Other'
];

const SPECIALTIES = [
    '건축 및 설계',
    '재배 시스템',
    '배지 솔루션',
    '냉난방 설비',
    '공조 시스템',
    '기류 제어',
    '양액 기계',
    '관수 설비',
    '인공 광원',
    '운영 SW',
    'IoT 하드웨어',
    '로봇/자동화',
    '기타'
];

export default function HunterAdmin() {
    const { t } = useTranslation();

    // Smart Targets Definition
    const TARGET_PRESETS = [
        {
            label: 'GLOBAL: Big Fish',
            icon: '🐋',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Importer) "Distribution Agreement" -amazon -ebay',
                'Global': '"Wasabi" (B2B OR Distributor) (contact OR "wholesale inquiry") -amazon -ebay -blog'
            }
        },
        {
            label: 'US: West (CA/WA/OR)',
            icon: '🏖️',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Distributor) ("California" OR "Washington" OR "Oregon") -amazon -ebay',
                'Global': '"Wasabi" Distributor West Coast USA'
            }
        },
        {
            label: 'US: East (NY/FL/MA)',
            icon: '🗽',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Distributor) ("New York" OR "Florida" OR "Massachusetts") -amazon -ebay',
                'Global': '"Wasabi" Distributor East Coast USA'
            }
        },
        {
            label: 'US: Central (TX/IL/GA)',
            icon: '🤠',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Distributor) ("Texas" OR "Illinois" OR "Georgia") -amazon -ebay',
                'Global': '"Wasabi" Distributor Central USA'
            }
        },
        {
            label: 'JP: Big Fish (Shizuoka/Fuji)',
            icon: '🎌',
            keywords: {
                'JP': '("わさび" OR "生わ사비") ("静岡" OR "富士") ("卸売" OR "仕入れ" OR "業者") "회사개요" -site:amazon.co.jp -site:rakuten.co.jp',
                'Global': '"Wasabi" (Wholesale OR Distributor Shizuoka) "Corporate Office" -amazon -ebay'
            }
        },
        {
            label: 'JP: Food Service',
            icon: '🏢',
            keywords: {
                'JP': '("業務用" OR "大口注文") ("生わ사비" OR "本와사비") "仕入れ" "業者向け" -review -youtube',
                'Global': 'Commercial Wasabi Bulk Supply Contact Japan'
            }
        },
        {
            label: 'JP: Trade Lists',
            icon: '📄',
            keywords: {
                'JP': '(filetype:pdf OR filetype:xlsx) ("わ사비" OR "生와사비") ("業者名簿" OR "取扱業者一覧") -recipe',
                'Global': 'filetype:pdf "Wasabi" "Exhibitor List" OR "Supplier Directory"'
            }
        },
        {
            label: 'JP: Agritech R&D',
            icon: '🧪',
            keywords: {
                'JP': '("植物工場" OR "噴霧耕") ("わ사비" OR "ワサ비") "共同연구" OR "기술협력" "法人窓口" -blog',
                'Global': 'Japan Smart Farm Wasabi R&D Corporate Partnership'
            }
        },
        {
            label: 'US: Smart Ag-Tech (Equipment)',
            icon: '🚜',
            keywords: {
                'US': '("Smart Farm" OR "Agri-tech") (Distributor OR Wholesaler) (Equipment OR Sensors OR Automation) -amazon -ebay',
                'Global': '"Smart Agriculture" Equipment Distributor USA "Wholesale Inquiry"'
            }
        },
        {
            label: 'JP: Smart Ag-Tech (System/IoT)',
            icon: '📡',
            keywords: {
                'JP': '("スマート農業" OR "植物工場") ("시스템" OR "센서" OR "설비") ("卸売" OR "代理점" OR "導入") -site:amazon.co.jp',
                'Global': 'Japan Smart Farming IoT Solutions Wholesaler OR System Integrator'
            }
        },
        {
            label: 'KR: Wasabi Farms (Growers)',
            icon: '🌿',
            keywords: {
                'KR': '("와사비" OR "고추냉이") ("농장" OR "재배" OR "농가") ("비닐하우스" OR "스마트팜") "위치" -recipe',
                'Global': 'Wasabi Farms South Korea Greenhouse Growers'
            }
        }
    ];

    // Search State
    const [keyword, setKeyword] = useState('');
    const [country, setCountry] = useState<string | null>('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<HunterResult[]>([]);
    const [page, setPage] = useState(1);

    // CRM State
    const [activeTab, setActiveTab] = useState<string | null>('search');
    const [savedPartners, setSavedPartners] = useState<HunterResult[]>([]);
    const [pipelineCountryFilter, setPipelineCountryFilter] = useState('All');
    const [pipelineCategoryFilter, setPipelineCategoryFilter] = useState('All');
    const [pipelineSpecialtyFilter, setPipelineSpecialtyFilter] = useState('All');
    const [pipelinePage, setPipelinePage] = useState(1);
    const PIPELINE_PAGE_SIZE = 50;

    const filteredPartners = useMemo(() => {
        return savedPartners.filter(p => {
            // 1. Country Filter
            let countryMatch = false;
            if (pipelineCountryFilter === 'All') {
                countryMatch = true;
            } else {
                const raw = (p.country || '').toLowerCase().trim();
                let normalized = p.country || 'South Korea';

                if (raw === 'kr' || raw === 'korea' || raw === 'south korea' || raw === '대한민국' || raw === '한국') normalized = 'South Korea';
                if (raw === 'jp' || raw === 'japan' || raw === '일본') normalized = 'Japan';
                if (raw === 'us' || raw === 'usa' || raw === 'united states' || raw === '미국') normalized = 'United States';
                if (raw === 'cn' || raw === 'china' || raw === '중국') normalized = 'China';

                if (pipelineCountryFilter === 'Other') {
                    countryMatch = !['South Korea', 'Japan', 'United States', 'China'].includes(normalized);
                } else {
                    countryMatch = normalized === pipelineCountryFilter;
                }
            }

            // 2. Category Filter
            let categoryMatch = false;
            if (pipelineCategoryFilter === 'All') {
                categoryMatch = true;
            } else {
                const pType = p.type || 'Other';
                categoryMatch = pType === pipelineCategoryFilter;
            }

            // 3. Specialty Filter
            let specialtyMatch = false;
            if (pipelineSpecialtyFilter === 'All') {
                specialtyMatch = true;
            } else {
                specialtyMatch = p.category === pipelineSpecialtyFilter;
            }

            return countryMatch && categoryMatch && specialtyMatch;
        });
    }, [savedPartners, pipelineCountryFilter, pipelineCategoryFilter, pipelineSpecialtyFilter]);

    const paginatedPartners = useMemo(() => {
        const start = (pipelinePage - 1) * PIPELINE_PAGE_SIZE;
        return filteredPartners.slice(start, start + PIPELINE_PAGE_SIZE);
    }, [filteredPartners, pipelinePage]);

    // Modal State
    const [opened, setOpened] = useState(false);
    const [editOpened, setEditOpened] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<HunterResult | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [emailMode, setEmailMode] = useState(false);
    const [duplicateCount, setDuplicateCount] = useState(0);
    const [bulkSending, setBulkSending] = useState(false);
    const [bulkCategorizing, setBulkCategorizing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [researching, setResearching] = useState<number | null>(null);
    const [draftEmail, setDraftEmail] = useState<{ subject: string; body: string } | null>(null);

    const [modalTab, setModalTab] = useState<string | null>('strategy');

    // Edit Form State
    const [editForm, setEditForm] = useState<Partial<HunterResult>>({});

    // Manual Add State
    const [manualOpened, setManualOpened] = useState(false);
    const [manualForm, setManualForm] = useState<Partial<HunterResult>>({
        name: '',
        url: '',
        country: 'South Korea',
        type: 'Vendor: Procurement',
        category: '기타',
        status: 'New',
        relevance: 'Manual Entry'
    });

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
            }
        } catch (error) {
            console.error('Failed to load partners:', error);
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length >= filteredPartners.length && filteredPartners.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredPartners.map((p: any) => p.id));
        }
    };

    const toggleSelectPage = () => {
        const pageIds = paginatedPartners.map(p => p.id);
        const allPageSelected = pageIds.every(id => selectedIds.includes(id));

        if (allPageSelected) {
            setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const processFileContent = (text: string) => {
            // Improved Line Split & Filtering
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length < 2) return null;

            // Enhanced Delimiter Detection
            const firstLine = lines[0];
            const commaCount = (firstLine.match(/,/g) || []).length;
            const semiCount = (firstLine.match(/;/g) || []).length;
            const tabCount = (firstLine.match(/\t/g) || []).length;

            let delimiter = ',';
            if (semiCount > commaCount) delimiter = ';';
            if (tabCount > semiCount && tabCount > commaCount) delimiter = '\t';

            // Robust CSV line parser
            const parseLine = (line: string) => {
                const result = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') inQuotes = !inQuotes;
                    else if (char === delimiter && !inQuotes) {
                        result.push(current.trim());
                        current = '';
                    } else current += char;
                }
                result.push(current.trim());
                return result.map(v => v.replace(/^"|"$/g, '').trim());
            };

            const rawHeaders = parseLine(lines[0]);
            const headers = rawHeaders.map(h => h.toLowerCase());

            const data = lines.slice(1).map(line => {
                const values = parseLine(line);
                const obj: any = {};

                // Track if we found a name via header
                let nameFound = false;

                headers.forEach((h, i) => {
                    const val = values[i] || '';
                    if (!val) return;

                    const isName = h.includes('name') || h.includes('회사') || h.includes('업체') || h.includes('기관') || h.includes('기업') || h.includes('이름') || h.includes('상호');
                    const isUrl = h.includes('url') || h.includes('홈페이지') || h.includes('링크') || h.includes('주소') || h.includes('site') || h.includes('web');

                    if (isName) { obj.name = val; nameFound = true; }
                    else if (isUrl) obj.url = val;
                    else if (h.includes('country') || h.includes('국가') || h.includes('지역')) obj.country = val;
                    else if (h.includes('email') || h.includes('이메일') || h.includes('메일')) obj.email = val;
                    else if (h.includes('phone') || h.includes('전화') || h.includes('연락처') || h.includes('hp') || h.includes('tel')) obj.phone = val;
                    else if (h.includes('contact') || h.includes('담당자')) obj.contact = val;
                    else if (h.includes('type') || h.includes('유형') || h.includes('구분')) obj.type = val;
                });

                // Ultimate Fallback: If no name found via header, take the first column that has text
                if (!obj.name) {
                    for (const v of values) {
                        if (v && v.length > 1) {
                            obj.name = v;
                            break;
                        }
                    }
                }

                // Extra Guess: If no URL, check if 2nd or 3rd column looks like one
                if (!obj.url) {
                    values.forEach(v => {
                        if (v.includes('http') || (v.includes('.') && v.length > 5 && !v.includes(' '))) {
                            obj.url = v;
                        }
                    });
                }
                return obj;
            }).filter(obj => obj.name && obj.name.length > 0);

            return data;
        };

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            let data = processFileContent(text);

            // AUTO-RETRY with EUC-KR if data looks invalid (handles Korean Excel CSV encoding)
            // Check for empty data or if the first name appears garbled (e.g., contains non-alphanumeric characters that are not expected in a name)
            const isDataInvalid = !data || data.length === 0 || (data[0]?.name && !/[a-zA-Z0-9가-힣\s.,'"`~!@#$%^&*()_+-={}\[\]:;<>\/?\\|]/.test(data[0].name));

            if (isDataInvalid) {
                const retryReader = new FileReader();
                retryReader.onload = async (re) => {
                    const retryText = re.target?.result as string;
                    const retryData = processFileContent(retryText);
                    if (retryData && retryData.length > 0) {
                        const res = await importPartnersBulk(retryData);
                        if (res.success) {
                            notifications.show({ title: '가져오기 성공', message: `${res.count}개의 파트너 정보가 추가되었습니다.`, color: 'green' });
                            loadSavedPartners();
                        } else {
                            notifications.show({ title: '오류 발생', message: res.error, color: 'red' });
                        }
                    } else {
                        notifications.show({
                            title: '데이터 인식 실패',
                            message: `파일 내용을 이해하지 못했습니다. 첫 줄에 '회사명' 버튼이 있는지, 혹은 엑셀 저장 시 'CSV UTF-8' 형식을 사용했는지 확인해주세요.`,
                            color: 'red',
                            autoClose: 15000
                        });
                    }
                };
                retryReader.readAsText(file, 'EUC-KR');
                return;
            }

            const res = await importPartnersBulk(data);
            if (res.success) {
                notifications.show({
                    title: '가져오기 성공',
                    message: `${res.count}개의 파트너 정보가 성공적으로 추가되었습니다.`,
                    color: 'green'
                });
                loadSavedPartners();
            } else {
                notifications.show({ title: '오류 발생', message: res.error, color: 'red' });
            }
        };
        // Use UTF-8 for reading to handle Korean characters correctly
        reader.readAsText(file, 'UTF-8');
        // Reset input
        event.target.value = '';
    };

    const handleBulkSend = async () => {
        if (selectedIds.length === 0) return;
        const targetPartners = savedPartners.filter((p: any) => selectedIds.includes(p.id));
        const partnersWithEmail = targetPartners.filter((p: any) => p.email && p.email.includes('@'));

        if (partnersWithEmail.length === 0) {
            notifications.show({ title: 'No Emails Found', message: 'Selected partners do not have valid emails.', color: 'orange' });
            return;
        }

        if (!confirm(`🚀 Bulk Launch: Send personalized AI proposals to ${partnersWithEmail.length} partners?`)) return;

        setBulkSending(true);
        try {
            const result = await sendBulkProposals(partnersWithEmail);
            if (result.success) {
                notifications.show({
                    title: 'Bulk Launch Complete! 🚀',
                    message: `Successfully sent ${result.sent} / ${result.total} emails.`,
                    color: 'green'
                });
                loadSavedPartners();
                setSelectedIds([]);
            }
        } catch (err) {
            notifications.show({ title: 'Bulk Error', message: 'System interrupted.', color: 'red' });
        } finally {
            setBulkSending(false);
        }
    };

    const handleBulkFastMove = async (newType: string) => {
        if (selectedIds.length === 0) return;
        const res = await updateHunterInfoBulk(selectedIds, { type: newType });
        if (res.success) {
            notifications.show({ title: '이동 완료', message: `${res.updated}개의 업체를 [${newType}] 카테고리로 이동했습니다.`, color: 'green' });
            setSelectedIds([]);
            loadSavedPartners();
        } else {
            notifications.show({ title: '오류 발생', message: res.error, color: 'red' });
        }
    };

    const handleBulkCategorize = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`📡 AI Intelligence: Automatically categorize ${selectedIds.length} selected partners? This will visit their websites.`)) return;

        setBulkCategorizing(true);
        let successCount = 0;

        for (let i = 0; i < selectedIds.length; i++) {
            const id = selectedIds[i];
            const partner = savedPartners.find(p => p.id === id);
            if (!partner || !partner.url) continue;

            const result = await scanWebsite(partner.url, partner.name);
            if (result.success) {
                let autoType = partner.type;
                const analysisText = (result.aiSummary?.analysis || '').toLowerCase();
                const angleText = (result.aiSummary?.angle || '').toLowerCase();
                const combined = (analysisText + ' ' + angleText).toLowerCase();

                if (combined.includes('equipment') || combined.includes('machinery') || combined.includes('system') || combined.includes('automation')) {
                    autoType = 'Vendor: Procurement';
                } else if (combined.includes('wholesale') || combined.includes('distributor') || combined.includes('supplier') || combined.includes('유통') || combined.includes('도매')) {
                    autoType = 'Sales: Wholesale/B2B';
                } else if (combined.includes('restaurant') || combined.includes('chef') || combined.includes('dining') || combined.includes('식당')) {
                    autoType = 'Sales: Direct/F&B';
                } else if (combined.includes('research') || combined.includes('lab') || combined.includes('university')) {
                    autoType = 'Partner: R&D/Tech';
                }

                await updateHunterInfo(id, {
                    email: result.emails?.[0] || partner.email,
                    phone: result.phones?.[0] || partner.phone,
                    aiSummary: result.aiSummary,
                    type: autoType,
                    status: result.aiSummary ? 'AI Analyzed' : 'New'
                });
                successCount++;
            }
            // Small delay to prevent overwhelming
            await new Promise(r => setTimeout(r, 500));
        }

        notifications.show({
            title: 'Bulk Classification Complete!',
            message: `Successfully categorized ${successCount} partners.`,
            color: 'green'
        });
        setBulkCategorizing(false);
        setSelectedIds([]);
        loadSavedPartners();
    };

    const handlePresetClick = (preset: any) => {
        let activeCountry = country || 'Global';
        if (preset.label.includes('🇯🇵') || preset.label.includes('JP')) activeCountry = 'JP';
        if (preset.label.includes('🇰🇷') || preset.label.includes('KR')) activeCountry = 'KR';
        if (preset.label.includes('🇺🇸') || preset.label.includes('US')) activeCountry = 'US';
        if (preset.label.includes('🇨🇳') || preset.label.includes('CN')) activeCountry = 'CN';

        setCountry(activeCountry === 'Global' ? '' : activeCountry);
        const searchTerm = preset.keywords[activeCountry] || preset.keywords['Global'];
        setKeyword(searchTerm);
        performSearch(searchTerm, activeCountry === 'Global' ? '' : activeCountry);
    };

    const performSearch = async (term: string, countryCode: string | null) => {
        setLoading(true);
        setResults([]);
        setPage(1);

        try {
            let finalTerm = term;
            const isForeign = countryCode && countryCode !== 'KR' && countryCode !== 'Global' && countryCode !== '';
            if (isForeign && /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(term)) {
                finalTerm = await translateSearchKeyword(term, countryCode);
            }

            const data = await searchPartners(finalTerm, 1, countryCode || '');

            if (data.length > 0) {
                const countryCodeToUse = countryCode || '';
                const countryName = COUNTRY_DISPLAY[countryCodeToUse] || 'Global';
                data.forEach((item: HunterResult) => {
                    item.country = countryName;
                });
            }

            const filteredData = data.filter((newItem: HunterResult) => {
                if (!newItem.url) return true;
                return !savedPartners.some(saved => {
                    try {
                        const newHost = new URL(newItem.url).hostname.replace('www.', '');
                        const savedHost = new URL(saved.url).hostname.replace('www.', '');
                        return newHost === savedHost;
                    } catch (e) {
                        return newItem.url === saved.url;
                    }
                });
            });

            setDuplicateCount(data.length - filteredData.length);
            setResults(filteredData);
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
            const data = await searchPartners(keyword, nextPage, country || '');
            const filteredData = data.filter((newItem: HunterResult) => {
                if (!newItem.url) return true;
                return !savedPartners.some(saved => {
                    try {
                        const newHost = new URL(newItem.url).hostname.replace('www.', '');
                        const savedHost = new URL(saved.url).hostname.replace('www.', '');
                        return newHost === savedHost;
                    } catch (e) {
                        return newItem.url === saved.url;
                    }
                });
            });

            if (filteredData.length > 0) {
                const countryCodeToUse = country || '';
                const countryName = COUNTRY_DISPLAY[countryCodeToUse] || 'Global';
                filteredData.forEach((item: HunterResult) => {
                    item.country = countryName;
                });
            }
            setDuplicateCount(prev => prev + (data.length - filteredData.length));
            setResults((prev: HunterResult[]) => [...prev, ...filteredData]);
        } catch (error) {
            notifications.show({ title: 'Error', message: 'Failed to load more.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToList = async (partner: HunterResult) => {
        const result = await saveHunterResult(partner);
        if (result.success) {
            notifications.show({ title: 'Saved', message: `${partner.name} added.`, color: 'green' });
            loadSavedPartners();
        }
    };

    const handleManualSave = async () => {
        if (!manualForm.name) {
            notifications.show({ title: 'Error', message: 'Name is required.', color: 'red' });
            return;
        }
        const newPartner: HunterResult = {
            id: Date.now(),
            ...manualForm as any
        };
        const result = await saveHunterResult(newPartner);
        if (result.success) {
            notifications.show({ title: 'Success', message: 'Partner added manually.', color: 'green' });
            setManualOpened(false);
            setManualForm({
                name: '',
                url: '',
                country: 'South Korea',
                type: 'Sales: Wholesale/B2B',
                status: 'New',
                relevance: 'Manual Entry'
            });
            loadSavedPartners();
        }
    };

    const handleScan = async (partner: HunterResult) => {
        if (!partner.url) return;
        notifications.show({ title: 'Scanning...', message: `Visiting ${partner.name}...`, color: 'blue', loading: true });
        const result = await scanWebsite(partner.url, partner.name);
        if (result.success) {
            // Auto-classify based on AI analysis content
            let autoType = partner.type;
            const analysisText = (result.aiSummary?.analysis || '').toLowerCase();
            const angleText = (result.aiSummary?.angle || '').toLowerCase();
            const combined = (analysisText + ' ' + angleText).toLowerCase();

            if (combined.includes('equipment') || combined.includes('machinery') || combined.includes('system') || combined.includes('automation')) {
                autoType = 'Vendor: Procurement';
            } else if (combined.includes('wholesale') || combined.includes('distributor') || combined.includes('supplier') || combined.includes('유통') || combined.includes('도매')) {
                autoType = 'Sales: Wholesale/B2B';
            } else if (combined.includes('restaurant') || combined.includes('chef') || combined.includes('dining') || combined.includes('식당')) {
                autoType = 'Sales: Direct/F&B';
            } else if (combined.includes('research') || combined.includes('lab') || combined.includes('university')) {
                autoType = 'Partner: R&D/Tech';
            }

            const updates: any = {
                email: result.emails?.[0] || partner.email,
                phone: result.phones?.[0] || partner.phone,
                sns: result.sns || partner.sns,
                address: result.address || partner.address,
                aiSummary: result.aiSummary,
                type: autoType,
                status: result.aiSummary ? 'AI Analyzed' : 'New'
            };
            if (savedPartners.some(p => p.id === partner.id)) {
                await updateHunterInfo(partner.id, updates);
                loadSavedPartners();
            } else {
                setResults(prev => prev.map(p => p.id === partner.id ? { ...p, ...updates } : p));
            }
            notifications.show({ title: 'Scan Complete', message: `Updated info & classified as ${autoType}`, color: 'green' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete partner?')) {
            await deleteHunterResult(id);
            loadSavedPartners();
        }
    };

    const handleChangeStatus = async (id: number, status: string) => {
        await updateHunterStatus(id, status);
        loadSavedPartners();
    };

    const handleChangeCountry = async (id: number, country: string) => {
        await updateHunterInfo(id, { country: COUNTRY_DISPLAY[country] || country });
        loadSavedPartners();
    };

    const handleEdit = (partner: HunterResult) => {
        setSelectedPartner(partner);
        setEditForm(partner);
        setEditOpened(true);
    };

    const handleSaveEdit = async () => {
        if (selectedPartner) {
            await updateHunterInfo(selectedPartner.id, editForm);
            setEditOpened(false);
            loadSavedPartners();
            notifications.show({ title: 'Success', message: 'Partner info updated.', color: 'green' });
        }
    };

    const handleUploadCatalog = async (file: File | null, isEdit: boolean) => {
        if (!file) return;

        const fd = new FormData();
        fd.append('file', file);

        notifications.show({ title: 'Uploading...', message: 'Saving catalog file...', color: 'blue', loading: true });
        const res = await uploadHunterFile(fd);

        if (res.success && res.url) {
            notifications.show({ title: 'Upload Success', message: 'Catalog file saved.', color: 'green' });
            if (isEdit) {
                const newCatalogs = [...(editForm.catalogs || []), res.url];
                setEditForm({ ...editForm, catalogs: newCatalogs });
                // If modal is already open and item exists, we might want to save immediately
                if (selectedPartner) {
                    await updateHunterInfo(selectedPartner.id, { catalogs: newCatalogs });
                    loadSavedPartners();
                }
            } else {
                setManualForm({ ...manualForm, catalogs: [...(manualForm.catalogs || []), res.url] });
            }
        } else {
            notifications.show({ title: 'Upload Failed', message: res.error || 'Failed to save file.', color: 'red' });
        }
    };

    const handlePreview = (partner: HunterResult) => {
        setSelectedPartner(partner);
        setEmailMode(false);
        setDraftEmail(null);
        setModalTab('strategy');
        setOpened(true);
    };

    const handleDraftEmail = async () => {
        if (!selectedPartner) return;
        setLoading(true);
        try {
            const countryCode = COUNTRIES.find(c => c.label.includes(selectedPartner.country))?.value || 'KR';
            const draft = await generateProposalEmail({
                partnerName: selectedPartner.name,
                partnerType: selectedPartner.type,
                relevance: selectedPartner.relevance,
                contactPerson: selectedPartner.contact,
                country: countryCode as any,
                intelligenceReport: selectedPartner.intelligenceReport
            });
            setDraftEmail(draft);
            setEmailMode(true);
        } catch (error) {
            notifications.show({ title: 'Draft Error', message: 'Failed to generate AI email.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeepResearch = async (id: number) => {
        setResearching(id);
        notifications.show({
            title: 'AI Agent Dispatched',
            message: 'Running deep search & intelligence gathering...',
            color: 'blue',
            loading: true
        });

        const res = await runDeepResearch(id);
        if (res.success) {
            notifications.show({ title: 'Intelligence Ready', message: 'Deep research report generated.', color: 'green' });
            loadSavedPartners();
            // Update selected partner if modal is open
            if (selectedPartner && selectedPartner.id === id) {
                setSelectedPartner(prev => prev ? { ...prev, intelligenceReport: res.report } : null);
                setModalTab('intelligence');
            }
        } else {
            notifications.show({ title: 'Research Failed', message: res.error || 'Connection error.', color: 'red' });
        }
        setResearching(null);
    };

    const handleCopyIntelligence = () => {
        if (selectedPartner?.intelligenceReport) {
            navigator.clipboard.writeText(selectedPartner.intelligenceReport);
            notifications.show({
                title: '복사 완료!',
                message: '심층 분석 보고서가 클립보드에 복사되었습니다. 이제 카톡이나 메일 창에 붙여넣기(Ctrl+V) 하세요.',
                color: 'blue',
                icon: <IconCopy size={16} />
            });
        }
    };

    const handleDismiss = (id: number) => {
        setResults(prev => prev.filter(p => p.id !== id));
    };

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title fw={900} size={32} c="green.9">{t('hunter_title')}</Title>
                        <Text c="dimmed">{t('hunter_subtitle')}</Text>
                    </div>
                    <Button leftSection={<IconArrowLeft size={16} />} variant="subtle" onClick={() => router.push('/admin')}>{t('nav_back_to_admin')}</Button>
                </Group>

                <Tabs value={activeTab} onChange={setActiveTab} color="green" variant="pills">
                    <Tabs.List justify="center" mb="xl">
                        <Tabs.Tab value="search" leftSection={<IconSearch size={16} />}>Search Discovery</Tabs.Tab>
                        <Tabs.Tab value="pipeline" leftSection={<IconCheck size={16} />}>My Pipeline ({savedPartners.length})</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="search">
                        <Stack gap="md">
                            <Card withBorder shadow="sm" p="xl" radius="md">
                                <Stack gap="md">
                                    <Text fw={700}>Quick Target Presets</Text>
                                    <Group gap="xs">
                                        {TARGET_PRESETS.map((preset, idx) => (
                                            <Button
                                                key={idx}
                                                variant="light"
                                                color="green"
                                                size="xs"
                                                onClick={() => handlePresetClick(preset)}
                                                leftSection={preset.icon}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </Group>
                                    <Divider my="sm" />
                                    <Group align="flex-end">
                                        <Select
                                            label="Country"
                                            data={COUNTRIES}
                                            value={country}
                                            onChange={setCountry}
                                            style={{ width: 160 }}
                                        />
                                        <TextInput
                                            label="Search Keyword"
                                            placeholder="e.g. Wasabi Distributor"
                                            style={{ flex: 1 }}
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.currentTarget.value)}
                                        />
                                        <Button
                                            leftSection={<IconSearch size={16} />}
                                            color="green"
                                            loading={loading}
                                            onClick={() => performSearch(keyword, country)}
                                        >
                                            Search
                                        </Button>
                                    </Group>
                                </Stack>
                            </Card>

                            {results.length > 0 && (
                                <Stack gap="xs">
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Found {results.length} new potential partners. {duplicateCount > 0 && `(${duplicateCount} hidden)`}</Text>
                                    </Group>
                                    <Table verticalSpacing="sm" withTableBorder highlightOnHover>
                                        <Table.Thead>
                                            <Table.Th>Category</Table.Th>
                                            <Table.Th>Organization</Table.Th>
                                            <Table.Th>Analysis / Contact</Table.Th>
                                            <Table.Th w={150}>Actions</Table.Th>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {results.map((element) => (
                                                <Table.Tr key={element.id}>
                                                    <Table.Td>
                                                        <Badge variant="dot" size="sm" color="gray">{element.type || 'Other'}</Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Stack gap={0}>
                                                            <Group gap={8}>
                                                                <Text
                                                                    fw={700}
                                                                    style={{ cursor: 'pointer' }}
                                                                    c="blue.7"
                                                                    onClick={() => handlePreview(element)}
                                                                >
                                                                    {element.name}
                                                                </Text>
                                                                {element.aiSummary && <IconCircleCheck size={16} color="green" />}
                                                            </Group>
                                                            <Text size="xs" c="dimmed" lineClamp={1}>{element.url}</Text>
                                                        </Stack>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {element.aiSummary ? (
                                                            <Stack gap={4}>
                                                                <Group gap={4}>
                                                                    <Badge
                                                                        color={element.aiSummary.score >= 8 ? 'blue' : element.aiSummary.score >= 5 ? 'green' : 'orange'}
                                                                        size="xs"
                                                                    >
                                                                        Score: {element.aiSummary.score}
                                                                    </Badge>
                                                                    <Text size="xs" fw={700} c="green.8">{element.aiSummary.angle}</Text>
                                                                </Group>
                                                                <Text size="xs" fs="italic" lineClamp={1}>"{element.aiSummary.analysis}"</Text>
                                                            </Stack>
                                                        ) : (
                                                            <Text size="xs" c="dimmed">Not scanned yet</Text>
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Group gap={4}>
                                                            <Tooltip label="Save to Pipeline">
                                                                <ActionIcon variant="light" color="green" onClick={() => handleSaveToList(element)}><IconPlus size={16} /></ActionIcon>
                                                            </Tooltip>
                                                            <Tooltip label="Scan Site">
                                                                <ActionIcon variant="light" color="blue" onClick={() => handleScan(element)}><IconScan size={16} /></ActionIcon>
                                                            </Tooltip>
                                                            <ActionIcon variant="subtle" color="red" onClick={() => handleDismiss(element.id)}><IconTrash size={16} /></ActionIcon>
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                    <Button variant="subtle" fullWidth onClick={handleLoadMore} loading={loading}>Load More</Button>
                                </Stack>
                            )}
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="pipeline">
                        <Stack gap="md">
                            <Group justify="space-between" align="flex-end">
                                <Stack gap={5}>
                                    <Title order={4}>Pipeline Management</Title>
                                    <SegmentedControl
                                        size="xs"
                                        value={pipelineCountryFilter}
                                        onChange={(val) => {
                                            setPipelineCountryFilter(val);
                                            setPipelinePage(1);
                                        }}
                                        data={[
                                            { label: 'All Regions', value: 'All' },
                                            { label: '🇰🇷 KR', value: 'South Korea' },
                                            { label: '🇯🇵 JP', value: 'Japan' },
                                            { label: '🇺🇸 US', value: 'United States' },
                                            { label: '🌐 Other', value: 'Other' }
                                        ]}
                                    />
                                    <SegmentedControl
                                        size="xs"
                                        value={pipelineCategoryFilter}
                                        onChange={(val) => {
                                            setPipelineCategoryFilter(val);
                                            setPipelinePage(1);
                                        }}
                                        data={[
                                            { label: 'All Categories', value: 'All' },
                                            ...PARTNER_TYPES.map(t => ({ label: t, value: t }))
                                        ]}
                                    />
                                    <Select
                                        size="xs"
                                        placeholder="Specialty (Item)"
                                        value={pipelineSpecialtyFilter}
                                        onChange={(val) => {
                                            setPipelineSpecialtyFilter(val || 'All');
                                            setPipelinePage(1);
                                        }}
                                        data={[
                                            { label: 'All Specialties', value: 'All' },
                                            ...SPECIALTIES.map(s => ({ label: s, value: s }))
                                        ]}
                                        style={{ width: 180 }}
                                    />
                                </Stack>
                                <Group gap="xs">
                                    <Button
                                        leftSection={<IconDownload size={16} />}
                                        variant="outline"
                                        color="blue"
                                        onClick={handleImportClick}
                                    >
                                        Import Excel/CSV
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept=".csv"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        leftSection={<IconPlus size={16} />}
                                        variant="outline"
                                        color="green"
                                        onClick={() => setManualOpened(true)}
                                    >
                                        Add Manual
                                    </Button>
                                    <Button
                                        leftSection={<IconScan size={16} />}
                                        variant="light"
                                        color="grape"
                                        loading={bulkCategorizing}
                                        disabled={selectedIds.length === 0}
                                        onClick={handleBulkCategorize}
                                    >
                                        Bulk AI Categorize ({selectedIds.length})
                                    </Button>
                                    <Group gap="sm">
                                        <Stack gap={0}>
                                            <Text size="xs" fw={700} c="blue.8">
                                                Selected: {selectedIds.length} / {filteredPartners.length}
                                            </Text>
                                            {selectedIds.length > 0 && (
                                                <Button
                                                    variant="subtle"
                                                    size="compact-xs"
                                                    color="red"
                                                    p={0}
                                                    onClick={() => setSelectedIds([])}
                                                    leftSection={<IconX size={12} />}
                                                >
                                                    Clear All
                                                </Button>
                                            )}
                                        </Stack>

                                        <Menu shadow="md" width={200}>
                                            <Menu.Target>
                                                <Button variant="outline" size="sm" color="gray">
                                                    Select Options
                                                </Button>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item onClick={toggleSelectAll}>Toggle All ({filteredPartners.length})</Menu.Item>
                                                <Menu.Item onClick={toggleSelectPage}>Toggle Current Page ({paginatedPartners.length})</Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>

                                        <Button
                                            leftSection={<IconRocket size={16} />}
                                            color="blue"
                                            disabled={selectedIds.length === 0}
                                            loading={bulkSending}
                                            onClick={handleBulkSend}
                                        >
                                            Mass Send AI Proposals ({selectedIds.length})
                                        </Button>

                                        <Menu shadow="md" width={200}>
                                            <Menu.Target>
                                                <Button
                                                    variant="subtle"
                                                    color="gray"
                                                    disabled={selectedIds.length === 0}
                                                    leftSection={<IconCheck size={16} />}
                                                >
                                                    Change Category ({selectedIds.length})
                                                </Button>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Label>대분류 이동:</Menu.Label>
                                                {PARTNER_TYPES.map(type => (
                                                    <Menu.Item
                                                        key={type}
                                                        onClick={() => handleBulkFastMove(type)}
                                                    >
                                                        {type}
                                                    </Menu.Item>
                                                ))}
                                                <Divider />
                                                <Menu.Label>세부 종목(Specialty) 지정:</Menu.Label>
                                                <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                                                    {SPECIALTIES.map(spec => (
                                                        <Menu.Item
                                                            key={spec}
                                                            onClick={async () => {
                                                                if (selectedIds.length === 0) return;
                                                                const res = await updateHunterInfoBulk(selectedIds, { category: spec });
                                                                if (res.success) {
                                                                    notifications.show({ title: '종목 지정 완료', message: `${res.updated}개의 업체를 [${spec}]으로 지정했습니다.`, color: 'teal' });
                                                                    setSelectedIds([]);
                                                                    loadSavedPartners();
                                                                }
                                                            }}
                                                        >
                                                            {spec}
                                                        </Menu.Item>
                                                    ))}
                                                </div>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Group>
                                </Group>
                            </Group>

                            <Table striped highlightOnHover withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th><Checkbox size="xs" onChange={toggleSelectAll} /></Table.Th>
                                        <Table.Th>Category</Table.Th>
                                        <Table.Th>Organization</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Region</Table.Th>
                                        <Table.Th>Contact</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {paginatedPartners.map((element) => (
                                        <Table.Tr key={element.id}>
                                            <Table.Td>
                                                <Checkbox checked={selectedIds.includes(element.id)} onChange={() => toggleSelect(element.id)} size="xs" />
                                            </Table.Td>
                                            <Table.Td>
                                                <Stack gap={4}>
                                                    <Badge variant="dot" size="sm" color="gray">{element.type || 'Other'}</Badge>
                                                    {element.category && <Badge variant="light" size="xs" color="teal">{element.category}</Badge>}
                                                </Stack>
                                            </Table.Td>
                                            <Table.Td>
                                                <Stack gap={0}>
                                                    <Group gap={4}>
                                                        <Text
                                                            fw={700}
                                                            size="sm"
                                                            style={{ cursor: 'pointer' }}
                                                            c="blue.7"
                                                            onClick={() => handlePreview(element)}
                                                        >
                                                            {element.name}
                                                        </Text>
                                                        {element.aiSummary && (
                                                            <Badge size="xs" color={element.aiSummary.score >= 8 ? 'blue' : element.aiSummary.score >= 5 ? 'green' : 'orange'}>
                                                                {element.aiSummary.score}/10
                                                            </Badge>
                                                        )}
                                                    </Group>
                                                    {element.aiSummary && <Text size="xs" c="grape" fw={600}>{element.aiSummary.angle}</Text>}
                                                </Stack>
                                            </Table.Td>
                                            <Table.Td>
                                                <Menu shadow="md" width={150}>
                                                    <Menu.Target>
                                                        <Badge color={APP_STATUS[element.status || 'New']} variant="light" style={{ cursor: 'pointer' }}>
                                                            {element.status || 'New'}
                                                        </Badge>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        {Object.keys(APP_STATUS).map(s => (
                                                            <Menu.Item key={s} onClick={() => handleChangeStatus(element.id, s)}>{s}</Menu.Item>
                                                        ))}
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                            <Table.Td>
                                                <Menu shadow="md" width={150}>
                                                    <Menu.Target>
                                                        <Badge variant="outline" color="gray" style={{ cursor: 'pointer' }}>{element.country || 'Global'}</Badge>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        {['Japan', 'South Korea', 'United States', 'China', 'Global'].map(c => (
                                                            <Menu.Item key={c} onClick={() => handleChangeCountry(element.id, c)}>{c}</Menu.Item>
                                                        ))}
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                            <Table.Td>
                                                <Stack gap={0}>
                                                    {element.email && <Text size="xs" fw={700} c="blue">{element.email}</Text>}
                                                    <Text size="xs" c="dimmed">{element.phone || element.contact || '-'}</Text>
                                                </Stack>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap={4}>
                                                    <Tooltip label="Edit Info">
                                                        <ActionIcon size="sm" variant="light" color="blue" onClick={() => handleEdit(element)}><IconEdit size={14} /></ActionIcon>
                                                    </Tooltip>
                                                    <Button size="compact-xs" variant="light" color="green" onClick={() => handlePreview(element)}>Proposal</Button>
                                                    <Tooltip label="Scan Website">
                                                        <ActionIcon size="sm" variant="light" color="grape" onClick={() => handleScan(element)}><IconScan size={14} /></ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Visit Website">
                                                        <ActionIcon size="sm" variant="default" component="a" href={element.url} target="_blank"><IconWorld size={14} /></ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Delete">
                                                        <ActionIcon size="sm" variant="subtle" color="red" onClick={() => handleDelete(element.id)}><IconTrash size={14} /></ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>

                            {filteredPartners.length > PIPELINE_PAGE_SIZE && (
                                <Group justify="center" mt="md">
                                    <Pagination
                                        total={Math.ceil(filteredPartners.length / PIPELINE_PAGE_SIZE)}
                                        value={pipelinePage}
                                        onChange={setPipelinePage}
                                        size="sm"
                                    />
                                </Group>
                            )}
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Stack>

            <Modal opened={opened} onClose={() => setOpened(false)} title="Partner Intelligence & Strategy" size="lg">
                {selectedPartner && (
                    <Stack gap="md">
                        <Card withBorder radius="md" p="md">
                            <Group justify="space-between" mb="xs">
                                <Title order={4}>{selectedPartner.name}</Title>
                                <Badge color={APP_STATUS[selectedPartner.status || 'New']}>{selectedPartner.status || 'New'}</Badge>
                            </Group>
                            <Group gap="xs">
                                <Badge variant="outline" color="gray">{selectedPartner.country || 'Global'}</Badge>
                                <Text size="sm" c="dimmed">{selectedPartner.url}</Text>
                            </Group>
                        </Card>

                        <Tabs value={modalTab} onChange={setModalTab} color="blue" variant="outline">
                            <Tabs.List mb="md">
                                <Tabs.Tab value="strategy" leftSection={<IconRobot size={14} />}>Strategy & Draft</Tabs.Tab>
                                <Tabs.Tab value="intelligence" color="blue" leftSection={<IconSearch size={14} />}>
                                    Deep Intelligence {selectedPartner.intelligenceReport && <Badge size="xs" ml={5} variant="filled">New</Badge>}
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="strategy">
                                <Stack gap="md">
                                    {selectedPartner.aiSummary && (
                                        <Card withBorder bg="blue.0" p="md">
                                            <Group justify="space-between" mb="xs">
                                                <Text fw={700} size="sm">AI Analysis Result</Text>
                                                <Badge size="lg" color={selectedPartner.aiSummary.score >= 8 ? 'blue' : selectedPartner.aiSummary.score >= 5 ? 'green' : 'orange'}>
                                                    Score: {selectedPartner.aiSummary.score}/10
                                                </Badge>
                                            </Group>
                                            <Text fw={700} size="sm" mb={4}>Best Sales Angle:</Text>
                                            <Text size="md" c="blue.9" fw={800}>{selectedPartner.aiSummary.angle}</Text>
                                            <Divider my="sm" />
                                            <Text fw={700} size="sm" mb={4}>Fitness Analysis:</Text>
                                            <Text size="sm" fs="italic">"{selectedPartner.aiSummary.analysis}"</Text>
                                        </Card>
                                    )}

                                    {(selectedPartner.address || selectedPartner.sns) && (
                                        <Card withBorder p="sm" radius="md">
                                            <Stack gap="xs">
                                                <Text fw={700} size="xs" c="dimmed">BUSINESS DETAILS</Text>
                                                {selectedPartner.address && (
                                                    <Group gap="xs">
                                                        <Badge variant="dot" color="gray">Address</Badge>
                                                        <Text size="sm">{selectedPartner.address}</Text>
                                                    </Group>
                                                )}
                                                {selectedPartner.sns && (
                                                    <Group gap="sm">
                                                        {selectedPartner.sns.instagram && (
                                                            <ActionIcon variant="subtle" color="pink" component="a" href={selectedPartner.sns.instagram} target="_blank">
                                                                <IconWorld size={18} />
                                                            </ActionIcon>
                                                        )}
                                                        {selectedPartner.sns.facebook && (
                                                            <ActionIcon variant="subtle" color="blue" component="a" href={selectedPartner.sns.facebook} target="_blank">
                                                                <IconWorld size={18} />
                                                            </ActionIcon>
                                                        )}
                                                        {selectedPartner.sns.youtube && (
                                                            <ActionIcon variant="subtle" color="red" component="a" href={selectedPartner.sns.youtube} target="_blank">
                                                                <IconWorld size={18} />
                                                            </ActionIcon>
                                                        )}
                                                    </Group>
                                                )}
                                            </Stack>
                                        </Card>
                                    )}

                                    {selectedPartner.catalogs && selectedPartner.catalogs.length > 0 && (
                                        <Card withBorder p="sm" radius="md">
                                            <Stack gap="xs">
                                                <Text fw={700} size="xs" c="dimmed">CATALOGS & BROCHURES</Text>
                                                <SimpleGrid cols={2} spacing="xs">
                                                    {selectedPartner.catalogs.map((url, idx) => (
                                                        <Button
                                                            key={idx}
                                                            variant="light"
                                                            color="gray"
                                                            size="xs"
                                                            component="a"
                                                            href={url}
                                                            target="_blank"
                                                            leftSection={url.endsWith('.pdf') ? <IconPdf size={14} /> : <IconFileDescription size={14} />}
                                                        >
                                                            Catalog #{idx + 1}
                                                        </Button>
                                                    ))}
                                                </SimpleGrid>
                                            </Stack>
                                        </Card>
                                    )}

                                    {emailMode && draftEmail ? (
                                        <Stack gap="sm">
                                            <Divider my="xs" label="AI Generated Proposal Draft" labelPosition="center" />
                                            <Card withBorder p="md" bg="green.0">
                                                <Stack gap="xs">
                                                    <Group justify="space-between">
                                                        <Text fw={700} size="sm">Subject: {draftEmail.subject}</Text>
                                                        <ActionIcon variant="subtle" color="green" onClick={() => {
                                                            navigator.clipboard.writeText(`Subject: ${draftEmail.subject}\n\n${draftEmail.body}`);
                                                            notifications.show({ title: 'Copied!', message: 'Email draft copied to clipboard.', color: 'green' });
                                                        }}>
                                                            <IconCopy size={16} />
                                                        </ActionIcon>
                                                    </Group>
                                                    <Divider />
                                                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{draftEmail.body}</Text>
                                                </Stack>
                                            </Card>
                                            <Button leftSection={<IconCheck size={16} />} color="green" onClick={() => { handleChangeStatus(selectedPartner.id, 'Drafted'); setOpened(false); }}>
                                                Confirm & Mark as Drafted
                                            </Button>
                                            <Button variant="subtle" color="gray" onClick={() => setEmailMode(false)}>Back</Button>
                                        </Stack>
                                    ) : (
                                        <Group grow mt="sm">
                                            <Button
                                                leftSection={<IconSearch size={16} />}
                                                variant="light"
                                                color="blue"
                                                loading={researching === selectedPartner.id}
                                                onClick={() => handleDeepResearch(selectedPartner.id)}
                                            >
                                                Run Deep Research
                                            </Button>
                                            <Button
                                                leftSection={<IconMail size={16} />}
                                                color="green"
                                                loading={loading}
                                                onClick={handleDraftEmail}
                                            >
                                                Generate Email
                                            </Button>
                                        </Group>
                                    )}
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="intelligence">
                                {selectedPartner.intelligenceReport ? (
                                    <Stack gap="sm" mt="sm">
                                        <Group justify="flex-end">
                                            <Button
                                                size="compact-xs"
                                                variant="light"
                                                leftSection={<IconCopy size={14} />}
                                                onClick={handleCopyIntelligence}
                                            >
                                                리포트 전체 복사 (카톡용)
                                            </Button>
                                        </Group>
                                        <Card withBorder p="md" bg="blue.0" radius="md">
                                            <div className="prose prose-sm max-w-none" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                                                <ReactMarkdown>{selectedPartner.intelligenceReport}</ReactMarkdown>
                                            </div>
                                        </Card>
                                    </Stack>
                                ) : (
                                    <Card withBorder p="xl" bg="gray.0" radius="md" mt="sm">
                                        <Center style={{ flexDirection: 'column', height: 200 }}>
                                            <IconSearch size={40} color="gray" style={{ opacity: 0.5 }} />
                                            <Text c="dimmed" mt="sm" fw={700}>Deep Research Not Performed</Text>
                                            <Text c="dimmed" size="xs">Go to "Strategy & Draft" tab and click "Run Deep Research".</Text>
                                        </Center>
                                    </Card>
                                )}
                            </Tabs.Panel>
                        </Tabs>
                    </Stack>
                )}
            </Modal>

            <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Partner Info">
                <Stack>
                    <TextInput label="Name" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.currentTarget.value })} />
                    <Select
                        label="Category (Main)"
                        data={PARTNER_TYPES}
                        value={editForm.type}
                        onChange={(val) => setEditForm({ ...editForm, type: val || 'Other' })}
                    />
                    <Select
                        label="Specialty (Sub-category)"
                        data={SPECIALTIES}
                        value={editForm.category}
                        onChange={(val) => setEditForm({ ...editForm, category: val || '기타' })}
                    />
                    <TextInput label="Email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.currentTarget.value })} />
                    <TextInput label="Phone" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.currentTarget.value })} />

                    <Divider label="Catalogs" labelPosition="center" />
                    <Stack gap="xs">
                        {editForm.catalogs?.map((url, idx) => (
                            <Group key={idx} justify="space-between">
                                <Text size="xs" truncate style={{ flex: 1 }}>{url.split('/').pop()}</Text>
                                <ActionIcon color="red" variant="subtle" size="sm" onClick={() => {
                                    const next = editForm.catalogs?.filter((_, i) => i !== idx);
                                    setEditForm({ ...editForm, catalogs: next });
                                }}><IconTrash size={14} /></ActionIcon>
                            </Group>
                        ))}
                        <FileButton onChange={(file) => handleUploadCatalog(file, true)} accept="application/pdf,image/*">
                            {(props) => <Button {...props} variant="light" size="sm" leftSection={<IconPlus size={16} />}>Add Catalog File</Button>}
                        </FileButton>
                    </Stack>

                    <Button onClick={handleSaveEdit} color="green">Save Changes</Button>
                </Stack>
            </Modal>

            <Modal opened={manualOpened} onClose={() => setManualOpened(false)} title="Add Manual Partner" size="md">
                <Stack>
                    <TextInput
                        label="Organization Name"
                        required
                        placeholder="e.g. K-Farm Global"
                        value={manualForm.name}
                        onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    />
                    <TextInput
                        label="Website URL"
                        placeholder="https://..."
                        value={manualForm.url}
                        onChange={(e) => setManualForm({ ...manualForm, url: e.target.value })}
                    />
                    <Select
                        label="Country"
                        data={['South Korea', 'Japan', 'United States', 'China', 'Global']}
                        value={manualForm.country}
                        onChange={(val) => setManualForm({ ...manualForm, country: val || 'Global' })}
                    />
                    <Select
                        label="Category (Main)"
                        data={PARTNER_TYPES}
                        value={manualForm.type}
                        onChange={(val) => setManualForm({ ...manualForm, type: val || 'Other' })}
                    />
                    <Select
                        label="Specialty (Sub-category)"
                        data={SPECIALTIES}
                        value={manualForm.category}
                        onChange={(val) => setManualForm({ ...manualForm, category: val || '기타' })}
                    />
                    <TextInput
                        label="Email"
                        placeholder="contact@company.com"
                        value={manualForm.email}
                        onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    />
                    <TextInput
                        label="Phone"
                        placeholder="+82-..."
                        value={manualForm.phone}
                        onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    />

                    <Divider label="Catalogs" labelPosition="center" />
                    <Stack gap="xs">
                        {manualForm.catalogs?.map((url, idx) => (
                            <Group key={idx} justify="space-between">
                                <Text size="xs" truncate style={{ flex: 1 }}>{url.split('/').pop()}</Text>
                                <ActionIcon color="red" variant="subtle" size="sm" onClick={() => {
                                    const next = manualForm.catalogs?.filter((_, i) => i !== idx);
                                    setManualForm({ ...manualForm, catalogs: next });
                                }}><IconTrash size={14} /></ActionIcon>
                            </Group>
                        ))}
                        <FileButton onChange={(file) => handleUploadCatalog(file, false)} accept="application/pdf,image/*">
                            {(props) => <Button {...props} variant="light" size="sm" leftSection={<IconPlus size={16} />}>Upload Catalog</Button>}
                        </FileButton>
                    </Stack>

                    <Button mt="md" fullWidth color="green" onClick={handleManualSave}>Add to Pipeline</Button>
                </Stack>
            </Modal>
        </Container >
    );
}
