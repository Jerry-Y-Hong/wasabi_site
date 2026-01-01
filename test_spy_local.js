const url = "http://localhost:3000/api/test-spy?url=https://www.w3.org/";
console.log("Testing Spy on:", url);

async function test() {
    try {
        const res = await fetch(url);
        const json = await res.json();
        console.log("SPY RESULT:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.error("Test Failed:", e.message);
    }
}

test();
