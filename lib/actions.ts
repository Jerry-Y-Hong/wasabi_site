'use server';

import { promises as fsp } from 'fs';
import pathLib from 'path';

const DB_PATH = pathLib.join(process.cwd(), 'data');

async function ensureDataDir() {
    try {
        await fsp.access(DB_PATH);
    } catch {
        await fsp.mkdir(DB_PATH, { recursive: true });
    }
}

export async function saveContactInquiry(data: any) {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'contacts.json');
    let currentData = [];
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        currentData = JSON.parse(fileContent);
    } catch (e) {
        // File doesn't exist yet
    }

    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };

    currentData.push(newEntry);
    await fsp.writeFile(filePath, JSON.stringify(currentData, null, 2));
    return { success: true };
}

export async function getContactInquiries() {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'contacts.json');
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

export async function saveConsultingInquiry(data: any) {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'consulting.json');
    let currentData = [];
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        currentData = JSON.parse(fileContent);
    } catch (e) {
        // File doesn't exist yet
    }

    const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
    };

    currentData.push(newEntry);
    await fsp.writeFile(filePath, JSON.stringify(currentData, null, 2));
    return { success: true };
}

export async function getConsultingInquiries() {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'consulting.json');
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

export async function saveHunterResult(data: any) {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'hunter.json');
    let currentData = [];
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        currentData = JSON.parse(fileContent);
    } catch (e) {
        // File doesn't exist yet
    }

    // Check for duplicates based on name
    const exists = currentData.some((item: any) => item.name === data.name);
    if (exists) {
        return { success: false, message: 'Already exists in your list.' };
    }

    const newEntry = {
        ...data,
        status: 'New', // Default status
        addedAt: new Date().toISOString(),
    };

    currentData.push(newEntry);
    await fsp.writeFile(filePath, JSON.stringify(currentData, null, 2));
    return { success: true };
}

export async function getHunterResults() {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'hunter.json');
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (e) {
        return [];
    }
}

export async function updateHunterStatus(id: number, status: string) {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'hunter.json');
    let currentData = [];
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        currentData = JSON.parse(fileContent);
    } catch (e) {
        return { success: false };
    }

    const index = currentData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
        currentData[index].status = status;
        currentData[index].lastContacted = new Date().toISOString();
        await fsp.writeFile(filePath, JSON.stringify(currentData, null, 2));
        return { success: true };
    }
    return { success: false };
}

export async function updateHunterInfo(id: number, data: any) {
    await ensureDataDir();
    const filePath = pathLib.join(DB_PATH, 'hunter.json');
    let currentData = [];
    try {
        const fileContent = await fsp.readFile(filePath, 'utf-8');
        currentData = JSON.parse(fileContent);
    } catch (e) {
        return { success: false };
    }

    const index = currentData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
        currentData[index] = { ...currentData[index], ...data };
        await fsp.writeFile(filePath, JSON.stringify(currentData, null, 2));
        return { success: true };
    }
    return { success: false };
}

