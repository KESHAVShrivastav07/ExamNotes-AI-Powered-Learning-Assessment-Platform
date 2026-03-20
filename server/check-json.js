import dotenv from "dotenv";
import { generateGeminiResponse } from "./services/gemini.services.js";
import { buildPrompt } from "./utils/promptBuilder.js";

dotenv.config();

async function test() {
  const prompt = buildPrompt({ topic: "Quantum Computing", includeDiagram: true });
  console.log("Calling Gemini...");
  const response = await generateGeminiResponse(prompt);
  console.log("FULL JSON RESPONSE:");
  console.log(JSON.stringify(response, null, 2));
  process.exit();
}

test();
