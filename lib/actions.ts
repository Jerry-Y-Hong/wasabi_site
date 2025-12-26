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
