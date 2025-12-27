const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.argv[2];
if (!apiKey) {
    console.error("Please provide API key");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "models/veo-3.1-generate-preview" });

async function run() {
    try {
        console.log("Testing Veo API with key: " + apiKey.substring(0, 10) + "...");
        const result = await model.generateContent("Cinematic drone shot of green wasabi plants in a smart farm, 4k, photorealistic");
        const response = await result.response;
        console.log("Response:", JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Full Error:", JSON.stringify(error, null, 2));
        if (error.response) {
            console.error("Error Response:", JSON.stringify(error.response, null, 2));
        }
    }
}

run();
