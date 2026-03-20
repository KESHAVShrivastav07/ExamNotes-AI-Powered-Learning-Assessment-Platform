import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const Gemini_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const key = process.env.GEMINI_API_KEY;

async function test() {
    try {
        console.log("Testing Gemini with Axios...");
        const response = await axios.post(`${Gemini_URL}?key=${key}`, {
            contents: [{ parts: [{ text: "Hello, respond with 'Ok'" }] }]
        }, {
            headers: { "Content-Type": "application/json" },
            timeout: 15000
        });

        console.log("Response Status:", response.status);
        console.log("✅ Axios successfully reached Gemini!");
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error("❌ Axios Timeout Error");
        } else {
            console.error("❌ Axios failed:", error.message);
            if (error.response) console.error("Response:", error.response.data);
        }
    }
}

test();