export async function getDashboardStats() {
    const hunterData = await getHunterResults();
    const contactData = await getContactInquiries();
    const consultingData = await getConsultingInquiries();

    const statusCounts = hunterData.reduce((acc: any, curr: any) => {
        const status = curr.status || 'New';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // Recent 5 activities (combine contact and consulting)
    const recentInquiries = [
        ...contactData.map((d: any) => ({ ...d, type: 'General', title: d.subject })),
        ...consultingData.map((d: any) => ({ ...d, type: 'Consulting', title: `${d.landSize} pyeong / ${d.consultingType}` }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

    return {
        pipeline: {
            total: hunterData.length,
            statusCounts
        },
        inquiries: {
            total: contactData.length + consultingData.length,
            recent: recentInquiries
        }
    };
}

// Mock Data based on real research
const MOCK_DATA = [
    { id: 101, name: 'Korea Smart Farm R&D Foundation', type: 'Foundation', relevance: 'High (Core Technology R&D)', contact: 'Office', phone: '044-559-5623', url: 'http://www.kosfarm.re.kr' },
    { id: 102, name: 'Gyeongsang National University - Smart Farm Research Center', type: 'University', relevance: 'High (Livestock & Horticulture)', contact: 'Admin', phone: '055-772-1807', url: 'https://www.gnu.ac.kr' },
    { id: 103, name: 'KIST Gangneung Natural Products Institute', type: 'Research Institute', relevance: 'High (Functional Plant Production)', contact: 'Admin', phone: '02-958-5114', url: 'https://gn.kist.re.kr' },
    { id: 104, name: 'Daedong Seoul R&D Center', type: 'Company (R&D)', relevance: 'Medium (Agri-Machinery)', contact: 'Office', phone: '02-3486-9600', url: 'https://www.daedong-kioti.com' },
    { id: 105, name: 'Green Plus Co., Ltd.', type: 'Company', relevance: 'High (Greenhouse Construction)', contact: 'HQ', phone: '041-332-6421', url: 'http://www.greenplus.co.kr' },
    { id: 106, name: 'Woodeumji Farm (WDG)', type: 'Company', relevance: 'High (Semi-closed Greenhouse)', contact: 'Sales', phone: '041-835-3006', url: 'http://www.wdgfarm.com' },
    { id: 107, name: 'N.THING', type: 'Startup', relevance: 'High (Modular Vertical Farm)', contact: 'Biz Dev', phone: '-', url: 'https://nthing.net' },
    { id: 108, name: 'Green Labs', type: 'Startup', relevance: 'Medium (Farm Management Cloud)', contact: 'Support', phone: '1644-7901', url: 'https://greenlabs.co.kr' },
    { id: 109, name: 'ioCrops Inc.', type: 'Startup', relevance: 'High (AI Crop Management)', contact: 'Team', phone: '-', url: 'https://iocrops.com' },
    { id: 110, name: 'Farmbot Co.', type: 'Company', relevance: 'Medium (ICT Agriculture)', contact: 'Office', phone: '02-6203-2692', url: 'http://www.farm-bot.co.kr' },
    { id: 111, name: 'Hankyong National University - AI Smart Farm', type: 'University', relevance: 'Medium (Education)', contact: 'Admin', phone: '031-670-5114', url: 'https://www.hknu.ac.kr' },
    { id: 112, name: 'Yeonam University', type: 'University', relevance: 'Medium (Professional Training)', contact: 'Office', phone: '041-580-1114', url: 'https://www.yonam.ac.kr' },
    { id: 113, name: 'Rural Development Administration (RDA)', type: 'Government', relevance: 'High (Policy & Funding)', contact: 'Public Relations', phone: '063-238-1000', url: 'https://www.rda.go.kr' },
    { id: 114, name: 'Smart Farm Korea (Agency)', type: 'Government Agency', relevance: 'High (Information Hub)', contact: 'Helpdesk', phone: '1522-2911', url: 'https://www.smartfarmkorea.net' },
    { id: 115, name: 'GSF SYSTEM', type: 'Company', relevance: 'Medium (Hydroponic Solutions)', contact: 'Sales', phone: '-', url: 'http://gsfsystem.com' }
];

export async function searchPartners(keyword: string, page: number = 1) {
    // 1. Check for Real API Key
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_CX;

    // Pagination: Google API uses 'start' (1, 11, 21...)
    const start = (page - 1) * 10 + 1;

    if (apiKey && cx) {
        try {
            const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&start=${start}`);
            const data = await res.json();

            if (data.items) {
                // Regex for extracting simple info from snippets
                const phoneRegex = /(\+82|0)(\d{1,2})[- ]?(\d{3,4})[- ]?(\d{4})/g;
                const emailRegex = /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

                return data.items.map((item: any, index: number) => {
                    const snippet = item.snippet || '';

                    // Extract Phone
                    const phoneMatch = snippet.match(phoneRegex);
                    const phone = phoneMatch ? phoneMatch[0] : '-';

                    // Extract Email or Contact
                    const emailMatch = snippet.match(emailRegex);
                    const contact = emailMatch ? emailMatch[0] : (item.displayLink || 'Visit Website');

                    return {
                        id: Date.now() + index, // Ensure unique key
                        name: item.title,
                        type: 'Web Result',
                        relevance: snippet.length > 50 ? snippet.substring(0, 60) + '...' : 'Relevant Search Result',
                        contact: contact,
                        phone: phone,
                        url: item.link
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
    const filtered = MOCK_DATA.filter(item =>
        item.name.toLowerCase().includes(lowerKeyword) ||
        item.type.toLowerCase().includes(lowerKeyword) ||
        item.relevance.toLowerCase().includes(lowerKeyword)
    );

    // If no match/empty keyword, return random subset
    let results = filtered;
    if (filtered.length === 0) {
        // Return random 5 items, simulating different pages
        const shuffled = [...MOCK_DATA].sort(() => 0.5 - Math.random());
        results = shuffled.slice(0, 5);
    }

    // Add isMock flag
    return results.map(item => ({ ...item, isMock: true }));
}
