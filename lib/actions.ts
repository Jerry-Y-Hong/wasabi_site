'use server';

import fs from 'fs';
import { promises as fsp } from 'fs';
import pathLib from 'path';
import { revalidatePath } from 'next/cache';
import { put, list } from '@vercel/blob';

// Use /tmp only on Vercel deployment
// Use /tmp only on Vercel deployment, otherwise use strict absolute path for local
// Define paths for both read-only build files and writable tmp files
const BUILD_DATA_PATH = pathLib.join(process.cwd(), 'data');
const TMP_DATA_PATH = '/tmp/data';

const IS_VERCEL = process.env.VERCEL === '1';

async function ensureDataDir() {
    if (IS_VERCEL) {
        try {
            await fsp.access(TMP_DATA_PATH);
        } catch {
            await fsp.mkdir(TMP_DATA_PATH, { recursive: true });
        }
    } else {
        // Local
        try {
            await fsp.access(BUILD_DATA_PATH);
        } catch {
            await fsp.mkdir(BUILD_DATA_PATH, { recursive: true });
        }
    }
}

// Fallback Data for Vercel (When FS read fails)
const FALLBACK_POSTS = [
    {
        "title": "K-Farm의 에어로포닉스 기술 혁명: 와사비 스마트 농업의 새로운 지평을 열다",
        "content": "# K-Farm의 에어로포닉스 기술 혁명: 와사비 스마트 농업의 새로운 지평을 열다\n\n전 세계적으로 와사비 수요는 꾸준히 증가하고 있지만, 전통적인 재배 방식은 긴 시간과 까다로운 환경 조건으로 인해 어려움을 겪고 있습니다. 🌱 품질 좋은 와사비를 안정적으로 공급하는 것은 여전히 풀리지 않는 숙제와 같습니다. 하지만 K-Farm은 혁신적인 에어로포닉스 기술을 통해 와사비 스마트 농업의 새로운 시대를 열어가고 있습니다. 이 블로그 포스트에서는 K-Farm의 에어로포닉스 기술이 어떻게 와사비 재배의 한계를 극복하고 있는지 자세히 살펴보겠습니다.\n\n## 와사비 재배의 어려움: 왜 혁신이 필요한가?\n\n와사비는 섬세하고 까다로운 작물로 알려져 있습니다. 전통적인 토양 재배 방식은 다음과 같은 어려움을 안고 있습니다.\n\n*   **긴 재배 기간**: 18~24개월이라는 긴 시간이 소요되어 자본 회전율이 낮습니다.\n*   **환경 의존성**: 깨끗한 물, 서늘한 기온, 적절한 습도 등 까다로운 환경 조건을 필요로 합니다.\n*   **병충해 위험**: 토양을 매개로 한 병충해 발생 위험이 높아 안정적인 수확을 보장하기 어렵습니다.\n*   **낮은 수확량**: 환경 조건의 제약으로 인해 수확량이 제한적입니다.\n\n이러한 문제점을 해결하기 위해 K-Farm은 에어로포닉스 기술을 도입하여 와사비 재배 방식을 혁신했습니다. 🚀\n\n## K-Farm 에어로포닉스 기술: 와사비 재배의 미래\n\n에어로포닉스(Aeroponics)는 흙 없이 공기 중에 뿌리를 노출시켜 양액을 분무하는 방식으로 작물을 재배하는 첨단 농법입니다. K-Farm은 자체 개발한 **하이퍼-사이클 에어로포닉스** 시스템을 통해 와사비 재배의 효율성을 극대화했습니다. \n\n### K-Farm 하이퍼-사이클 에어로포닉스 기술의 핵심\n\n*   **단축된 재배 기간**: 9개월 만에 수확 가능하여 자본 회전율을 획기적으로 높입니다.\n*   **정밀한 환경 제어**: EC, pH, PPFD (광합성 광자속 밀도) 등 생육 환경을 데이터 기반으로 정밀하게 제어하여 최적의 생육 조건을 제공합니다. 💧\n*   **병충해 예방**: 폐쇄형 시스템으로 외부 오염원을 차단하여 병충해 발생 위험을 최소화합니다.\n*   **수확량 증대**: 최적화된 환경 조건과 영양 공급을 통해 수확량을 극대화합니다.\n*   **균일한 품질**: 환경 제어와 **바이러스-프리 씨앗 (조직 배양)**을 통해 균일한 품질의 와사비를 생산합니다.\n\n### 데이터 기반 품질 관리: Allyl Isothiocyanate 극대화\n\n와사비의 매운맛을 내는 핵심 성분인 Allyl Isothiocyanate (AITC) 함량을 극대화하는 것은 매우 중요합니다. K-Farm은 데이터 기반 환경 제어를 통해 AITC 함량을 정밀하게 조절합니다. 🔬\n\n*   EC (전기 전도도) 최적화: 최적의 양분 흡수를 유도하여 와사비 생육을 촉진하고 AITC 생성을 활성화합니다.\n*   pH (수소 이온 농도) 조절: 뿌리 활착 및 영양분 흡수에 최적화된 pH 환경을 유지합니다.\n*   PPFD (광합성 광자속 밀도) 제어: 광합성 효율을 높여 와사비 생육을 촉진하고 AITC 합성을 증진합니다.\n\n## K-Farm의 차별점: 바이러스-프리 씨앗과 하이퍼-사이클 에어로포닉스\n\nK-Farm은 **바이러스-프리 씨앗 (조직 배양)**을 자체 생산하여 와사비 재배의 안정성을 높입니다. 또한, 독자적인 **하이퍼-사이클 에어로포닉스** 시스템을 통해 재배 기간을 단축하고 품질을 향상시켰습니다. 이는 K-Farm만이 제공할 수 있는 경쟁력입니다.\n\n## 결론: 와사비 스마트 농업의 미래를 함께 만들어갈 파트너를 찾습니다.\n\nK-Farm은 혁신적인 에어로포닉스 기술을 통해 와사비 스마트 농업의 새로운 기준을 제시하고 있습니다. 앞으로도 지속적인 연구 개발을 통해 와사비 재배 기술을 발전시켜 나갈 것입니다. K-Farm과 함께 와사비 스마트 농업의 미래를 만들어갈 파트너를 찾습니다. 투자 및 협력 문의는 언제든지 환영합니다. 🌱🚀💧🔬\n",
        "topic": "K-Farm의 에어로포닉스 기술 혁명\")",
        "keywords": "smart farm, aeroponics, wasabi, investment",
        "tags": ["smart farm", "aeroponics", "wasabi"],
        "author": "AI Writer",
        "image": "https://image.pollinations.ai/prompt/A%20futuristic%20wasabi%20farm%20using%20aeroponics%20technology.%20Wasabi%20plants%20are%20suspended%20in%20the%20air%20with%20roots%20exposed%20and%20being%20misted%20with%20nutrient%20solution.%20The%20background%20features%20a%20clean%2C%20modern%20indoor%20farm%20setting%20with%20LED%20grow%20lights.%20Data%20dashboards%20showing%20EC%2C%20pH%2C%20and%20PPFD%20readings%20are%20visible.%20The%20overall%20tone%20should%20be%20high-tech%20and%20innovative.?width=1024&height=600&seed=116779&model=flux&nologo=true",
        "id": 1766927075509,
        "slug": "k-farm-aeroponics",
        "timestamp": "2025-12-28T13:04:35.509Z",
        "category": "Company Blog"
    },
    {
        "title": "와사비 수직농업: 스마트팜 혁신을 통한 무한한 가능성 🌱🚀",
        "content": "# 와사비 수직농업: 스마트팜 혁신을 통한 무한한 가능성 🌱🚀\n\n전 세계적으로 건강에 대한 관심이 높아지면서 와사비에 대한 수요가 급증하고 있습니다. 그러나 전통적인 와사비 재배 방식은 긴 재배 기간, 높은 노동력, 그리고 예측 불가능한 환경 변수 때문에 많은 어려움을 겪고 있습니다. 토양 오염과 기후 변화는 이러한 어려움을 더욱 가중시키고 있습니다. 이제 와사비 농업은 **혁신적인 변화**가 필요한 시점입니다. 해결책은 바로 **수직농업**입니다. \n\n## 수직농업, 와사비 재배의 새로운 지평을 열다 💧\n\n수직농업은 공간 효율성을 극대화하고 환경 제어 기술을 통해 작물 생산성을 획기적으로 향상시키는 혁신적인 농업 방식입니다. 특히 와사비와 같이 까다로운 작물 재배에 있어 수직농업은 다음과 같은 다양한 이점을 제공합니다.\n\n*   **수확량 증대:** 층층이 쌓아 올린 재배 시스템은 단위 면적당 생산량을 극대화합니다.\n*   **환경 제어:** 온도, 습도, 빛, 영양분 등 재배 환경을 정밀하게 제어하여 최적의 생육 조건을 제공합니다.\n*   **병충해 감소:** 밀폐된 환경은 외부 오염 요소를 차단하여 병충해 발생 위험을 줄입니다.\n*   **물 절약:** 폐쇄형 순환 시스템은 물 사용량을 획기적으로 줄이고 환경 부담을 최소화합니다.\n*   **일정하고 높은 품질:** 데이터 기반의 정밀한 관리를 통해 와사비의 품질을 균일하게 유지하고 향상시킵니다.\n\n### 수직농업의 핵심 기술: 스마트팜과 에어로포닉스\n\n와사비 수직농업의 성공은 **스마트팜** 기술과 **에어로포닉스(Aeroponics, 공중재배)** 기술의 융합에 달려있습니다. 스마트팜은 센서, 데이터 분석, 자동 제어 시스템 등을 활용하여 작물 생육 환경을 실시간으로 모니터링하고 관리합니다. 에어로포닉스는 뿌리에 직접 영양액을 분무하는 방식으로, 토양 없이 작물을 재배하는 혁신적인 기술입니다. 이러한 기술들은 와사비의 생육에 필요한 모든 요소를 최적화하여 생산성과 품질을 극대화합니다.\n\n## K-Farm: 와사비 스마트 농업의 선두주자 🚀\n\nK-Farm은 와사비 수직농업의 선두 주자로서, 혁신적인 기술과 노하우를 통해 와사비 산업의 미래를 만들어가고 있습니다.\n\n*   **바이러스 프리 종묘 (조직 배양) 🔬:** K-Farm은 유전적으로 우수하고 병원균이 없는 와사비 종묘를 생산합니다. 이는 건강하고 빠르게 성장하는 와사비 재배의 핵심입니다.\n\n*   **하이퍼 사이클 에어로포닉스:** K-Farm의 독자적인 에어로포닉스 시스템은 와사비 재배 기간을 9개월로 단축합니다. (전통적인 토양 재배 방식은 18-24개월 소요) 이로 인해 생산 효율성을 획기적으로 높일 수 있습니다.\n\n*   **데이터 기반 품질 관리:** K-Farm은 EC, pH, 조명 (PPFD) 등을 정밀하게 제어하여 와사비의 매운맛을 결정하는 핵심 성분인 Allyl Isothiocyanate (알릴 이소티오시아네이트) 함량을 극대화합니다.\n\n## 결론: 와사비 스마트 농업의 미래, K-Farm과 함께 🌱\n\n와사비 수직농업은 지속 가능한 농업의 미래를 제시합니다. K-Farm은 혁신적인 기술과 데이터 기반의 정밀한 관리를 통해 와사비 산업의 새로운 가능성을 열어가고 있습니다. 와사비 스마트 농업에 대한 투자 및 협력 문의를 환영합니다. K-Farm과 함께 와사비 산업의 밝은 미래를 만들어 갑시다! **지금 바로 문의하세요!**\n",
        "topic": "수직농업에서의 와사비 이점",
        "keywords": "smart farm, aeroponics, innovation",
        "tags": ["smart farm", "aeroponics", "innovation"],
        "author": "AI Writer",
        "image": "/images/blog/stock_leaf.png",
        "id": 1766919908100,
        "slug": "wasabi-smart-farm-intro",
        "timestamp": "2025-12-28T11:05:08.100Z",
        "category": "Company Blog"
    }
];

