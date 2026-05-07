import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DashboardStat, DeliveryItem, EditableDeliveryItem, StatusTone } from "@/types/domain";

type StoredDeliveryItem = {
  id: string;
  client: string;
  engagement: string;
  title: string;
  dueAt: string | null;
  status: string;
  blocker: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

const deliveryFile = path.join(process.cwd(), "data", "delivery.json");

function formatDueDate(value: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);

  if (compare.getTime() < today.getTime()) return "Overdue";
  if (compare.getTime() === today.getTime()) return "Today";
  if (compare.getTime() === tomorrow.getTime()) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function getDeliveryTone(item: StoredDeliveryItem): StatusTone {
  if (item.status === "Blocked" || item.blocker) return "danger";
  if (item.status === "In review" || item.status === "Needs review") return "warn";
  if (item.status === "On track" || item.status === "Complete") return "good";
  return "neutral";
}

export async function getDeliveryItemsForUi(): Promise<DeliveryItem[]> {
  const items = await getStoredDeliveryItems();

  return items.map((item) => ({
    id: item.id,
    client: item.client,
    engagement: item.engagement,
    title: item.title,
    dueDate: formatDueDate(item.dueAt),
    status: item.status,
    blocker: item.blocker ?? undefined,
    owner: item.owner,
    tone: getDeliveryTone(item)
  }));
}

export async function getEditableDeliveryItems(): Promise<EditableDeliveryItem[]> {
  const items = await getStoredDeliveryItems();

  return items.map((item) => ({
    id: item.id,
    client: item.client,
    engagement: item.engagement,
    title: item.title,
    dueDate: formatDueDate(item.dueAt),
    status: item.status,
    blocker: item.blocker ?? undefined,
    owner: item.owner,
    tone: getDeliveryTone(item),
    clientRaw: item.client,
    engagementRaw: item.engagement,
    titleRaw: item.title,
    ownerRaw: item.owner,
    blockerRaw: item.blocker ?? "",
    dueDateInput: item.dueAt ? item.dueAt.slice(0, 10) : ""
  }));
}

export async function getDeliveryStats(): Promise<DashboardStat[]> {
  const items = await getStoredDeliveryItems();
  const activeCount = items.length;
  const blockedCount = items.filter((item) => item.status === "Blocked" || item.blocker).length;
  const dueSoonCount = items.filter((item) => {
    if (!item.dueAt) return false;
    const due = new Date(item.dueAt);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 7);
    return due <= cutoff;
  }).length;
  const atRiskCount = items.filter((item) => getDeliveryTone(item) === "danger" || getDeliveryTone(item) === "warn").length;

  return [
    { label: "Active engagements", value: String(activeCount), meta: "Saved delivery records" },
    { label: "Blocked items", value: String(blockedCount), meta: "Needs owner intervention" },
    { label: "Due soon", value: String(dueSoonCount), meta: "Within the next week" },
    { label: "At risk", value: String(atRiskCount), meta: "Blocked or under review" }
  ];
}

export async function createDeliveryItem(input: {
  client: string;
  engagement: string;
  title: string;
  dueAt: string | null;
  status: string;
  blocker: string | null;
  owner: string;
}) {
  const items = await getStoredDeliveryItems();
  const now = new Date().toISOString();

  items.unshift({
    id: `delivery-${Date.now()}`,
    client: input.client,
    engagement: input.engagement,
    title: input.title,
    dueAt: input.dueAt,
    status: input.status,
    blocker: input.blocker,
    owner: input.owner,
    createdAt: now,
    updatedAt: now
  });

  await writeFile(deliveryFile, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

export async function updateDeliveryStatus(input: {
  id: string;
  status: string;
}) {
  const items = await getStoredDeliveryItems();
  const now = new Date().toISOString();

  const updatedItems = items.map((item) =>
    item.id === input.id
      ? {
          ...item,
          status: input.status,
          blocker: input.status === "Blocked" ? item.blocker : null,
          updatedAt: now
        }
      : item
  );

  await writeFile(deliveryFile, `${JSON.stringify(updatedItems, null, 2)}\n`, "utf-8");
}

export async function updateDeliveryDetails(input: {
  id: string;
  client: string;
  engagement: string;
  title: string;
  dueAt: string | null;
  owner: string;
  blocker: string | null;
}) {
  const items = await getStoredDeliveryItems();
  const now = new Date().toISOString();

  const updatedItems = items.map((item) =>
    item.id === input.id
      ? {
          ...item,
          client: input.client,
          engagement: input.engagement,
          title: input.title,
          dueAt: input.dueAt,
          owner: input.owner,
          blocker: input.blocker,
          updatedAt: now
        }
      : item
  );

  await writeFile(deliveryFile, `${JSON.stringify(updatedItems, null, 2)}\n`, "utf-8");
}

async function getStoredDeliveryItems(): Promise<StoredDeliveryItem[]> {
  const contents = await readFile(deliveryFile, "utf-8");
  const items = JSON.parse(contents) as StoredDeliveryItem[];

  return items.sort((a, b) => {
    const aDate = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bDate = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER;

    if (aDate !== bDate) return aDate - bDate;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
