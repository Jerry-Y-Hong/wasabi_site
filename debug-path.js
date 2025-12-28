
const fs = require('fs');
const path = require('path');

const DB_PATH = 'c:\\Users\\car13\\.gemini\\antigravity\\scratch\\wasabi-smart-farm\\data';
const FILE_PATH = path.join(DB_PATH, 'hunter.json');

console.log('Checking DB_PATH:', DB_PATH);
console.log('Exists?', fs.existsSync(DB_PATH));

console.log('Checking FILE_PATH:', FILE_PATH);
console.log('Exists?', fs.existsSync(FILE_PATH));

if (fs.existsSync(FILE_PATH)) {
    try {
        const content = fs.readFileSync(FILE_PATH, 'utf-8');
        console.log('File Content Length:', content.length);
        const data = JSON.parse(content);
        console.log('JSON Parse Success. Items:', data.length);
    } catch (e) {
        console.error('Read/Parse Error:', e);
    }
} else {
    console.error('File does NOT exist!');
    // Try listing dir
    if (fs.existsSync(DB_PATH)) {
        console.log('Dir contents:', fs.readdirSync(DB_PATH));
    }
}