async function readDb(filename: string): Promise<any[]> {
    if (IS_VERCEL) {
        try {
            await ensureDataDir();

            // 1. Try reading from /tmp (writable, newest data)
            const tmpPath = pathLib.join(TMP_DATA_PATH, filename);
            try {
                const data = await fsp.readFile(tmpPath, 'utf-8');
                return JSON.parse(data);
            } catch (e) {
                // 2. Fallback: Try reading from build output (read-only seed data)
                const buildPath = pathLib.join(BUILD_DATA_PATH, filename);
                try {
                    const data = await fsp.readFile(buildPath, 'utf-8');
                    // Copy to /tmp for future writes
                    await fsp.writeFile(tmpPath, data);
                    return JSON.parse(data);
                } catch (err) {
                    console.log(`[ReadDb] Not found in build path either: ${filename}`);
                    // 🔥 ULTIMATE FALLBACK: Return hardcoded data if all else fails
                    if (filename === 'posts.json') return FALLBACK_POSTS;
                    return [];
                }
            }
        } catch (error) {
            console.error(`[ReadDb] Error:`, error);
            // 🔥 ULTIMATE FALLBACK
            if (filename === 'posts.json') return FALLBACK_POSTS;
            return [];
        }
    } else {
        // Local
        try {
            await ensureDataDir();
            const filePath = pathLib.join(BUILD_DATA_PATH, filename);
            const fileContent = await fsp.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (e) {
            console.error('[Error] readDb failed:', e);
            // Local fallback too, just in case
            if (filename === 'posts.json') return FALLBACK_POSTS;
            return [];
        }
    }
}

async function writeDb(filename: string, data: any[]) {
    if (IS_VERCEL) {
        try {
            await ensureDataDir();
            // Always write to /tmp as it is the only writable place
            const tmpPath = pathLib.join(TMP_DATA_PATH, filename);
            await fsp.writeFile(tmpPath, JSON.stringify(data, null, 2));
            return { success: true };
        } catch (error) {
            console.error(`[WriteDb] Error:`, error);
            return { success: false, warning: 'Save failed (FS Error)' };
        }
    } else {
        // Local
        try {
            await ensureDataDir();
            const filePath = pathLib.join(BUILD_DATA_PATH, filename);
            await fsp.writeFile(filePath, JSON.stringify(data, null, 2));

            if (filename === 'hunter.json') {
                revalidatePath('/admin/hunter');
                revalidatePath('/admin');
            }
            return { success: true };
        } catch (error) {
            console.error('File write failed:', error);
            return { success: true, warning: 'Save failed (FS Error)' };
        }
    }
}

// --- Action Implementations ---

export async function saveContactInquiry(data: any) {
    const currentData = await readDb('contacts.json');
    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);
    return await writeDb('contacts.json', currentData);
}

