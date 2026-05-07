"use server";

import { revalidatePath } from "next/cache";
import { getClientsForUi } from "@/lib/clients";
import { getLeadsForUi } from "@/lib/leads";
import { createContentItem, type ContentPlatform } from "@/lib/content";
import { getClientsForContentGen } from "@/lib/clients";

// ── Ollama API call ───────────────────────────────────────────────────────────
// Uses Ollama's OpenAI-compatible endpoint running locally on port 11434

type OllamaChatResponse = {
  message: { content: string };
};

async function callOllama(prompt: string, model: string = "llama3.2"): Promise<string> {
  const url = "http://localhost:11434/api/chat";

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        options: { temperature: 0.7, num_predict: 1024 }
      })
    });
  } catch {
    throw new Error(
      "Cannot connect to Ollama. Make sure Ollama is running — open a terminal and run: ollama serve"
    );
  }

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 404) {
      const modelHint = model === "llama3.2"
        ? 'Run: ollama pull llama3.2'
        : `Run: ollama pull ${model}`;
      throw new Error(`Model "${model}" not found. ${modelHint}`);
    }
    throw new Error(`Ollama error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as OllamaChatResponse;
  return data.message?.content ?? "No response generated.";
}

// ── Action result type ────────────────────────────────────────────────────────

export type AiActionResult = {
  ok: boolean;
  output?: string;
  error?: string;
};

// ── Main action ───────────────────────────────────────────────────────────────

export async function runAiAction(formData: FormData): Promise<AiActionResult> {
  const task = String(formData.get("task") ?? "").trim();
  const model = String(formData.get("model") ?? "llama3.2").trim();
  const customPrompt = String(formData.get("customPrompt") ?? "").trim();

  let prompt = "";

  try {
    if (task === "weekly_summary") {
      const [clients, leads] = await Promise.all([getClientsForUi(), getLeadsForUi()]);
      const clientNames = clients.map((c) => `${c.name} (${c.deliveryStatus})`).join(", ");
      const leadSummary = leads
        .slice(0, 6)
        .map((l) => `${l.company} - ${l.stage} - ${l.estimatedValue}`)
        .join("\n");

      prompt = `You are a business operations assistant helping a solo service business owner prepare for their week.

Here is the current business state:
- Active clients: ${clientNames || "none yet"}
- Top leads:
${leadSummary || "No leads yet"}

Write a concise, professional weekly business summary (200-300 words) that:
1. Summarizes client delivery health
2. Highlights the top 3 lead priorities
3. Gives 2-3 specific actions the owner should take this week
4. Has an encouraging but realistic tone

Format it clearly with headers. Be specific and actionable.`;

    } else if (task === "client_email") {
      const clientName = String(formData.get("clientName") ?? "").trim();
      const emailContext = String(formData.get("emailContext") ?? "").trim();

      prompt = `You are writing a professional client email for a service business owner named Richard.

Client: ${clientName || "the client"}
Context / purpose of email: ${emailContext || "general check-in"}

Write a professional, warm, and concise client email (150-250 words) that:
- Has a clear subject line
- Gets to the point quickly
- Sounds like a confident consultant, not a vendor
- Has a clear call to action

Format: Subject line on first line, then blank line, then the email body. Output only the email, nothing else.`;

    } else if (task === "content_brief") {
      const topic = String(formData.get("topic") ?? "").trim();
      const platform = String(formData.get("platform") ?? "LinkedIn").trim();

      prompt = `You are a content strategist helping a solo service business owner create compelling content.

Topic: ${topic || "business operations and AI"}
Platform: ${platform}

Write a content brief (200-300 words) that includes:
1. A punchy working headline (3 options)
2. The core hook/angle (1 sentence)
3. Key points to cover (3-5 bullet points)
4. A strong call to action
5. Tone guidance

Make it specific, actionable, and suited to ${platform}'s format and audience. Output only the brief.`;

    } else if (task === "custom" && customPrompt) {
      prompt = customPrompt;

    } else {
      return { ok: false, error: "Select a task or enter a custom prompt." };
    }

    const output = await callOllama(prompt, model);
    return { ok: true, output };

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

// ── Batch content generation ──────────────────────────────────────────────────

