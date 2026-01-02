'use client';

import { Container, Title, Text, TextInput, Button, Group, Stack, Badge, Card, ActionIcon, Table, Modal, Select, Tabs, Tooltip, Textarea, Menu, CopyButton, Divider, Checkbox } from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconSearch, IconExternalLink, IconRobot, IconDownload, IconCheck, IconMail, IconArrowLeft, IconPlus, IconEdit, IconWorld, IconTrash, IconX, IconScan, IconCopy, IconRocket } from '@tabler/icons-react';
import pptxgen from 'pptxgenjs';
import { notifications } from '@mantine/notifications';
import {
    saveHunterResult,
    getHunterResults,
    updateHunterStatus,
    searchPartners,
    updateHunterInfo,
    deleteHunterResult,
    scanWebsite,
    sendProposalEmail,
    sendBulkProposals
} from '@/lib/actions';
import { generateProposalEmail } from '@/lib/ai';
import { logout } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';


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
    aiSummary?: {
        score: number;
        analysis: string;
        angle: string;
    };
}

const APP_STATUS: Record<string, string> = {
    'New': 'gray',
    'Proposal Sent': 'blue',
    'Proceeding': 'green',
    'Contracted': 'grape',
    'Dropped': 'red'
};

// Initial countries constant for type safety or reference if needed, 
// but we will use a localized version inside the component.
const COUNTRY_CODES = [
    { value: '', label_key: 'hunter_country_all' },
    { value: 'KR', label_key: 'hunter_country_kr' },
    { value: 'JP', label_key: 'hunter_country_jp' },
    { value: 'US', label_key: 'hunter_country_us' },
    { value: 'CN', label_key: 'hunter_country_cn' },
    { value: 'VN', label_key: 'hunter_country_vn' },
    { value: 'FR', label_key: 'hunter_country_fr' },
    { value: 'AE', label_key: 'hunter_country_ae' },
    { value: 'TH', label_key: 'hunter_country_th' },
    { value: 'DE', label_key: 'hunter_country_de' },
    { value: 'ES', label_key: 'hunter_country_es' }
];

