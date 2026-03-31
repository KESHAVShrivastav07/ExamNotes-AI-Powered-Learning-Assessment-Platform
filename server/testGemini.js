import dotenv from 'dotenv';
dotenv.config();

const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const key = process.env.GEMINI_API_KEY;

console.log("Using API Key:", key ? (key.substring(0, 6) + "...") : "UNDEFINED");

async function test() {
    try {
        console.log("Sending request to Gemini...");
        const response = await fetch(`${Gemini_URL}?key=${key}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello, respond with 'Ok'" }] }]
            })
        });

        console.log("Response Status:", response.status);
        const data = await response.json();
        console.log("Response Data:", JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log("✅ API is working correctly!");
        } else {
            console.log("❌ API returned an error.");
        }
    } catch (error) {
        console.error("❌ Fetch failed error details:", error);
    }
}

test();
