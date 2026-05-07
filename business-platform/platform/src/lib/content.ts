import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DashboardStat, StatusTone } from "@/types/domain";

// ── Types ────────────────────────────────────────────────────────────────────

export type ContentStage = "IDEA" | "BRIEF" | "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED";
export type ContentPlatform = "LinkedIn" | "Twitter/X" | "Instagram" | "Newsletter" | "Blog" | "YouTube" | "Other";

export type StoredContentItem = {
  id: string;
  title: string;
  platform: ContentPlatform;
  stage: ContentStage;
  client: string | null;
  owner: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentItemUi = {
  id: string;
  title: string;
  platform: ContentPlatform;
  stage: string;
  stageRaw: ContentStage;
  client: string;
  owner: string;
  scheduledAt: string;
  notes: string;
  tone: StatusTone;
};

// ── Constants ────────────────────────────────────────────────────────────────

const contentFile = path.join(process.cwd(), "data", "content.json");

export const stageLabelMap: Record<ContentStage, string> = {
  IDEA: "Idea",
  BRIEF: "Brief",
  DRAFT: "Draft",
  REVIEW: "Review",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published"
};

export const stageOrder: ContentStage[] = ["IDEA", "BRIEF", "DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getStageTone(stage: ContentStage): StatusTone {
  if (stage === "PUBLISHED") return "good";
  if (stage === "SCHEDULED") return "good";
  if (stage === "REVIEW") return "warn";
  if (stage === "DRAFT") return "neutral";
  return "neutral";
}

function formatScheduled(value: string | null): string {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() < now.getTime()) return "Overdue";
  if (d.getTime() === now.getTime()) return "Today";
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

// ── File I/O ─────────────────────────────────────────────────────────────────

async function getStoredContent(): Promise<StoredContentItem[]> {
  const raw = await readFile(contentFile, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed as StoredContentItem[];
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getContentForUi(): Promise<ContentItemUi[]> {
  const items = await getStoredContent();
  return items
    .filter((i) => i.stage !== "PUBLISHED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((item) => ({
      id: item.id,
      title: item.title,
      platform: item.platform,
      stage: stageLabelMap[item.stage],
      stageRaw: item.stage,
      client: item.client ?? "Own brand",
      owner: item.owner,
      scheduledAt: formatScheduled(item.scheduledAt),
      notes: item.notes ?? "",
      tone: getStageTone(item.stage)
    }));
}

export async function getContentStats(): Promise<DashboardStat[]> {
  const items = await getStoredContent();
  const active = items.filter((i) => i.stage !== "PUBLISHED").length;
  const inReview = items.filter((i) => i.stage === "REVIEW").length;
  const scheduled = items.filter((i) => i.stage === "SCHEDULED").length;
  const published = items.filter((i) => i.stage === "PUBLISHED").length;

  return [
    { label: "Active pieces", value: String(active), meta: "In progress right now" },
    { label: "In review", value: String(inReview), meta: "Needs approval before scheduling" },
    { label: "Scheduled", value: String(scheduled), meta: "Ready to go out" },
    { label: "Published", value: String(published), meta: "Total published all time" }
  ];
}

export async function createContentItem(input: {
  title: string;
  platform: ContentPlatform;
  client: string | null;
  owner: string;
  scheduledAt: string | null;
  notes: string | null;
}) {
  const items = await getStoredContent();
  const now = new Date().toISOString();
  items.unshift({
    id: `content-${Date.now()}`,
    title: input.title,
    platform: input.platform,
    stage: "IDEA",
    client: input.client,
    owner: input.owner,
    scheduledAt: input.scheduledAt,
    publishedAt: null,
    notes: input.notes,
    createdAt: now,
    updatedAt: now
  });
  await writeFile(contentFile, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

export async function updateContentStage(input: { id: string; stage: ContentStage }) {
  const items = await getStoredContent();
  const now = new Date().toISOString();
  const updated = items.map((item) =>
    item.id === input.id
      ? {
          ...item,
          stage: input.stage,
          publishedAt: input.stage === "PUBLISHED" ? now : item.publishedAt,
          updatedAt: now
        }
      : item
  );
  await writeFile(contentFile, `${JSON.stringify(updated, null, 2)}\n`, "utf-8");
}
