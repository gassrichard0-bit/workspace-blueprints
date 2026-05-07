import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Client, DashboardStat, EditableClient, OnboardingChecklist, StatusTone } from "@/types/domain";

type StoredClient = {
  id: string;
  name: string;
  primaryContact: string;
  offer: string;
  onboardingStatus: string;
  deliveryStatus: string;
  owner: string;
  niche: string;
  audience: string;
  platform: string;
  contentFormat: string;
  videoAssetsUrl: string;
  createdAt: string;
  updatedAt: string;
};

type StoredOnboardingChecklist = {
  id: string;
  clientId: string;
  clientName: string;
  owner: string;
  dueDate: string | null;
  status: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
};

const clientsFile = path.join(process.cwd(), "data", "clients.json");
const onboardingFile = path.join(process.cwd(), "data", "onboarding.json");

function formatDateLabel(value: string | null) {
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

function getClientTone(client: StoredClient): StatusTone {
  if (client.onboardingStatus === "Blocked" || client.deliveryStatus === "Blocked") {
    return "danger";
  }

  if (
    client.onboardingStatus === "In progress" ||
    client.deliveryStatus === "Needs review" ||
    client.deliveryStatus === "Not started"
  ) {
    return "warn";
  }

  if (client.deliveryStatus === "On track" || client.onboardingStatus === "Complete") {
    return "good";
  }

  return "neutral";
}

function getOnboardingTone(status: string): StatusTone {
  if (status === "Blocked") return "danger";
  if (status === "In progress") return "warn";
  if (status === "Complete") return "good";
  return "neutral";
}

export async function getClientsForUi(): Promise<Client[]> {
  const clients = await getStoredClients();

  return clients.map((client) => ({
    id: client.id,
    name: client.name,
    primaryContact: client.primaryContact,
    offer: client.offer,
    onboardingStatus: client.onboardingStatus,
    deliveryStatus: client.deliveryStatus,
    owner: client.owner,
    tone: getClientTone(client)
  }));
}

export async function getClientsForContentGen(): Promise<{
  id: string; name: string; niche: string; audience: string; platform: string;
}[]> {
  const clients = await getStoredClients();
  return clients.map((c) => ({
    id: c.id,
    name: c.name,
    niche: c.niche || "",
    audience: c.audience || "",
    platform: c.platform || "LinkedIn"
  }));
}

export async function getEditableClients(): Promise<EditableClient[]> {
  const clients = await getStoredClients();

  return clients.map((client) => ({
    id: client.id,
    name: client.name,
    primaryContact: client.primaryContact,
    offer: client.offer,
    onboardingStatus: client.onboardingStatus,
    deliveryStatus: client.deliveryStatus,
    owner: client.owner,
    tone: getClientTone(client),
    primaryContactRaw: client.primaryContact,
    offerRaw: client.offer,
    ownerRaw: client.owner
  }));
}

export async function getClientStats(): Promise<DashboardStat[]> {
  const clients = await getStoredClients();
  const blocked = clients.filter((client) => client.onboardingStatus === "Blocked").length;
  const needsReview = clients.filter(
    (client) =>
      client.onboardingStatus === "In progress" ||
      client.deliveryStatus === "Needs review" ||
      client.deliveryStatus === "Not started"
  ).length;
  const healthy = clients.filter((client) => getClientTone(client) === "good").length;

  return [
    { label: "Active clients", value: String(clients.length), meta: "Saved in the platform" },
    { label: "Needs review", value: String(needsReview), meta: "Client state needs attention" },
    { label: "Healthy accounts", value: String(healthy), meta: "On track this week" },
    { label: "Blocked onboarding", value: String(blocked), meta: "Waiting on required inputs" }
  ];
}

export async function getOnboardingForUi(): Promise<OnboardingChecklist[]> {
  const checklists = await getStoredOnboarding();

  return checklists.map((item) => ({
    id: item.id,
    clientId: item.clientId,
    clientName: item.clientName,
    owner: item.owner,
    due: formatDateLabel(item.dueDate),
    status: item.status,
    items: item.items,
    tone: getOnboardingTone(item.status)
  }));
}

export async function getOnboardingStats(): Promise<DashboardStat[]> {
  const checklists = await getStoredOnboarding();
  const blocked = checklists.filter((item) => item.status === "Blocked").length;
  const active = checklists.filter((item) => item.status !== "Complete").length;
  const complete = checklists.filter((item) => item.status === "Complete").length;
  const dueSoon = checklists.filter((item) => {
    if (!item.dueDate) return false;
    const compare = new Date(item.dueDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return compare <= tomorrow;
  }).length;

  return [
    { label: "Active checklists", value: String(active), meta: `${blocked} blocked right now` },
    { label: "Due soon", value: String(dueSoon), meta: "Needs follow-through this week" },
    { label: "Blocked", value: String(blocked), meta: "Waiting on owner or client input" },
    { label: "Completed", value: String(complete), meta: "Ready for active delivery" }
  ];
}

export async function createClient(input: {
  name: string;
  primaryContact: string;
  offer: string;
  owner: string;
  onboardingStatus: string;
  deliveryStatus: string;
  niche?: string;
  audience?: string;
  platform?: string;
  contentFormat?: string;
  videoAssetsUrl?: string;
}) {
  const clients = await getStoredClients();
  const now = new Date().toISOString();
  const newClient: StoredClient = {
    id: `client-${Date.now()}`,
    name: input.name,
    primaryContact: input.primaryContact,
    offer: input.offer,
    onboardingStatus: input.onboardingStatus,
    deliveryStatus: input.deliveryStatus,
    owner: input.owner,
    niche: input.niche ?? "",
    audience: input.audience ?? "",
    platform: input.platform ?? "LinkedIn",
    contentFormat: input.contentFormat ?? "Written",
    videoAssetsUrl: input.videoAssetsUrl ?? "",
    createdAt: now,
    updatedAt: now
  };

  clients.unshift(newClient);
  await writeFile(clientsFile, `${JSON.stringify(clients, null, 2)}\n`, "utf-8");

  if (input.onboardingStatus !== "Complete") {
    const checklists = await getStoredOnboarding();
    checklists.unshift({
      id: `onboarding-${Date.now()}`,
      clientId: newClient.id,
      clientName: newClient.name,
      owner: newClient.owner,
      dueDate: now,
      status: input.onboardingStatus,
      items: ["Kickoff scheduled", "Access collected", "Internal owner confirmed"],
      createdAt: now,
      updatedAt: now
    });
    await writeFile(onboardingFile, `${JSON.stringify(checklists, null, 2)}\n`, "utf-8");
  }
}

export async function createClientFromLead(input: {
  name: string;
  primaryContact: string;
  offer: string;
  owner: string;
}) {
  await createClient({
    name: input.name,
    primaryContact: input.primaryContact,
    offer: input.offer,
    owner: input.owner,
    onboardingStatus: "In progress",
    deliveryStatus: "Not started"
  });
}

export async function updateClientStatuses(input: {
  id: string;
  onboardingStatus: string;
  deliveryStatus: string;
}) {
  const clients = await getStoredClients();
  const now = new Date().toISOString();

  const updatedClients = clients.map((client) =>
    client.id === input.id
      ? {
          ...client,
          onboardingStatus: input.onboardingStatus,
          deliveryStatus: input.deliveryStatus,
          updatedAt: now
        }
      : client
  );

  await writeFile(clientsFile, `${JSON.stringify(updatedClients, null, 2)}\n`, "utf-8");
}

export async function updateClientDetails(input: {
  id: string;
  name: string;
  primaryContact: string;
  offer: string;
  owner: string;
}) {
  const clients = await getStoredClients();
  const now = new Date().toISOString();

  const updatedClients = clients.map((client) =>
    client.id === input.id
      ? {
          ...client,
          name: input.name,
          primaryContact: input.primaryContact,
          offer: input.offer,
          owner: input.owner,
          updatedAt: now
        }
      : client
  );

  await writeFile(clientsFile, `${JSON.stringify(updatedClients, null, 2)}\n`, "utf-8");
}

export async function updateOnboardingStatus(input: {
  id: string;
  status: string;
}) {
  const checklists = await getStoredOnboarding();
  const now = new Date().toISOString();

  const updatedChecklists = checklists.map((item) =>
    item.id === input.id
      ? {
          ...item,
          status: input.status,
          updatedAt: now
        }
      : item
  );

  await writeFile(onboardingFile, `${JSON.stringify(updatedChecklists, null, 2)}\n`, "utf-8");
}

async function getStoredClients(): Promise<StoredClient[]> {
  const contents = await readFile(clientsFile, "utf-8");
  return JSON.parse(contents) as StoredClient[];
}

async function getStoredOnboarding(): Promise<StoredOnboardingChecklist[]> {
  const contents = await readFile(onboardingFile, "utf-8");
  return JSON.parse(contents) as StoredOnboardingChecklist[];
}