export async function getContactInquiries() {
    return await readDb('contacts.json');
}

export async function saveConsultingInquiry(data: any) {
    const currentData = await readDb('consulting.json');
    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);
    return await writeDb('consulting.json', currentData);
}

export async function getConsultingInquiries() {
    return await readDb('consulting.json');
}

export async function saveHunterResult(data: any) {
    const currentData = await readDb('hunter.json');

    // Check for duplicates
    const exists = currentData.some((item: any) => item.name === data.name);
    if (exists) {
        return { success: false, message: 'Already exists in your list.' };
    }

    const newEntry = {
        ...data,
        status: 'New',
        addedAt: new Date().toISOString(),
    };

    currentData.push(newEntry);
    return await writeDb('hunter.json', currentData);
}

export async function getHunterResults() {
    return await readDb('hunter.json');
}

export async function updateHunterStatus(id: number, status: string) {
    const currentData = await readDb('hunter.json');
    const index = currentData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
        currentData[index].status = status;
        currentData[index].lastContacted = new Date().toISOString();
        await writeDb('hunter.json', currentData);
        // Revalidate paths after updating status, especially for Vercel Blob storage
        revalidatePath('/admin/hunter');
        revalidatePath('/admin');
        return { success: true };
    }
    return { success: false };
}

export async function updateHunterInfo(id: number, data: any) {
    const currentData = await readDb('hunter.json');
    const index = currentData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
        currentData[index] = { ...currentData[index], ...data };
        await writeDb('hunter.json', currentData);
        return { success: true };
    }
    // ... existing code ...
    return { success: false };
}

