import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/car13/.gemini/antigravity/scratch/wasabi-smart-farm/data/hunter.json';

// Keywords to REMOVE
const spamKeywords = [
  // IT / Cloud (Wasabi Cloud Storage is not Wasabi Farm)
  'cloud storage', 'hot cloud storage', 'backup', 's3 bucket', 'access key', 'bucket', 'object storage',
  // Fashion / Color (Wasabi as a color name)
  'bikini', 'color', 'pink', 'washabi color', 'clothing', 'outfit', 'bathing suit', 'swimwear',
  // Spam / Gambling
  '먹튀', '토토', '카지노', '보증', '사설', '바카라', '꽁머니', '도박', 'community', '커뮤니티',
  // Low quality / Generic
  'wikipedia', 'fandom', 'wiki', 'reddit', 'youtube.com', 'instagram.com', 'facebook.com', 'twitter.com', 'tiktok.com',
  'google search', 'relevant search result', 'untitled'
];

interface Lead {
  id: number;
  name: string;
  url: string;
  relevance?: string;
  [key: string]: any;
}

async function cleanData() {
  try {
    console.log('Reading database...');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Original count: ${data.length}`);

    const cleaned = data.filter((item: Lead) => {
      const targetText = `${item.name} ${item.url} ${item.relevance || ''}`.toLowerCase();
      
      // Check if any spam keyword exists
      const isSpam = spamKeywords.some(keyword => targetText.includes(keyword.toLowerCase()));
      
      return !isSpam;
    });

    console.log(`Cleaned count: ${cleaned.length}`);
    console.log(`Removed: ${data.length - cleaned.length} junk entries.`);

    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
    console.log('Database updated successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cleanData();
