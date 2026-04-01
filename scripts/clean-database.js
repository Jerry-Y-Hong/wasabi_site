const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/car13/.gemini/antigravity/scratch/wasabi-smart-farm/data/hunter.json';

// Keywords to REMOVE (Aggressive Case-Insensitive)
const spamKeywords = [
  // Cloud Storage (Wasabi Cloud)
  'cloud storage', 'hot cloud storage', 'backup', 's3 bucket', 'access key', 'bucket', 'object storage',
  'api access', 'immutable storage', 'wasabi systems', 'egress fee', 'storage regions',
  // Fashion/Color (Wasabi Color)
  'bikini', 'color', 'pink', 'washabi color', 'clothing', 'outfit', 'bathing suit', 'swimwear',
  'fashion', 'collection', 'dress', 'apparel', 'sneakers', 'shades',
  // Gambling/Spam (Korean)
  '먹튀', '토토', '카지노', '보증', '사설', '바카라', '꽁머니', '도박', '홀덤', '슬롯',
  // Information Junk
  'wikipedia', 'fandom', 'wiki', 'reddit', 'youtube.com', 'instagram.com', 'facebook.com', 'twitter.com', 'tiktok.com',
  'google search', 'relevant search result', 'untitled', 'forum', 'discussion', 'community',
  // Irrelevant Search Noise
  'wasabi sauce recipe', 'how to make wasabi', 'wasabi mayo', 'wasabi film'
];

function cleanData() {
  try {
    console.log('Reading database...');
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawContent);
    console.log(`Original count: ${data.length}`);

    const cleaned = data.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const url = (item.url || '').toLowerCase();
      const relevance = (item.relevance || '').toLowerCase();
      const report = (item.intelligenceReport || '').toLowerCase();

      const combinedText = `${name} ${url} ${relevance}`;
      
      // 1. Check if any spam keyword exists
      const isSpam = spamKeywords.some(keyword => combinedText.includes(keyword.toLowerCase()));
      
      // 2. Check if the AI report was a 404/model error (corrupted analysis)
      const isReportError = report.includes('404') || report.includes('v1beta') || report.includes('not found');

      // 3. Keep only if it's NOT spam AND it's NOT a corrupted report error (unless it's a new lead without report)
      return !isSpam && !isReportError;
    });

    console.log(`Cleaned count: ${cleaned.length}`);
    console.log(`Removed: ${data.length - cleaned.length} junk/corrupted entries.`);

    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
    console.log('Database updated successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cleanData();