export async function deleteHunterResult(id: number) {
    const currentData = await readDb('hunter.json');
    const newData = currentData.filter((item: any) => item.id !== id);
    if (newData.length !== currentData.length) {
        await writeDb('hunter.json', newData);
        revalidatePath('/admin/hunter');
        revalidatePath('/admin');
        return { success: true };
    }
    return { success: false, message: 'Item not found' };
}

// Dashboard Stats (uses helpers)
// ...
export async function getDashboardStats() {
    const hunterData = await getHunterResults();
    const contactData = await getContactInquiries();
    const consultingData = await getConsultingInquiries();

    const statusCounts = hunterData.reduce((acc: any, curr: any) => {
        const status = curr.status || 'New';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const recentInquiries = [...contactData, ...consultingData]
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
        .map((item: any) => ({
            ...item,
            type: item.category || (item.companyName ? 'Consulting' : 'General'),
            subject: item.subject || 'Consulting Request'
        }));

    const categoryCounts: Record<string, number> = {
        'Product Inquiry': 0, 'Partnership': 0, 'Farm Visit': 0, 'Investment': 0, 'Other': 0,
        'Consulting': consultingData.length
    };

    contactData.forEach((item: any) => {
        const cat = item.category || 'Other';
        if (categoryCounts[cat] !== undefined) categoryCounts[cat]++;
        else categoryCounts['Other']++;
    });

    return {
        pipeline: { total: hunterData.length, statusCounts },
        inquiries: { total: contactData.length + consultingData.length, categoryCounts, recent: recentInquiries }
    };
}


// Blog & Video Scripts also use JSON
export async function saveBlogPost(data: any) {
    console.log('[Debug] Saving Blog Post...');
    const currentData = await readDb('posts.json');
    console.log('[Debug] Current Posts Count:', currentData.length);

    // Generate slug: try English conversion, fallback to timestamp if empty
    let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // If slug became empty (e.g. fully Korean title), use timestamp or ID
    if (!slug || slug.length < 3) {
        slug = `post-${Date.now()}`;
    }

    const newEntry = {
        ...data,
        id: Date.now(),
        slug: slug,
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);

    console.log('[Debug] New Posts Count:', currentData.length);
    await writeDb('posts.json', currentData);

    revalidatePath('/admin/blog');
    revalidatePath('/blog');

    return { success: true, slug };
}

export async function getBlogPosts() {
    const data = await readDb('posts.json');
    return data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getBlogPost(slug: string) {
    const data = await readDb('posts.json');
    return data.find((p: any) => p.slug === slug) || null;
}

export async function saveVideoScript(data: any) {
    const currentData = await readDb('scripts.json');
    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };
    currentData.push(newEntry);
    await writeDb('scripts.json', currentData);
    return { success: true, id: newEntry.id };
}

export async function getVideoScripts() {
    const data = await readDb('scripts.json');
    return data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}


// Image Upload needs special handling
export async function saveAnimatorImage(base64Data: string, fileName: string) {
    if (IS_VERCEL) {
        try {
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return { success: false, warning: 'No Blob Token' };
            }
            const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(data, 'base64');
            const finalFileName = `uploads / ${Date.now()} -${fileName} `;

            const blob = await put(finalFileName, buffer, { access: 'public', addRandomSuffix: false });

            return { success: true, path: blob.url, localPath: blob.url };
        } catch (error) {
            console.error('Blob image save failed:', error);
            return { success: false };
        }
    } else {
        // Local
        try {
            await ensureDataDir();
            const uploadDir = pathLib.join(BUILD_DATA_PATH, 'uploads');
            try { await fsp.access(uploadDir); } catch { await fsp.mkdir(uploadDir, { recursive: true }); }

            const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(data, 'base64');
            const finalFileName = `${Date.now()}-${fileName}`;
            const filePath = pathLib.join(uploadDir, finalFileName);

            await fsp.writeFile(filePath, buffer);
            return { success: true, path: `/api/uploads/${finalFileName}`, localPath: filePath };
        } catch (error) {
            console.error('Image save failed:', error);
            return { success: false };
        }
    }
}

// Mock Data based on real research
const MOCK_DATA = [
    { id: 101, name: 'Korea Smart Farm R&D Foundation', type: 'Foundation', relevance: 'High (Core Technology R&D)', contact: 'Office', phone: '044-559-5623', url: 'http://www.kosfarm.re.kr', country: 'KR' },
    { id: 102, name: 'Gyeongsang National University - Smart Farm Research Center', type: 'University', relevance: 'High (Livestock & Horticulture)', contact: 'Admin', phone: '055-772-1807', url: 'https://www.gnu.ac.kr', country: 'KR' },
    { id: 103, name: 'KIST Gangneung Natural Products Institute', type: 'Research Institute', relevance: 'High (Functional Plant Production)', contact: 'Admin', phone: '02-958-5114', url: 'https://gn.kist.re.kr', country: 'KR' },
    { id: 104, name: 'Daedong Seoul R&D Center', type: 'Company (R&D)', relevance: 'Medium (Agri-Machinery)', contact: 'Office', phone: '02-3486-9600', url: 'https://www.daedong-kioti.com', country: 'KR' },
    { id: 105, name: 'Green Plus Co., Ltd.', type: 'Company', relevance: 'High (Greenhouse Construction)', contact: 'HQ', phone: '041-332-6421', url: 'http://www.greenplus.co.kr', country: 'KR' },
    { id: 106, name: 'Woodeumji Farm (WDG)', type: 'Company', relevance: 'High (Semi-closed Greenhouse)', contact: 'Sales', phone: '041-835-3006', url: 'http://www.wdgfarm.com', country: 'KR' },
    { id: 107, name: 'N.THING', type: 'Startup', relevance: 'High (Modular Vertical Farm)', contact: 'Biz Dev', phone: '-', url: 'https://nthing.net', country: 'KR' },
    { id: 108, name: 'Green Labs', type: 'Startup', relevance: 'Medium (Farm Management Cloud)', contact: 'Support', phone: '1644-7901', url: 'https://greenlabs.co.kr', country: 'KR' },
    { id: 109, name: 'ioCrops Inc.', type: 'Startup', relevance: 'High (AI Crop Management)', contact: 'Team', phone: '-', url: 'https://iocrops.com', country: 'KR' },
    { id: 110, name: 'Farmbot Co.', type: 'Company', relevance: 'Medium (ICT Agriculture)', contact: 'Office', phone: '02-6203-2692', url: 'http://www.farm-bot.co.kr', country: 'KR' },
    { id: 111, name: 'Hankyong National University - AI Smart Farm', type: 'University', relevance: 'Medium (Education)', contact: 'Admin', phone: '031-670-5114', url: 'https://www.hknu.ac.kr', country: 'KR' },
    { id: 112, name: 'Yeonam University', type: 'University', relevance: 'Medium (Professional Training)', contact: 'Office', phone: '041-580-1114', url: 'https://www.yonam.ac.kr', country: 'KR' },
    { id: 113, name: 'Rural Development Administration (RDA)', type: 'Government', relevance: 'High (Policy & Funding)', contact: 'Public Relations', phone: '063-238-1000', url: 'https://www.rda.go.kr', country: 'KR' },
    { id: 114, name: 'Smart Farm Korea (Agency)', type: 'Government Agency', relevance: 'High (Information Hub)', contact: 'Helpdesk', phone: '1522-2911', url: 'https://www.smartfarmkorea.net', country: 'KR' },
    { id: 115, name: 'GSF SYSTEM', type: 'Company', relevance: 'Medium (Hydroponic Solutions)', contact: 'Sales', phone: '-', url: 'http://gsfsystem.com', country: 'KR' },
    { id: 201, name: 'Kubota Corporation', type: 'Company', relevance: 'High (Global Machinery)', contact: 'Global Sales', phone: '+81-6-6648-2111', url: 'https://www.kubota.com', country: 'JP' },
    { id: 202, name: 'Plenty', type: 'Startup', relevance: 'High (Vertical Farming)', contact: 'Partnerships', phone: '-', url: 'https://www.plenty.ag', country: 'US' },
    { id: 203, name: 'AeroFarms', type: 'Startup', relevance: 'High (Aeroponics)', contact: 'Biz Dev', phone: '+1-973-242-2495', url: 'https://www.aerofarms.com', country: 'US' }
];

export async function searchPartners(keyword: string, page: number = 1, country: string = 'KR') {
    // 1. Check for Real API Key
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_CX;

    // Pagination: Google API uses 'start' (1, 11, 21...)
    const start = (page - 1) * 10 + 1;

    if (apiKey && cx) {
        try {
            // Add 'gl' (geolocation) parameter for country restriction ONLY if specific country selected
            // If country is empty string (Global), we do NOT send gl param
            const glParam = country ? `&gl=${country}` : '';
            const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&start=${start}${glParam}`);
            const data = await res.json();

            if (data.items) {
                // Regex for extracting simple info from snippets
                // Updated Phone Regex: Supports +82, +1, +81, (0xx), etc.
                const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
                const emailRegex = /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

                return data.items.map((item: any, index: number) => {
                    const snippet = item.snippet || '';

                    // Extract Phone
                    const phoneMatch = snippet.match(phoneRegex);
                    const phone = phoneMatch ? phoneMatch[0] : '-';

                    // Extract Email or Contact
                    const emailMatch = snippet.match(emailRegex);
                    const contact = emailMatch ? emailMatch[0] : '-';

                    return {
                        id: Date.now() + index, // Ensure unique key
                        name: item.title,
                        type: 'Web Result',
                        relevance: snippet.length > 50 ? snippet.substring(0, 60) + '...' : 'Relevant Search Result',
                        contact: contact,
                        phone: phone,
                        url: item.link,
                        country: country // Pass through the country
                    };
                });
            } else {
                console.log('Google Search API returned no items:', data);
            }
        } catch (error) {
            console.error("Google Search API Error:", error);
            // Fallback to mock data on error handled below
        }
    } else {
        console.log('Google Search API keys missing or incomplete');
    }

    // 2. Simulation Mode (Mock Data)
    const lowerKeyword = keyword.toLowerCase();

    // Filter by Country then Keyword
    const filtered = MOCK_DATA.filter(item => {
        const countryMatch = country === 'Global' || item.country === country;
        const keywordMatch = item.name.toLowerCase().includes(lowerKeyword) ||
            item.type.toLowerCase().includes(lowerKeyword) ||
            item.relevance.toLowerCase().includes(lowerKeyword);
        return countryMatch && keywordMatch;
    });

    // If no match/empty keyword but country matches, return random subset from that country
    let results = filtered;
    if (filtered.length === 0 && keyword.trim() === '') {
        results = MOCK_DATA.filter(item => country === 'Global' || item.country === country);
    } else if (filtered.length === 0) {
        // Return nothing if keyword specifically didn't match
        results = [];
    }

    // Pagination for Mock Data (Simple Slice)
    const startIndex = (page - 1) * 5;
    const paginatedResults = results.slice(startIndex, startIndex + 5);

    // Add isMock flag
    return paginatedResults.map(item => ({ ...item, isMock: true }));
}
