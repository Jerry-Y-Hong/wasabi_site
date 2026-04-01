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
    SimpleGrid,
    Box,
    ThemeIcon
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
    IconRefresh,
    IconPdf,
    IconChartBar,
    IconTarget,
    IconUsers,
    IconBuildingStore,
    IconGlassFull,
    IconTruckDelivery,
    IconChefHat,
    IconFish,
    IconPackage,
    IconCertificate,
    IconBuildingFactory,
    IconTable,
    IconAnalyze,
    IconLayoutDashboard
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
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
import { HunterResult } from './types';
import HunterStats from './components/HunterStats';
import HunterAnalytics from './components/HunterAnalytics';
import PartnerIntelligenceModal from './components/PartnerIntelligenceModal';
import HunterControls from './components/HunterControls';
import HunterSearchResultTable from './components/HunterSearchResultTable';
import PipelineFilters from './components/PipelineFilters';
import HunterPipelineTable from './components/HunterPipelineTable';

// Helper for Urgency Color
const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
        case 'high': return 'red';
        case 'medium': return 'yellow';
        case 'low': return 'gray';
        default: return 'gray';
    }
};

export default function HunterAdmin() {
    const { t, language } = useTranslation();

    // Helper for Urgency Color (Moved inside to access t, or keep outside. We can keep getUrgencyColor outside since it doesn't use t)

    const COUNTRIES = useMemo(() => [
        { label: t('country_all'), value: '' },
        { label: t('country_kr'), value: 'KR' },
        { label: t('country_jp'), value: 'JP' },
        { label: t('country_us'), value: 'US' },
        { label: t('country_cn'), value: 'CN' },
        { label: t('country_de') || 'Germany 🇩🇪', value: 'DE' },
        { label: t('country_fr') || 'France 🇫🇷', value: 'FR' },
        { label: t('country_ae') || 'UAE 🇦🇪', value: 'AE' },
        { label: t('country_th') || 'Thailand 🇹🇭', value: 'TH' },
        { label: t('country_vn') || 'Vietnam 🇻🇳', value: 'VN' }
    ], [t]);

    const COUNTRY_DISPLAY: Record<string, string> = useMemo(() => ({
        '': t('country_all').split(' ')[0],
        'JP': t('country_jp').split(' ')[0],
        'US': t('country_us').split(' ')[0],
        'KR': t('country_kr').split(' ')[0],
        'CN': t('country_cn').split(' ')[0],
        'DE': t('country_de').split(' ')[0] || 'Germany',
        'FR': t('country_fr').split(' ')[0] || 'France',
        'AE': t('country_ae').split(' ')[0] || 'UAE',
        'TH': t('country_th').split(' ')[0] || 'Thailand',
        'VN': t('country_vn').split(' ')[0] || 'Vietnam',
    }), [t]);

    const APP_STATUS: Record<string, string> = useMemo(() => ({
        'New': 'gray',
        'AI Analyzed': 'cyan',
        'Proposal Sent': 'blue',
        'Proceeding': 'green',
        'Contracted': 'grape',
        'Dropped': 'red'
    }), []);

    const PARTNER_TYPES = useMemo(() => [
        t('type_wholesale') || '영업: 도매/B2B (식자재 유통)',
        t('type_retail') || '영업: 소매/온라인 (스마트스토어)',
        t('type_procurement') || '조달: 원자재/기자재',
        t('type_rnd') || '파트너: R&D/기술 제휴',
        t('type_investor') || '투자자 (Investor)',
        t('type_lead') || '단순 리드 (Lead)',
        t('type_other') || '기타'
    ], [t]);

    const SPECIALTIES = useMemo(() => [
        t('spec_arch') || '건축 및 설계',
        t('spec_arch'),
        t('spec_system'),
        t('spec_substrate'),
        t('spec_hvac'),
        t('spec_airflow'),
        t('spec_nutrient'),
        t('spec_irrigation'),
        t('spec_lighting'),
        t('spec_software'),
        t('spec_iot'),
        t('spec_robot'),
        t('type_other')
    ], [t]);

    const TARGET_PRESETS = useMemo(() => [
        {
            label: t('target_global_bigfish'),
            icon: '🐋',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Importer) "Distribution Agreement" -amazon -ebay',
                'Global': '"Wasabi" (B2B OR Distributor) (contact OR "wholesale inquiry") -amazon -ebay -blog'
            }
        },
        {
            label: t('target_us_west'),
            icon: '🏖️',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Distributor) ("California" OR "Washington" OR "Oregon") -amazon -ebay',
                'Global': '"Wasabi" Distributor West Coast USA'
            }
        },
        {
            label: t('target_us_east'),
            icon: '🗽',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Distributor) ("New York" OR "Florida" OR "Massachusetts") -amazon -ebay',
                'Global': '"Wasabi" Distributor East Coast USA'
            }
        },
        {
            label: t('target_us_central'),
            icon: '🤠',
            keywords: {
                'US': '"Wasabi" (Wholesale OR Distributor) ("Texas" OR "Illinois" OR "Georgia") -amazon -ebay',
                'Global': '"Wasabi" Distributor Central USA'
            }
        },
        {
            label: t('target_jp_bigfish'),
            icon: '🎌',
            keywords: {
                'JP': '("わさび" OR "生わさび") ("静岡" OR "富士") ("卸売" OR "仕入れ" OR "業者") "会社概要" -site:amazon.co.jp -site:rakuten.co.jp',
                'Global': '"Wasabi" (Wholesale OR Distributor Shizuoka) "Corporate Office" -amazon -ebay'
            }
        },
        {
            label: t('target_jp_foodservice'),
            icon: '🏢',
            keywords: {
                'JP': '("業務用" OR "大口注文") ("生わさび" OR "本わさび") "仕入れ" "業者向け" -review -youtube',
                'Global': 'Commercial Wasabi Bulk Supply Contact Japan'
            }
        },
        {
            label: t('target_jp_tradelists'),
            icon: '📄',
            keywords: {
                'JP': '(filetype:pdf OR filetype:xlsx) ("わさび" OR "生わさび") ("業者名簿" OR "取扱業者一覧") -recipe',
                'Global': 'filetype:pdf "Wasabi" "Exhibitor List" OR "Supplier Directory"'
            }
        },
        {
            label: t('target_jp_agritech'),
            icon: '🧪',
            keywords: {
                'JP': '("植物工場" OR "噴霧耕") ("わさび" OR "ワサビ") "共同研究" OR "技術協力" "法人窓口" -blog',
                'Global': 'Japan Smart Farm Wasabi R&D Corporate Partnership'
            }
        },
        {
            label: t('target_us_agtech'),
            icon: '🚜',
            keywords: {
                'US': '("Smart Farm" OR "Agri-tech") (Distributor OR Wholesaler) (Equipment OR Sensors OR Automation) -amazon -ebay',
                'Global': '"Smart Agriculture" Equipment Distributor USA "Wholesale Inquiry"'
            }
        },
        {
            label: t('target_jp_iot'),
            icon: '📡',
            keywords: {
                'JP': '("スマート農業" OR "植物工場") ("시스템" OR "센서" OR "설비") ("卸売" OR "代理점" OR "導入") -site:amazon.co.jp',
                'Global': 'Japan Smart Farming IoT Solutions Wholesaler OR System Integrator'
            }
        },
        {
            label: t('target_kr_farms'),
            icon: '🌿',
            keywords: {
                'KR': '("와사비" OR "고추냉이") ("농장" OR "재배" OR "농가") ("비닐하우스" OR "스마트팜") "위치" -recipe',
                'Global': 'Wasabi Farms South Korea Greenhouse Growers'
            }
        }
    ], [t]);

    // Search State
    const [keyword, setKeyword] = useState('');
    const [country, setCountry] = useState<string | null>('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<HunterResult[]>([]);
    const [page, setPage] = useState(1);
    const [autoScan, setAutoScan] = useState(false);

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
    const stopScanRef = useRef(false);
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
        stopScanRef.current = false;
        let successCount = 0;

        notifications.show({ title: 'Bulk Scan Started', message: 'Scanning selected partners...', color: 'blue', loading: true });

        for (let i = 0; i < selectedIds.length; i++) {
            if (stopScanRef.current) {
                notifications.show({ title: 'Scan Stopped', message: 'Bulk scan operation cancelled.', color: 'orange' });
                break;
            }

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
                    country: result.detectedCountry || partner.country,
                    status: result.aiSummary ? 'AI Analyzed' : 'New'
                });
                successCount++;
            }
            // Small delay to prevent overwhelming
            await new Promise(r => setTimeout(r, 500));
        }

        if (!stopScanRef.current) {
            notifications.show({
                title: 'Bulk Classification Complete!',
                message: `Successfully categorized ${successCount} partners.`,
                color: 'green'
            });
        }
        setBulkCategorizing(false);
        setSelectedIds([]);
        loadSavedPartners();
    };

    const handleStopScan = () => {
        stopScanRef.current = true;
    };

    const handleSearch = async (term: string, countryCode: string | null) => {
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

            if (data.length > 0 && filteredData.length === 0) {
                notifications.show({ title: 'Notice', message: 'All found items are already in your pipeline.', color: 'orange' });
            }

            // --- AUTO SCAN LOGIC ---
            if (autoScan && filteredData.length > 0) {
                const candidates = filteredData.slice(0, 5); // Limit to top 5 for speed
                notifications.show({
                    title: 'Auto-Scan Started',
                    message: `Deep analyzing top ${candidates.length} results...`,
                    color: 'blue',
                    loading: true
                });

                // Run scans in parallel (limited batch)
                await Promise.all(candidates.map(async (candidate: HunterResult) => {
                    const scanRes = await scanWebsite(candidate.url, candidate.name);
                    if (scanRes.success) {
                        // Classify similar to handleScan
                        let autoType = candidate.type;
                        const analysisText = (scanRes.aiSummary?.analysis || '').toLowerCase();
                        const angleText = (scanRes.aiSummary?.angle || '').toLowerCase();
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

                        const updates = {
                            email: scanRes.emails?.[0] || candidate.email,
                            phone: scanRes.phones?.[0] || candidate.phone,
                            sns: scanRes.sns || candidate.sns,
                            address: scanRes.address || candidate.address,
                            aiSummary: scanRes.aiSummary,
                            type: autoType,
                            status: scanRes.aiSummary ? 'AI Analyzed' : 'New'
                        };

                        setResults(prev => prev.map(p => p.id === candidate.id ? { ...p, ...updates } : p));
                    }
                }));

                notifications.show({ title: 'Auto-Scan Complete', message: 'Intelligence gathered.', color: 'green' });
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
                country: result.detectedCountry || partner.country,
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

    const handleScanAllVisible = async () => {
        // Filter unscanned ones or just take top 5
        const candidates = results.slice(0, 5);
        if (candidates.length === 0) return;

        notifications.show({
            title: 'Bulk Scan Started',
            message: `Analyzing top ${candidates.length} companies...`,
            color: 'blue',
            loading: true
        });

        await Promise.all(candidates.map(async (candidate) => {
            // Skip if already has info (optional, but good for speed)
            // if (candidate.aiSummary) return;

            const scanRes = await scanWebsite(candidate.url, candidate.name);
            if (scanRes.success) {
                let autoType = candidate.type;
                const analysisText = (scanRes.aiSummary?.analysis || '').toLowerCase();
                const angleText = (scanRes.aiSummary?.angle || '').toLowerCase();
                const combined = (analysisText + ' ' + angleText).toLowerCase();

                if (combined.includes('equipment') || combined.includes('machinery') || combined.includes('system')) {
                    autoType = 'Vendor: Procurement';
                } else if (combined.includes('wholesale') || combined.includes('distributor') || combined.includes('supplier')) {
                    autoType = 'Sales: Wholesale/B2B';
                } else if (combined.includes('research') || combined.includes('university')) {
                    autoType = 'Partner: R&D/Tech';
                }

                const updates = {
                    email: scanRes.emails?.[0] || candidate.email,
                    phone: scanRes.phones?.[0] || candidate.phone,
                    sns: scanRes.sns || candidate.sns,
                    address: scanRes.address || candidate.address,
                    aiSummary: scanRes.aiSummary,
                    type: autoType || candidate.type,
                    country: scanRes.detectedCountry || candidate.country,
                    status: scanRes.aiSummary ? 'AI Analyzed' : 'New'
                };

                setResults(prev => prev.map(p => p.id === candidate.id ? { ...p, ...updates } : p));
            }
        }));

        notifications.show({ title: 'Bulk Scan Complete', message: 'Top results updated.', color: 'green' });
    };

    const handleSaveAllVisible = async () => {
        if (results.length === 0) return;

        let count = 0;
        await Promise.all(results.map(async (partner) => {
            // Check if already saved first to avoid unnecessary backend calls if possible,
            // efficiently handled by handleSaveToList logic usually, but here we iterate
            if (!savedPartners.some(p => p.id === partner.id)) {
                const res = await saveHunterResult(partner);
                if (res.success) count++;
            }
        }));

        if (count > 0) {
            notifications.show({ title: 'Bulk Save Success', message: `Added ${count} partners to pipeline.`, color: 'green' });
            loadSavedPartners();
            // Optional: Remove from search results after saving?
            // setResults([]); 
        } else {
            notifications.show({ title: 'Notice', message: 'All items were already in your pipeline.', color: 'orange' });
        }
    };

    const handleAutoRefreshCountries = async () => {
        notifications.show({ title: 'Refreshing Countries', message: 'Updating country codes from URLs...', color: 'blue', loading: true });

        let updateCount = 0;
        await Promise.all(savedPartners.map(async (p) => {
            if (!p.url) return;
            let newCountry = p.country;
            try {
                const hostname = new URL(p.url).hostname;
                if (hostname.endsWith('.kr')) newCountry = 'South Korea';
                else if (hostname.endsWith('.jp')) newCountry = 'Japan';
                else if (hostname.endsWith('.cn')) newCountry = 'China';
                else if (hostname.endsWith('.vn')) newCountry = 'Vietnam';
                else if (hostname.endsWith('.th')) newCountry = 'Thailand';
                else if (hostname.endsWith('.de')) newCountry = 'Germany';
                else if (hostname.endsWith('.fr')) newCountry = 'France';
                else if (hostname.endsWith('.uk') || hostname.endsWith('.co.uk')) newCountry = 'United Kingdom';
                else if (hostname.endsWith('.us') || hostname.endsWith('.edu') || hostname.endsWith('.gov')) newCountry = 'United States';
            } catch (e) { }

            if (newCountry !== p.country) {
                await updateHunterInfo(p.id, { country: newCountry });
                updateCount++;
            }
        }));

        loadSavedPartners();
        notifications.show({ title: 'Refresh Complete', message: `Updated countries for ${updateCount} partners.`, color: 'green' });
    };



    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title fw={900} size={32} c="wasabi.7">{t('hunter_title')}</Title>
                        <Text c="dimmed" size="lg">{t('hunter_subtitle')}</Text>
                    </div>
                    <Badge color="blue" variant="light" size="lg" p="md">
                        <Group gap={5}>
                            <IconRobot size={16} />
                            <Text fw={700}>Hunter AI Agent Active</Text>
                        </Group>
                    </Badge>
                </Group>

                <HunterStats 
                    total={savedPartners.length} 
                    verified={savedPartners.filter(p => (p.aiSummary?.score || 0) >= 7).length}
                    pending={savedPartners.filter(p => p.status === 'New').length}
                    scanned={savedPartners.filter(p => p.status === 'AI Analyzed').length}
                />

                <Tabs value={activeTab} onChange={setActiveTab} color="wasabi" variant="pills">
                    <Tabs.List justify="center" mb="xl">
                        <Tabs.Tab value="search" leftSection={<IconSearch size={16} />}>신규 발굴 (Search Discovery)</Tabs.Tab>
                        <Tabs.Tab value="pipeline" leftSection={<IconCheck size={16} />}>내 파이프라인 ({savedPartners.length})</Tabs.Tab>
                        <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>대시보드 분석 (Analytics)</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="analytics">
                        <HunterAnalytics savedPartners={savedPartners} />
                    </Tabs.Panel>
                    <Tabs.Panel value="search">
                        <Stack gap="xl">
                            <HunterControls 
                                TARGET_PRESETS={TARGET_PRESETS}
                                COUNTRIES={COUNTRIES}
                                country={country}
                                setCountry={setCountry}
                                keyword={keyword}
                                setKeyword={setKeyword}
                                loading={loading}
                                onSearch={handleSearch}
                                onPresetClick={(preset) => {
                                    const code = country || 'Global';
                                    const kw = preset.keywords[code] || preset.keywords['Global'] || preset.label;
                                    setKeyword(kw);
                                    handleSearch(kw, country);
                                }}
                                autoScan={autoScan}
                                setAutoScan={setAutoScan}
                            />

                            {results.length > 0 && (
                                <HunterSearchResultTable 
                                    results={results}
                                    duplicateCount={duplicateCount}
                                    loading={loading}
                                    onPreview={handlePreview}
                                    onSaveToList={handleSaveToList}
                                    onScan={handleScan}
                                    onDismiss={handleDismiss}
                                    onLoadMore={handleLoadMore}
                                    onScanAllVisible={handleScanAllVisible}
                                    onSaveAllVisible={handleSaveAllVisible}
                                    getUrgencyColor={getUrgencyColor}
                                />
                            )}
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="pipeline">
                        <Stack gap="md">
                            <PipelineFilters 
                                pipelineCountryFilter={pipelineCountryFilter}
                                setPipelineCountryFilter={(val) => {
                                    setPipelineCountryFilter(val);
                                    setPipelinePage(1);
                                }}
                                pipelineCategoryFilter={pipelineCategoryFilter}
                                setPipelineCategoryFilter={(val) => {
                                    setPipelineCategoryFilter(val);
                                    setPipelinePage(1);
                                }}
                                pipelineSpecialtyFilter={pipelineSpecialtyFilter}
                                setPipelineSpecialtyFilter={(val) => {
                                    setPipelineSpecialtyFilter(val);
                                    setPipelinePage(1);
                                }}
                                PARTNER_TYPES={PARTNER_TYPES}
                                SPECIALTIES={SPECIALTIES}
                                onImportClick={handleImportClick}
                                onAddManual={() => setManualOpened(true)}
                                onFixCountries={handleAutoRefreshCountries}
                                bulkCategorizing={bulkCategorizing}
                                onStopScan={handleStopScan}
                                onBulkCategorize={handleBulkCategorize}
                                selectedCount={selectedIds.length}
                                totalFilteredCount={filteredPartners.length}
                                onClearSelection={() => setSelectedIds([])}
                                onSelectAll={toggleSelectAll}
                                onSelectPage={toggleSelectPage}
                                onBulkSend={handleBulkSend}
                                bulkSending={bulkSending}
                                onBulkMove={handleBulkFastMove}
                                onBulkSpecialty={async (spec) => {
                                    if (selectedIds.length === 0) return;
                                    const res = await updateHunterInfoBulk(selectedIds, { category: spec });
                                    if (res.success) {
                                        notifications.show({ title: '종목 지정 완료', message: `${res.updated}개의 업체를 [${spec}]으로 지정했습니다.`, color: 'teal' });
                                        setSelectedIds([]);
                                        loadSavedPartners();
                                    }
                                }}
                            />

                            <HunterPipelineTable 
                                partners={paginatedPartners}
                                selectedIds={selectedIds}
                                onToggleSelect={toggleSelect}
                                onToggleSelectAll={toggleSelectAll}
                                onPreview={handlePreview}
                                onChangeStatus={handleChangeStatus}
                                onChangeCountry={handleChangeCountry}
                                onEdit={handleEdit}
                                onScan={handleScan}
                                onDelete={handleDelete}
                                APP_STATUS={APP_STATUS}
                                currentPage={pipelinePage}
                                totalPages={Math.ceil(filteredPartners.length / PIPELINE_PAGE_SIZE)}
                                onPageChange={setPipelinePage}
                            />
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Stack>

            <PartnerIntelligenceModal 
                opened={opened}
                onClose={() => setOpened(false)}
                selectedPartner={selectedPartner}
                modalTab={modalTab}
                setModalTab={setModalTab}
                emailMode={emailMode}
                setEmailMode={setEmailMode}
                draftEmail={draftEmail}
                researching={researching}
                loading={loading}
                onDeepResearch={handleDeepResearch}
                onDraftEmail={handleDraftEmail}
                onCopyIntelligence={handleCopyIntelligence}
                onConfirmDraft={(id) => { handleChangeStatus(id, 'Drafted'); setOpened(false); }}
                getUrgencyColor={getUrgencyColor}
                APP_STATUS={APP_STATUS}
            />

            {/* Edit Partner Modal */}
            <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="상세 정보 수정 (Edit Partner Info)" size="lg" radius="md">
                <Stack gap="md">
                    <SimpleGrid cols={2}>
                        <TextInput label="Partner Name" placeholder="회사명" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                        <TextInput label="Website URL" placeholder="https://..." value={editForm.url || ''} onChange={(e) => setEditForm({...editForm, url: e.target.value})} />
                    </SimpleGrid>
                    <SimpleGrid cols={2}>
                        <Select label="Country" data={COUNTRIES.filter(c => c.value !== '').map(c => ({ label: c.label, value: c.label.split(' ')[0] }))} value={editForm.country || 'South Korea'} onChange={(v) => setEditForm({...editForm, country: v || 'South Korea'})} />
                        <Select label="Partner Type" data={PARTNER_TYPES} value={editForm.type || 'Other'} onChange={(v) => setEditForm({...editForm, type: v || 'Other'})} />
                    </SimpleGrid>
                    <SimpleGrid cols={2}>
                        <TextInput label="Contact Person" placeholder="성함/직함" value={editForm.contact || ''} onChange={(e) => setEditForm({...editForm, contact: e.target.value})} />
                        <TextInput label="Email Address" placeholder="hello@company.com" value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                    </SimpleGrid>
                    <TextInput label="Phone Number" placeholder="+1-234-567-890" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                    <Group justify="flex-end">
                        <Button color="gray" variant="light" onClick={() => setEditOpened(false)}>Cancel</Button>
                        <Button color="wasabi" onClick={handleSaveEdit}>Save Changes</Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Manual Add Modal */}
            <Modal opened={manualOpened} onClose={() => setManualOpened(false)} title="수동 업체 등록 (Manual Add Partner)" size="lg" radius="md">
                <Stack gap="md">
                    <SimpleGrid cols={2}>
                        <TextInput label="Partner Name *" required placeholder="회사명" value={manualForm.name || ''} onChange={(e) => setManualForm({...manualForm, name: e.target.value})} />
                        <TextInput label="Website URL" placeholder="https://..." value={manualForm.url || ''} onChange={(e) => setManualForm({...manualForm, url: e.target.value})} />
                    </SimpleGrid>
                    <SimpleGrid cols={2}>
                        <Select label="Country" data={COUNTRIES.filter(c => c.value !== '').map(c => ({ label: c.label, value: c.label.split(' ')[0] }))} value={manualForm.country || 'South Korea'} onChange={(v) => setManualForm({...manualForm, country: v || 'South Korea'})} />
                        <Select label="Initial Mode" data={PARTNER_TYPES} value={manualForm.type} onChange={(v) => setManualForm({...manualForm, type: v || 'Other'})} />
                    </SimpleGrid>
                    <Button color="wasabi" fullWidth mt="md" onClick={handleManualSave}>Register Partner</Button>
                </Stack>
            </Modal>
        </Container>
    );
}

