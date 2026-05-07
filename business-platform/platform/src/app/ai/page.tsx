"use client";

import { useState, useEffect } from "react";
import { runAiAction, generateClientPostsAction, getContentClients, type AiActionResult, type GeneratePostsResult } from "@/app/ai/actions";

type AiTask = "generate_posts" | "generate_video_briefs" | "weekly_summary" | "client_email" | "content_brief" | "custom";
type SavedClient = { id: string; name: string; niche: string; audience: string; platform: string };

const tasks: { id: AiTask; label: string; description: string; emoji: string; highlight?: boolean }[] = [
  {
    id: "generate_posts",
    label: "Generate 12 Posts",
    description: "Select a saved client or enter new info — AI writes a full month of posts and saves them to the Content Pipeline.",
    emoji: "⚡",
    highlight: true
  },
  {
    id: "generate_video_briefs",
    label: "Generate Video Briefs",
    description: "AI acts as Creative Director — analyzing a topic to generate 5-10 Video Short briefs (Hooks, Themes, Timestamps) saved to Pipeline.",
    emoji: "🎬",
    highlight: true
  },
  {
    id: "weekly_summary",
    label: "Weekly Briefing",
    description: "Reads your live clients & leads and writes your Monday morning game plan.",
    emoji: "📋"
  },
  {
    id: "client_email",
    label: "Client Email",
    description: "Paste context and get a polished, consultant-quality email in seconds.",
    emoji: "✉️"
  },
  {
    id: "content_brief",
    label: "Content Brief",
    description: "Turn a topic into a full content brief with headlines, hooks, and key points.",
    emoji: "✍️"
  },
  {
    id: "custom",
    label: "Custom Prompt",
    description: "Talk directly to your AI operator. Ask anything about your business.",
    emoji: "🧠"
  }
];

const MODELS = [
  { value: "llama3.2", label: "Llama 3.2 (3B) — fast" },
  { value: "llama3.1", label: "Llama 3.1 (8B) — smarter" },
  { value: "mistral", label: "Mistral 7B" },
  { value: "gemma3", label: "Gemma 3" },
];