export default function HunterPage() {
    const { t } = useTranslation();

    // Localized Country List
    const COUNTRIES = COUNTRY_CODES.map(c => ({
        value: c.value,
        label: t(c.label_key as any)
    }));

    // Smart Targets Definition
    const TARGET_PRESETS = [
        {
            label: '🇯🇵 JP: Toyosu Market & High-end Wholesalers',
            icon: '🏮',
            keywords: {
                'JP': '("豊洲市場" OR "大田市場") ("わさび" OR "生わさび") "卸売" OR "仲卸" "担当" "お問い合わせ" -blog',
                'Global': 'Toyosu Market Wasabi Wholesaler Contact'
            }
        },
        {
            label: '🍱 JP: Premium Omakase & Kaiseki Group',
            icon: '🍣',
            keywords: {
                'JP': '("ミシュラン" OR "食べログ4.0") ("寿司" OR "和食") "多店舗展開" "商品開発" "仕入れ" -review',
                'Global': 'Michelin Star Sushi Group Japan Purchasing'
            }
        },
        {
            label: '🧪 JP: Agritech & Aeroponic R&D',
            icon: '🌱',
            keywords: {
                'JP': '("エアロポニックス" OR "噴霧耕") ("わさび" OR "ワサビ") "共同研究" OR "技術提携" "研究所" -youtube',
                'Global': 'Japan Aeroponics Wasabi Research Partnership'
            }
        },
        {
            label: '🏭 JP: Food Tech & Extract Processing',
            icon: '🥣',
            keywords: {
                'JP': '("サプリメント" OR "健康食品") ("わさびエキス" OR "6-MSITC") "原材料" "供給" "メーカー"',
                'Global': 'Japan Health Food Wasabi Extract Supplier Search'
            }
        },
        {
            label: '🐋 Global Big Fish: Wholesalers',
            icon: '🌍',
            keywords: {
                'KR': '"와사비" "도매" "유통" "납품문의" -쿠팡 -스마트스토어',
                'JP': '"わさび" ("卸売" OR "商社" OR "問屋") "会社概要" -recipe',
                'CN': '芥末 批发商 "联系方式"',
                'VN': '"Wasabi" (Bán buôn OR Nhà phân phối OR Nhập khẩu) "Liên hệ"',
                'TH': '"วาซาบิ" (ขายส่ง OR ตัวแทนจำหน่าย OR ผู้นำเข้า) "ติดต่อ"',
                'Global': '"Wasabi" ("Wholesale" OR "Distributor" OR "Importer") -recipe -blog -amazon'
            }
        },
        {
            label: '🧬 Lab: Smart Farm R&D',
            icon: '🔬',
            keywords: {
                'KR': '"스마트팜" "연구소" "기술제휴" OR "MOU"',
                'JP': '"植物工場" "研究開発" "共同研究"',
                'Global': 'Vertical Farming Research Institute Partnership'
            }
        },
        {
            label: '📂 Hunt: Excel/PDF Lists',
            icon: '📄',
            keywords: {
                'KR': 'filetype:xlsx OR filetype:pdf "와사비" "업체리스트" OR "회원명단"',
                'JP': 'filetype:xlsx OR filetype:pdf "わさび" "業者名簿" OR "会員リスト"',
                'Global': 'filetype:xlsx OR filetype:pdf "Wasabi" "Company List" "Directory"'
            }
        }
    ];


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
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [emailMode, setEmailMode] = useState(false);
    const [bulkSending, setBulkSending] = useState(false);

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

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === savedPartners.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(savedPartners.map((p: any) => p.id));
        }
    };

    const handleBulkSend = async () => {
        if (selectedIds.length === 0) return;

        const targetPartners = savedPartners.filter((p: any) => selectedIds.includes(p.id));
        const partnersWithEmail = targetPartners.filter((p: any) => p.email && p.email.includes('@'));

        if (partnersWithEmail.length === 0) {
            notifications.show({ title: 'No Emails Found', message: 'Selected partners do not have valid emails.', color: 'orange' });
            return;
        }

        if (!confirm(`🚀 Bulk Launch: Send personalized AI proposals to ${partnersWithEmail.length} partners?\n\n(Wait: ~1s per email)`)) return;

        setBulkSending(true);
        try {
            const result = await sendBulkProposals(partnersWithEmail);
            if (result.success) {
                notifications.show({
                    title: 'Bulk Launch Complete! 🚀',
                    message: `Successfully sent ${result.sent} / ${result.total} emails.`,
                    color: 'green',
                    autoClose: 10000
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

    const handlePresetClick = (preset: any) => {
        let activeCountry = country || 'Global';

        // Auto-detect country from preset
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
            const data = await searchPartners(term, 1, countryCode || '');

            // Enforce selected country context on results
            if (countryCode && data.length > 0) {
                // Map code to Name if possible, or just use code
                const countryObj = COUNTRIES.find(c => c.value === countryCode);
                const countryName = countryObj ? countryObj.label : countryCode;
                data.forEach((item: HunterResult) => item.country = countryName);
            }

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
            setResults((prev: HunterResult[]) => [...prev, ...data]);
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
        setResults((prev) => prev.filter((item: HunterResult) => item.id !== id));
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
                if (savedPartners.some((p: HunterResult) => p.id === partner.id)) {
                    await updateHunterInfo(partner.id, updates);
                    loadSavedPartners();
                } else {
                    setResults((prev: HunterResult[]) => prev.map((p: HunterResult) => p.id === partner.id ? { ...p, ...updates } : p));
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
        const pres = new pptxgen();

        // Define Language Templates
        const lang = partner.country || 'Global';
        let text = {
            title: 'Strategic Partnership Proposal',
            subtitle: `K-Farm International  x  ${partner.name}`,
            prepared: 'Prepared for:',
            confidential: 'Confidential',
            slide2_title: 'Why We Connected',
            slide2_sub: `Analysis of ${partner.name}`,
            slide2_rel: 'Target Relevance:',
            slide2_type: 'Organization Type:',
            slide2_syn: 'Potential Synergy: Shared R&D goals in smart agriculture.',
            slide3_title: 'Our Core Competency',
            slide3_sub: 'K-Farm Smart Solutions',
            slide3_p1: 'Virus-Free Seedlings (Tissue Culture)',
            slide3_p2: 'Hyper-Cycle Aeroponic Systems (9 Months Cycle)',
            slide3_p3: 'ESG & Energy Efficient LED Technology'
        };

        // Simple Translation Logic
        if (lang === 'Japan' || lang === 'JP') {
            text = {
                title: '戦略的パートナーシップのご提案',
                subtitle: `K-Farm International  x  ${partner.name}`,
                prepared: '受取人:',
                confidential: '社外秘',
                slide2_title: '提案の背景',
                slide2_sub: `${partner.name} 様の分析`,
                slide2_rel: '関連性:',
                slide2_type: '組織タイプ:',
                slide2_syn: 'シナジー効果: スマート農業におけるR&D目標の共有',
                slide3_title: 'K-Farmの核心競争力',
                slide3_sub: 'K-Farm スマートソリューション',
                slide3_p1: 'ウイルスフリー苗 (組織培養)',
                slide3_p2: 'ハイパーサイクル・エアロポニックス (9ヶ月サイクル)',
                slide3_p3: 'ESG & エネルギー効率の高いLED技術'
            };
        } else if (lang === 'China' || lang === 'CN') {
            text = {
                title: '战略合作伙伴建议书',
                subtitle: `K-Farm International  x  ${partner.name}`,
                prepared: '收件人:',
                confidential: '机密',
                slide2_title: '提案背景',
                slide2_sub: `${partner.name} 分析`,
                slide2_rel: '相关性:',
                slide2_type: '组织类型:',
                slide2_syn: '潜在协同效应: 智慧农业研发目标的共享',
                slide3_title: '核心竞争力',
                slide3_sub: 'K-Farm 智慧解决方案',
                slide3_p1: '无病毒种苗 (组织培养)',
                slide3_p2: '超循环气培系统 (9个月周期)',
                slide3_p3: 'ESG & 高能效LED技术'
            };
        } else if (lang === 'Korea' || lang === 'KR') {
            text = {
                title: '전략적 파트너십 제안서',
                subtitle: `K-Farm International  x  ${partner.name}`,
                prepared: '수신:',
                confidential: '대외비',
                slide2_title: '제안 배경',
                slide2_sub: `${partner.name} 분석`,
                slide2_rel: '관련성:',
                slide2_type: '조직 유형:',
                slide2_syn: '기대 효과: 스마트 농업 R&D 목표 공유 및 시너지',
                slide3_title: '핵심 경쟁력',
                slide3_sub: 'K-Farm 스마트 솔루션',
                slide3_p1: '무병묘 생산 (조직 배양)',
                slide3_p2: '하이퍼 사이클 에어로포닉스 (9개월 주기)',
                slide3_p3: 'ESG & 고효율 LED 재배 기술'
            };
        } else if (lang === 'Thailand' || lang === 'TH') {
            text = {
                title: 'ข้อเสนอพันธมิตรทางยุทธศาสตร์',
                subtitle: `K-Farm International  x  ${partner.name}`,
                prepared: 'จัดเตรียมสำหรับ:',
                confidential: 'ความลับ',
                slide2_title: 'ความเป็นมาของข้อเสนอ',
                slide2_sub: `วิเคราะห์ ${partner.name}`,
                slide2_rel: 'ความเกี่ยวข้อง:',
                slide2_type: 'ประเภทองค์กร:',
                slide2_syn: 'การทำงานร่วมกัน: เป้าหมายการวิจัยและพัฒนาในเกษตรอัจฉริยะ',
                slide3_title: 'ขีดความสามารถหลัก',
                slide3_sub: 'K-Farm สมาร์ทโซลูชั่น',
                slide3_p1: 'ต้นกล้าปลอดเชื้อ (Tissue Culture)',
                slide3_p2: 'ระบบแอโรโพนิกส์ (รอบการผลิต 9 เดือน)',
                slide3_p3: 'เทคโนโลยี LED ประหยัดพลังงานและ ESG'
            };
        } else if (lang === 'Vietnam' || lang === 'VN') {
            text = {
                title: 'Đề xuất Đối tác Chiến lược',
                subtitle: `K-Farm International  x  ${partner.name}`,
                prepared: 'Chuẩn bị cho:',
                confidential: 'Bảo mật',
                slide2_title: 'Bối cảnh Đề xuất',
                slide2_sub: `Phân tích ${partner.name}`,
                slide2_rel: 'Sự liên quan:',
                slide2_type: 'Loại hình tổ chức:',
                slide2_syn: 'Tiềm năng hợp tác: Mục tiêu R&D chung trong nông nghiệp thông minh',
                slide3_title: 'Năng lực Cốt lõi',
                slide3_sub: 'Giải pháp K-Farm Smart',
                slide3_p1: 'Cây giống sạch bệnh (Nuôi cấy mô)',
                slide3_p2: 'Hệ thống khí canh (Chu kỳ 9 tháng)',
                slide3_p3: 'Công nghệ LED tiết kiệm năng lượng & ESG'
            };
        }

        const slide1 = pres.addSlide();
        slide1.background = { color: 'F1F3F5' };
        slide1.addText(text.title, { x: 1, y: 2, w: 8, h: 1, fontSize: 36, bold: true, color: '2B8A3E' });
        slide1.addText(text.subtitle, { x: 1, y: 3.5, w: 8, h: 1, fontSize: 24, color: '343A40' });
        const contactInfo = partner.contact || 'Partner';
        slide1.addText(`${text.prepared} ${contactInfo}`, { x: 1, y: 5, w: 8, h: 0.5, fontSize: 14, color: '868E96' });
        slide1.addText(text.confidential, { x: 8, y: 5, w: 1.5, h: 0.5, fontSize: 12, color: 'FF0000' });

        const slide2 = pres.addSlide();
        slide2.addText(text.slide2_title, { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, color: '2B8A3E', bold: true });
        slide2.addText(text.slide2_sub, { x: 0.5, y: 1.0, w: 9, h: 0.8, fontSize: 24, bold: true });
        slide2.addText([
            { text: `${text.slide2_rel} ${partner.relevance}`, options: { bullet: true, breakLine: true } },
            { text: `${text.slide2_type} ${partner.type}`, options: { bullet: true, breakLine: true } },
            { text: text.slide2_syn, options: { bullet: true } }
        ], { x: 0.5, y: 2.0, w: 9, h: 4, fontSize: 14, color: '343A40' });

        const slide3 = pres.addSlide();
        slide3.addText(text.slide3_title, { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, color: '2B8A3E', bold: true });
        slide3.addText(text.slide3_sub, { x: 0.5, y: 1.0, w: 9, h: 0.8, fontSize: 24, bold: true });
        slide3.addText([
            { text: text.slide3_p1, options: { bullet: true, breakLine: true } },
            { text: text.slide3_p2, options: { bullet: true, breakLine: true } },
            { text: text.slide3_p3, options: { bullet: true } }
        ], { x: 0.5, y: 2.0, w: 9, h: 4, fontSize: 16, color: '343A40' });

        const safeName = partner.name.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        pres.writeFile({ fileName: `K-Farm_Proposal_${safeName}_${lang}.pptx` });

        notifications.show({ title: 'PPT Downloaded', message: `Generated in ${lang}!`, color: 'green' });
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

                const signature = `\n\n------------------------------\n洪泳喜 (Jerry Y. Hong)\nK-Farm Group / Wasabi Div.\nMobile: +82-10-4355-0633\nEmail: info@k-wasabi.kr\nWeb: www.k-wasabi.kr`;
                setDraftEmail({
                    subject: aiResponse.subject || `[Proposal] Partnership with ${t('nav_brand')}`,
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
        const subject = `[Proposal] Strategic Partnership: ${t('nav_brand')} x ${partner.name}`;
        const body = `Dear ${partner.contact || 'Partner'},\n\nI hope this email finds you well.\n\nMy name is Jerry Y. Hong, representing ${t('nav_brand')}. We have been following the work of ${partner.name} with great interest.\n\nWe believe there is a strong potential for synergy between our organizations.\n\nBest regards,`;
        return { subject, body };
    };

    return (
        <Container size="xl" py={40}>
            <Stack align="center" mb={40}>
                <Group justify="space-between" w="100%">
                    <div />
                    <Stack align="center" gap="xs">
                        <Badge variant="filled" color="grape" size="lg">Sales Agent Beta</Badge>
                        <Title order={1}>{t('hunter_title')} <Badge color="red" variant="light" size="sm">SECURE v2.1</Badge></Title>
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
                    {t('hunter_subtitle')}
                </Text>
                <Button
                    variant="outline"
                    color="green"
                    mt="md"
                    leftSection={<IconDownload size={16} />}
                    onClick={() => {
                        const escapeCsv = (val: string) => `"${(val || '').toString().replace(/"/g, '""')}"`;
                        const headers = ["Name", "Type", "Relevance", "Contact", "Phone", "Email", "URL", "Status"];
                        const rows = savedPartners.map((e: HunterResult) => [
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
                    {t('hunter_export_btn')}
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
                                label={t('hunter_country_label')}
                                data={COUNTRIES}
                                value={country}
                                onChange={setCountry}
                                style={{ width: 150 }}
                                allowDeselect={false}
                            />
                            <TextInput
                                label={t('hunter_keyword_placeholder')}
                                placeholder={t('hunter_keyword_placeholder')}
                                style={{ flex: 1 }}
                                value={keyword}
                                onChange={(event) => setKeyword(event.currentTarget.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                size="md"
                                leftSection={<IconSearch size={16} />}
                            />
                            <Button size="md" color="grape" onClick={handleSearch} loading={loading} leftSection={<IconRobot size={20} />}>
                                {t('hunter_btn_start')}
                            </Button>
                        </Group>
                    </Card>

                    <Stack gap="xs" mb="xl">
                        <Text size="sm" fw={500} c="dimmed">{t('hunter_quick_target')}</Text>
                        <Group gap={8} wrap="wrap">
                            {TARGET_PRESETS.map((preset) => (
                                <Badge
                                    key={preset.label}
                                    size="lg"
                                    variant="outline"
                                    color="gray"
                                    style={{ cursor: 'pointer', textTransform: 'none' }}
                                    onClick={() => handlePresetClick(preset)}
                                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {preset.icon} {preset.label}
                                </Badge>
                            ))}
                        </Group>
                    </Stack>

                    {results.length > 0 && (
                        <Stack>
                            <Group justify="space-between" mb={-10}>
                                <Group>
                                    <Text size="sm" c="dimmed">Found {results.length} {t('hunter_found_count')}</Text>
                                    {results[0].isMock && <Badge color="orange" variant="light">Demo Mode</Badge>}
                                </Group>
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="teal"
                                    leftSection={<IconScan size={14} />}
                                    onClick={async () => {
                                        if (!confirm(`Add & Scan all ${results.length} leads?\n(This will take about ${results.length * 3} seconds)`)) return;
                                        setLoading(true);
                                        let count = 0;

                                        for (const item of results) {
                                            notifications.show({ id: 'scan-progress', title: `Scanning ${count + 1}/${results.length}`, message: `Analyzing ${item.name}...`, loading: true, autoClose: false });

                                            // 1. Deep Scan first
                                            const enrichedItem = { ...item };
                                            try {
                                                if (item.url && !item.email) {
                                                    const scanRes: any = await scanWebsite(item.url);
                                                    if (scanRes.success) {
                                                        enrichedItem.email = (scanRes.emails && scanRes.emails.length > 0) ? scanRes.emails[0] : enrichedItem.email;
                                                        enrichedItem.phone = (scanRes.phones && scanRes.phones.length > 0) ? scanRes.phones[0] : enrichedItem.phone;
                                                        enrichedItem.aiSummary = scanRes.aiSummary; // Store AI Analysis
                                                        enrichedItem.status = 'AI Analyzed';
                                                    }
                                                }
                                            } catch (e) {
                                                console.error("Auto-scan failed for", item.name);
                                            }

                                            // 2. Save enriched item
                                            await saveHunterResult(enrichedItem);
                                            count++;
                                        }

                                        notifications.hide('scan-progress');
                                        await loadSavedPartners();
                                        setLoading(false);
                                        notifications.show({ title: 'Batch Scan & Save Complete', message: `Processed ${count} partners with AI analysis!`, color: 'teal' });
                                    }}
                                >
                                    Add & Scan All (Auto)
                                </Button>
                            </Group>
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w={60}>{t('hunter_col_country')}</Table.Th>
                                        <Table.Th>{t('hunter_col_org')}</Table.Th>
                                        <Table.Th>{t('hunter_col_type')}</Table.Th>
                                        <Table.Th>{t('hunter_col_analysis')}</Table.Th>
                                        <Table.Th>{t('hunter_col_contact')}</Table.Th>
                                        <Table.Th>{t('hunter_col_action')}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {results.map((element: HunterResult) => (
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
                                                {element.aiSummary ? (
                                                    <Stack gap={4}>
                                                        <Group gap={4}>
                                                            <Badge color={element.aiSummary.score >= 8 ? 'green' : element.aiSummary.score >= 5 ? 'blue' : 'gray'} size="xs">
                                                                AI Score: {element.aiSummary.score}/10
                                                            </Badge>
                                                        </Group>
                                                        <Text size="xs" fw={700} c="grape">{element.aiSummary.angle}</Text>
                                                        <Text size="xs" lineClamp={2} c="dimmed" fs="italic">"{element.aiSummary.analysis}"</Text>
                                                    </Stack>
                                                ) : (
                                                    <Text size="xs" lineClamp={2}>{element.relevance}</Text>
                                                )}
                                            </Table.Td>
                                            <Table.Td>
                                                {element.email ? (
                                                    <Stack gap={0}>
                                                        <Group gap={4} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `mailto:${element.email}`}>
                                                            <IconMail size={12} color="blue" />
                                                            <Text size="xs" fw={700} c="blue" style={{ textDecoration: 'underline' }}>{element.email}</Text>
                                                        </Group>
                                                        {element.contact && <Text size="xs" c="dimmed">{element.contact}</Text>}
                                                    </Stack>
                                                ) : element.contact && element.contact.includes('@') ? (
                                                    <Group gap={4} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `mailto:${element.contact}`}>
                                                        <IconMail size={12} color="gray" />
                                                        <Text size="xs" fw={500} c="blue" style={{ textDecoration: 'underline' }}>{element.contact}</Text>
                                                    </Group>
                                                ) : (
                                                    <Text size="xs" fw={500}>{element.contact?.startsWith('http') ? '-' : element.contact || '-'}</Text>
                                                )}
                                                <Text size="xs" c="dimmed">{element.phone}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap={4}>
                                                    <Tooltip label={t('hunter_btn_save')}>
                                                        <ActionIcon variant="light" color="blue" size="sm" onClick={() => handleSaveToList(element)}>
                                                            <IconPlus size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Button variant="light" size="compact-xs" color="wasabi" onClick={() => handlePreview(element)}>
                                                        {t('hunter_btn_proposal')}
                                                    </Button>
                                                    <Tooltip label={t('hunter_btn_scan')}>
                                                        <ActionIcon variant="light" color="grape" size="sm" onClick={() => handleScan(element)}>
                                                            <IconScan size={14} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label={t('hunter_btn_dismiss')}>
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
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Title order={3}>My Pipeline <Text span size="sm" c="dimmed">({savedPartners.length})</Text></Title>
                            <Button
                                leftSection={<IconRocket size={16} />}
                                color="blue"
                                disabled={selectedIds.length === 0}
                                loading={bulkSending}
                                onClick={handleBulkSend}
                            >
                                Mass Send AI Proposals ({selectedIds.length})
                            </Button>
                        </Group>

                        {savedPartners.length === 0 ? (
                            <Text c="dimmed" fs="italic" ta="center" py="xl">No partners saved yet.</Text>
                        ) : (
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th w={40}>
                                            <Checkbox
                                                checked={selectedIds.length === savedPartners.length && savedPartners.length > 0}
                                                indeterminate={selectedIds.length > 0 && selectedIds.length < savedPartners.length}
                                                onChange={toggleSelectAll}
                                            />
                                        </Table.Th>
                                        <Table.Th w={60}>Cntry</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Organization</Table.Th>
                                        <Table.Th>Contact</Table.Th>
                                        <Table.Th>Last Contact</Table.Th>
                                        <Table.Th>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {savedPartners.map((element: HunterResult) => (
                                        <Table.Tr key={element.id} style={{ fontSize: '0.85rem' }}>
                                            <Table.Td>
                                                <Checkbox
                                                    checked={selectedIds.includes(element.id)}
                                                    onChange={() => toggleSelect(element.id)}
                                                />
                                            </Table.Td>
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
                                                    <Button variant="light" size="compact-xs" color="wasabi" onClick={() => handlePreview(element)}>
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
                title={emailMode ? t('hunter_modal_email_title') : t('hunter_modal_proposal_title')}
                size="xl"
                centered
            >
                {selectedPartner && !emailMode && (
                    <Stack>
                        <Card withBorder shadow="sm" bg="gray.1" padding="xl">
                            <Text size="xl" fw={700} c="green.9" ta="center" mt="md">Strategic Partnership Proposal</Text>
                            <Text size="lg" ta="center" mt="sm">{t('nav_brand')} x {selectedPartner.name}</Text>
                            <Text size="sm" c="dimmed" ta="center" mt="xl">Prepared for: {selectedPartner.contact}</Text>
                            <Badge color="red" variant="outline" mx="auto" mt="md">CONFIDENTIAL</Badge>
                        </Card>
                        <Group grow mt="md">
                            <Button leftSection={<IconDownload size={16} />} color="grape" variant="outline" onClick={() => handleDownloadPPT(selectedPartner)}>
                                {t('hunter_modal_export_pptx')}
                            </Button>
                            <Button leftSection={<IconMail size={16} />} color="grape" onClick={handleDraftEmail} loading={loading}>
                                {t('hunter_modal_gen_ai')}
                            </Button>
                        </Group>
                    </Stack>
                )}

                {selectedPartner && emailMode && (
                    <Stack>
                        <Button variant="subtle" color="gray" size="xs" leftSection={<IconArrowLeft size={12} />} onClick={() => setEmailMode(false)}>
                            {t('hunter_modal_back')}
                        </Button>

                        <TextInput
                            label="To (Recipient Email)"
                            placeholder="name@company.com"
                            value={editForm.email || selectedPartner.email || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, email: e.target.value })}
                            mb="sm"
                            required
                        />

                        <Group align="flex-end" gap="xs">
                            <TextInput
                                label={t('hunter_modal_subject')}
                                value={draftEmail.subject || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraftEmail({ ...draftEmail, subject: e.currentTarget.value })}
                                style={{ flex: 1 }}
                            />
                            <CopyButton value={draftEmail.subject || ''}>
                                {({ copied, copy }) => (
                                    <Button color={copied ? 'teal' : 'gray'} onClick={copy} variant="filled">
                                        {copied ? 'Copied!' : 'Copy Subject'}
                                    </Button>
                                )}
                            </CopyButton>
                        </Group>

                        <Stack gap={4}>
                            <Textarea
                                label={t('hunter_modal_body')}
                                value={draftEmail.body || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraftEmail({ ...draftEmail, body: e.currentTarget.value })}
                                autosize
                                minRows={10}
                            />
                            <Group justify="flex-end">
                                <CopyButton value={draftEmail.body || ''}>
                                    {({ copied, copy }) => (
                                        <Button color={copied ? 'teal' : 'blue'} onClick={copy} leftSection={<IconCopy size={16} />}>
                                            {copied ? 'Body Copied!' : 'Copy Body Text'}
                                        </Button>
                                    )}
                                </CopyButton>
                            </Group>
                        </Stack>

                        <Group mt="md" grow>
                            <Button
                                leftSection={<IconRocket size={16} />}
                                color="blue"
                                size="md"
                                loading={loading}
                                onClick={async () => {
                                    if (!selectedPartner) return;
                                    const targetEmail = editForm.email || selectedPartner.email;
                                    if (!targetEmail) return notifications.show({ title: 'No Email', message: 'Please add an email address first.', color: 'red' });

                                    if (!confirm(`🚀 Launch this actual email to ${targetEmail}?\n\n(Sender: info@k-wasabi.kr)`)) return;

                                    setLoading(true);
                                    try {
                                        const res = await sendProposalEmail(targetEmail, selectedPartner.name, draftEmail.subject || '', draftEmail.body || '');
                                        if (res.success) {
                                            notifications.show({ title: 'System Launch Success! 🚀', message: `Email sent to ${targetEmail}`, color: 'green', autoClose: 5000 });
                                            await updateHunterStatus(selectedPartner.id, 'Proposal Sent');
                                            setOpened(false);
                                        } else {
                                            notifications.show({ title: 'Launch Failed', message: (res as { message?: string; error?: string }).message || (res as { message?: string; error?: string }).error || 'SMTP Error', color: 'red' });
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        notifications.show({ title: 'Launch Error', message: 'Check server logs.', color: 'red' });
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                Launch Now (System)
                            </Button>
                        </Group>

                        <Divider label="or use manual method" labelPosition="center" my="sm" />

                        <Group>
                            <Button
                                component="a"
                                href={`mailto:${editForm.email || selectedPartner.email || ''}?subject=${encodeURIComponent(draftEmail.subject)}&body=${encodeURIComponent(draftEmail.body)}`}
                                leftSection={<IconMail size={16} />}
                                color="gray"
                                variant="outline"
                                size="sm"
                                style={{ flex: 1 }}
                            >
                                Open Email Client (Manual)
                            </Button>
                            <Tooltip label="Open Gmail">
                                <ActionIcon
                                    component="a"
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(editForm.email || selectedPartner.email || '')}&su=${encodeURIComponent(draftEmail.subject)}&body=${encodeURIComponent(draftEmail.body)}`}
                                    target="_blank"
                                    variant="default"
                                    size="lg"
                                    h={36} w={36}
                                >
                                    <IconExternalLink size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Stack>
                )}
            </Modal>

            <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Partner Info" centered>
                <Stack>
                    <TextInput label="Organization Name" value={editForm.name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, name: e.target.value })} />
                    <Select
                        label="Country"
                        data={COUNTRIES}
                        value={editForm.country || 'Global'}
                        onChange={(val: string | null) => setEditForm({ ...editForm, country: val || 'Global' })}
                    />
                    <TextInput label="Type" value={editForm.type || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, type: e.target.value })} />
                    <TextInput label="Contact Person" placeholder="Name of person" value={editForm.contact || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, contact: e.target.value })} />
                    <TextInput label="Email Address" placeholder="email@address.com" value={editForm.email || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, email: e.target.value })} />
                    <TextInput label="Phone Number" value={editForm.phone || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, phone: e.target.value })} />
                    <Textarea label="Notes / Relevance" autosize minRows={3} value={editForm.relevance || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({ ...editForm, relevance: e.target.value })} />
                    <Button color="blue" onClick={handleSaveEdit}>Save Changes</Button>
                </Stack>
            </Modal>
        </Container >
    );
}