export type GeneratePostsResult = {
  ok: boolean;
  count?: number;
  error?: string;
};

export async function generateClientPostsAction(formData: FormData): Promise<GeneratePostsResult> {
  const clientName   = String(formData.get("clientName")   ?? "").trim();
  const niche        = String(formData.get("niche")         ?? "").trim();
  const audience     = String(formData.get("audience")      ?? "").trim();
  const platform     = String(formData.get("platform")      ?? "LinkedIn").trim() as ContentPlatform;
  const model        = String(formData.get("model")         ?? "llama3.2").trim();
  const owner        = String(formData.get("owner")         ?? "Richard").trim();
  const isVideo      = formData.get("isVideo") === "true";
  const videoTopic   = String(formData.get("videoTopic")    ?? "").trim();

  if (!clientName || !niche || !audience || (isVideo && !videoTopic)) {
    return { ok: false, error: "Missing required fields." };
  }

  if (isVideo) {
    try {
      const { processVideoWithGemini } = await import("@/lib/gemini");
      const clientContext = `${clientName} | ${niche} | ${audience}`;
      const raw = await processVideoWithGemini(videoTopic, platform, clientContext);

      // Parse the posts
      let posts: string[] = [];
      if (raw.includes("---POST---")) {
        posts = raw.split("---POST---").map(p => p.trim()).filter(Boolean);
      } else {
        posts = raw.split(/\n(?=\d{1,2}[.)]\s)/).map(p => p.trim()).filter(Boolean);
      }
      posts = posts.map(p => p.replace(/^\d{1,2}[.)]\s+/, "").trim()).filter(p => p.length > 10).slice(0, 6);

      if (posts.length === 0) return { ok: false, error: "Gemini didn't return parseable outputs." };

      for (const postText of posts) {
        await createContentItem({
          title: postText.slice(0, 80) + (postText.length > 80 ? "…" : ""),
          platform,
          client: clientName,
          owner,
          scheduledAt: null,
          notes: postText
        });
      }

      revalidatePath("/content");
      revalidatePath("/ai");
      return { ok: true, count: posts.length };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }

  const prompt = `You are a professional social media content strategist. Your job is to write 12 engaging ${platform} posts for a client.

Client business: ${clientName}
Industry / niche: ${niche}
Target audience: ${audience}

Rules:
- Write exactly 12 posts, numbered 1 through 12
- Each post must be complete and ready to publish — no placeholders
- Mix content types: educational tips (4), storytelling/behind-the-scenes (3), social proof/results (2), direct offers/CTAs (2), trending opinion (1)
- Keep each post concise and punchy — optimized for ${platform}
- Do NOT add hashtags or emojis unless they feel natural
- Separate each post with a line that says exactly: ---POST---

Output format:
1. [post text here]
---POST---
2. [post text here]
---POST---
(continue for all 12)`;

  try {
    const raw = await callOllama(prompt, model);

    // Parse the posts — split by ---POST--- or numbered lines
    let posts: string[] = [];

    if (raw.includes("---POST---")) {
      posts = raw.split("---POST---").map(p => p.trim()).filter(Boolean);
    } else {
      // Fallback: split by numbered lines like "1." or "1)"
      posts = raw.split(/\n(?=\d{1,2}[.)]\s)/).map(p => p.trim()).filter(Boolean);
    }

    // Strip leading number like "1. " or "1) "
    posts = posts.map(p => p.replace(/^\d{1,2}[.)]\s+/, "").trim()).filter(p => p.length > 10);

    // Cap at 12
    posts = posts.slice(0, 12);

    if (posts.length === 0) {
      return { ok: false, error: "AI didn't return parseable outputs. Try again." };
    }

    // Save each post to the content pipeline
    for (const postText of posts) {
      await createContentItem({
        title: postText.slice(0, 80) + (postText.length > 80 ? "…" : ""),
        platform,
        client: clientName,
        owner,
        scheduledAt: null,
        notes: postText  // full text stored in notes
      });
    }

    revalidatePath("/content");
    revalidatePath("/ai");

    return { ok: true, count: posts.length };

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}

// ── Get saved clients for the content gen dropdown ────────────────────────────

export async function getContentClients() {
  return getClientsForContentGen();
}