export default function AiPage() {
  const [activeTask, setActiveTask] = useState<AiTask>("generate_posts");
  const [result, setResult] = useState<AiActionResult | null>(null);
  const [postsResult, setPostsResult] = useState<GeneratePostsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<SavedClient | null>(null);

  useEffect(() => {
    getContentClients().then(setClients);
  }, []);

  function handleClientSelect(clientId: string) {
    if (clientId === "__new__") {
      setSelectedClient(null);
      return;
    }
    const c = clients.find((cl) => cl.id === clientId);
    setSelectedClient(c ?? null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setPostsResult(null);
    const fd = new FormData(e.currentTarget);

    if (activeTask === "generate_posts" || activeTask === "generate_video_briefs") {
      const res = await generateClientPostsAction(fd); // We'll update generateClientPostsAction to handle video too
      setPostsResult(res);
      // Refresh client list in case this was a new client
      getContentClients().then(setClients);
    } else {
      fd.set("task", activeTask);
      const res = await runAiAction(fd);
      setResult(res);
    }
    setLoading(false);
  }

  const selected = tasks.find((t) => t.id === activeTask)!;

  return (
    <div className="stack">
      <header className="ai-hero">
        <div className="ai-hero-text">
          <h1>AI Brain</h1>
          <p>Your local AI operator — runs on your machine via Ollama. No API keys, no quotas, no internet required.</p>
        </div>
        <div className="ai-badge"><span>🦙</span><span>Powered by Ollama (local)</span></div>
      </header>

      <div className="ai-layout">
        <aside className="ai-sidebar">
          <p className="ai-sidebar-label">Choose a task</p>
          {tasks.map((task) => (
            <button key={task.id} type="button"
              className={`ai-task-btn${activeTask === task.id ? " active" : ""}${task.highlight ? " highlight" : ""}`}
              onClick={() => { setActiveTask(task.id); setResult(null); setPostsResult(null); setSelectedClient(null); }}>
              <span className="ai-task-emoji">{task.emoji}</span>
              <span className="ai-task-info"><strong>{task.label}</strong><small>{task.description}</small></span>
            </button>
          ))}
        </aside>

        <div className="ai-main">
          <form onSubmit={handleSubmit} className="ai-form panel-card">
            <h2 className="panel-title">{selected.emoji} {selected.label}</h2>
            <p className="section-copy">{selected.description}</p>

            <label className="ai-field">
              <span>Model</span>
              <select name="model" defaultValue="llama3.2">
                {MODELS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>
            </label>

            {/* ── Generate 12 posts with client dropdown ── */}
            {activeTask === "generate_posts" && (
              <>
                {clients.length > 0 && (
                  <label className="ai-field">
                    <span>Select a saved client</span>
                    <select onChange={(e) => handleClientSelect(e.target.value)} defaultValue="__new__">
                      <option value="__new__">+ Enter new client info</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}{c.niche ? ` — ${c.niche}` : ""}</option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="ai-field">
                  <span>Client business name</span>
                  <input name="clientName" placeholder="Luna Advisory" required
                    key={selectedClient?.id ?? "new-name"}
                    defaultValue={selectedClient?.name ?? ""} />
                </label>
                <label className="ai-field">
                  <span>Their industry / niche</span>
                  <input name="niche" placeholder="B2B financial consulting for startups" required
                    key={(selectedClient?.id ?? "new") + "-niche"}
                    defaultValue={selectedClient?.niche ?? ""} />
                </label>
                <label className="ai-field">
                  <span>Their target audience</span>
                  <input name="audience" placeholder="Seed-stage startup founders, ages 28-45" required
                    key={(selectedClient?.id ?? "new") + "-aud"}
                    defaultValue={selectedClient?.audience ?? ""} />
                </label>
                <label className="ai-field">
                  <span>Platform</span>
                  <select name="platform"
                    key={(selectedClient?.id ?? "new") + "-plat"}
                    defaultValue={selectedClient?.platform ?? "LinkedIn"}>
                    <option>LinkedIn</option>
                    <option>Twitter/X</option>
                    <option>Instagram</option>
                    <option>Newsletter</option>
                  </select>
                </label>
                <label className="ai-field">
                  <span>Your name (content owner)</span>
                  <input name="owner" defaultValue="Richard" />
                </label>
                <div className="ai-notice">
                  <span>⚡</span>
                  <p>
                    {selectedClient
                      ? `Auto-filled from saved client "${selectedClient.name}". Just click Generate.`
                      : "AI will write 12 complete posts and save them to your Content Pipeline. Takes 30–90 seconds."}
                  </p>
                </div>
              </>
            )}

            {/* ── Generate Video Briefs ── */}
            {activeTask === "generate_video_briefs" && (
              <>
                {clients.length > 0 && (
                  <label className="ai-field">
                    <span>Select a saved client</span>
                    <select onChange={(e) => handleClientSelect(e.target.value)} defaultValue="__new__">
                      <option value="__new__">+ Enter new client info</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}{c.niche ? ` — ${c.niche}` : ""}</option>
                      ))}
                    </select>
                  </label>
                )}
                <input type="hidden" name="isVideo" value="true" />
                <label className="ai-field">
                  <span>Client business name</span>
                  <input name="clientName" placeholder="Luna Advisory" required
                    key={selectedClient?.id ?? "new-name"}
                    defaultValue={selectedClient?.name ?? ""} />
                </label>
                <label className="ai-field">
                  <span>Their industry / niche</span>
                  <input name="niche" placeholder="B2B financial consulting for startups" required
                    key={(selectedClient?.id ?? "new") + "-niche"}
                    defaultValue={selectedClient?.niche ?? ""} />
                </label>
                <label className="ai-field">
                  <span>Their target audience</span>
                  <input name="audience" placeholder="Seed-stage startup founders, ages 28-45" required
                    key={(selectedClient?.id ?? "new") + "-aud"}
                    defaultValue={selectedClient?.audience ?? ""} />
                </label>
                <label className="ai-field">
                  <span>Raw Video Context / Topic</span>
                  <textarea name="videoTopic" rows={3} placeholder="Describe the raw video, provide a link, or paste a rough transcript..." required />
                </label>
                <label className="ai-field">
                  <span>Platform</span>
                  <select name="platform"
                    key={(selectedClient?.id ?? "new") + "-plat"}
                    defaultValue="YouTube">
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Instagram</option>
                  </select>
                </label>
                <label className="ai-field">
                  <span>Your name (content owner)</span>
                  <input name="owner" defaultValue="Richard" />
                </label>
                <div className="ai-notice">
                  <span>🎬</span>
                  <p>AI will analyze the topic and generate 5-10 distinct Video Short scripts/briefs to your Pipeline.</p>
                </div>
              </>
            )}

            {activeTask === "client_email" && (
              <>
                <label className="ai-field"><span>Client name</span><input name="clientName" placeholder="Luna Advisory" /></label>
                <label className="ai-field"><span>Email purpose / context</span><textarea name="emailContext" rows={3} placeholder="Checking in on deliverables. They asked about the Q2 report timeline." /></label>
              </>
            )}

            {activeTask === "content_brief" && (
              <>
                <label className="ai-field"><span>Topic</span><input name="topic" placeholder="How AI is changing how solo consultants manage operations" /></label>
                <label className="ai-field"><span>Platform</span>
                  <select name="platform" defaultValue="LinkedIn">
                    <option>LinkedIn</option><option>Twitter/X</option><option>Newsletter</option><option>Blog</option><option>Instagram</option><option>YouTube</option>
                  </select>
                </label>
              </>
            )}

            {activeTask === "custom" && (
              <label className="ai-field"><span>Your prompt</span><textarea name="customPrompt" rows={5} placeholder="Act as my chief of staff. What should I focus on this week?" required /></label>
            )}

            <button className="button" type="submit" disabled={loading} style={{ marginTop: "8px" }}>
              {loading
                ? (activeTask === "generate_posts" || activeTask === "generate_video_briefs") ? "Generating & saving pipeline items… (30–90s)" : "Thinking…"
                : activeTask === "generate_posts" ? "⚡ Generate 12 Posts Now" 
                : activeTask === "generate_video_briefs" ? "🎬 Generate Video Briefs Now" : "Run →"}
            </button>
          </form>

          {loading && (
            <div className="ai-output panel-card">
              <div className="ai-loading"><span className="ai-spinner" />
                <p>{(activeTask === "generate_posts" || activeTask === "generate_video_briefs") ? "Generating items… they'll appear in your Content Pipeline when done." : "Running on your machine…"}</p>
              </div>
            </div>
          )}

          {postsResult && (
            <div className="ai-output panel-card">
              {postsResult.ok ? (
                <div className="ai-success">
                  <span className="ai-success-icon">✓</span>
                  <div>
                    <strong>{postsResult.count} items generated and saved</strong>
                    <p>They're in your Content Pipeline as "Idea" stage. <a href="/content" style={{ color: "var(--accent)", textDecoration: "underline" }}>Go to Content →</a></p>
                  </div>
                </div>
              ) : (
                <div className="ai-error"><span>⚠️ Error</span><p style={{ whiteSpace: "pre-wrap" }}>{postsResult.error}</p></div>
              )}
            </div>
          )}

          {result && (
            <div className="ai-output panel-card">
              {result.ok ? (
                <>
                  <div className="ai-output-header">
                    <span className="ai-output-badge good">✓ Output ready</span>
                    <button className="button secondary" style={{ fontSize: "13px", padding: "6px 14px" }} onClick={() => navigator.clipboard.writeText(result.output ?? "")}>Copy</button>
                  </div>
                  <pre className="ai-output-text">{result.output}</pre>
                </>
              ) : (
                <div className="ai-error"><span>⚠️ Error</span><p style={{ whiteSpace: "pre-wrap" }}>{result.error}</p></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
