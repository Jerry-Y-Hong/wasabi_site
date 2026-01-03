const fs = require('fs');
const path = 'c:/Users/car13/.gemini/antigravity/scratch/wasabi-smart-farm/data/hunter.json';
try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    let updated = 0;
    data.forEach(p => {
        if (!p.country || p.country.trim() === '') {
            p.country = 'South Korea';
            updated++;
        }
    });
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Success: Updated ${updated} records.`);
} catch (e) {
    console.error('Error:', e.message);
}
