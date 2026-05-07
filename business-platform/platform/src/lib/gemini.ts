import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function processVideoWithGemini(topicContext: string, platform: string, clientContext: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Please add it to your environment variables or .env.local file.");
  }

  const prompt = `You are a Creative Director for a short-form video agency. Your job is to analyze the video context provided and generate 6 distinct Video Short briefs for ${platform}.

Client Context: ${clientContext}
Video Topic/Context: ${topicContext}

Rules:
- Write exactly 6 Video Short briefs, numbered 1 through 6.
- For each brief, provide:
  - Theme/Category (e.g., Educational, Story, Direct Offer)
  - The Hook (first 3 seconds script)
  - Visual Idea (what should be on screen)
  - Caption text
- Separate each brief with a line that says exactly: ---POST---

Output format:
1. Theme: [Theme]
Hook: [Hook script]
Visual Idea: [Idea]
Caption: [Caption text]
---POST---
2. (continue for all 6)`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
}
