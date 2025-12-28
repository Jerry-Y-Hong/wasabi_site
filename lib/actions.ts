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
                    return [];
                }
            }
        } catch (error) {
            console.error(`[ReadDb] Error:`, error);
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
            console.log(`[Debug] Writing to file: ${filePath}`);
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
    return { success: false };
}

// Dashboard Stats (uses helpers)
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
