import axios from 'axios';

const Gemini_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

export const summarizePDF = async (text) => {
    const prompt = `
    Analyze the following text extracted from a PDF and provide a structured JSON response.
    The JSON should have these keys: "summary", "keyPoints" (array of strings), and "questions" (array of objects with "question" and "answer" keys).
    
    Text:
    ${text.substring(0, 10000)} // Limiting text to prevent token overflow
    
    Response must be ONLY valid JSON.
    `;
    
    return await generateGeminiResponse(prompt);
};

export const generateGeminiResponse = async (prompt) => {
    try {
        console.log("Generating Gemini Response for prompt length:", prompt.length);

        const response = await axios.post(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        }, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 60000 // 60 seconds
        });

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Gemini Data:", JSON.stringify(response.data));
            throw new Error("No text returned from Gemini");
        }

        const cleanText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        try {
            return JSON.parse(cleanText);
        } catch (parseError) {
            console.error("JSON Parse Error. Cleaned Text:", cleanText);
            // If it's not valid JSON, we might still want the text for legacy notes
            // but for summarizePDF it's a failure. 
            // We'll return the raw text and let the controller handle it.
            return cleanText;
        }

    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Gemini API Error Detail:", error.response.data);
            throw new Error(`Gemini API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Gemini Network Error (No Response):", error.message);
            throw new Error(`Gemini Network Error: Could not reach Gemini API. Please check your internet connection or use a VPN. Detail: ${error.message}`);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Gemini Request Error:", error.message);
            throw new Error(`Gemini Request Error: ${error.message}`);
        }
    }
}