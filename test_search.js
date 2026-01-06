const { searchPartners } = require('./lib/actions');

async function test() {
    console.log("Testing searchPartners with empty keyword and Global country...");
    try {
        const results = await searchPartners('', 1, '');
        console.log(`Results found: ${results.length}`);
        if (results.length > 0) {
            console.log("First item:", results[0].name);
        } else {
            console.log("No results found. Mock data might be failing.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
