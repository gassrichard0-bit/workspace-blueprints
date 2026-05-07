import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DashboardStat, EditableLead, Lead as UiLead, PipelineStage, StatusTone } from "@/types/domain";

export type LeadStage = "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "WON" | "LOST";

type StoredLead = {
  id: string;
  name: string;
  company: string;
  source: string;
  serviceInterest: string;
  stage: LeadStage;
  followUpAt: string | null;
  estimatedValue: number;
  owner: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

const leadsFile = path.join(process.cwd(), "data", "leads.json");

const stageLabelMap: Record<LeadStage, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost"
};

const stageOrder: LeadStage[] = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function getStartOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function getTomorrow() {
  const date = getStartOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}

function parseDate(date: string | null) {
  return date ? new Date(date) : null;
}

function getLeadTone(lead: StoredLead): StatusTone {
  const today = getStartOfToday();
  const followUpAt = parseDate(lead.followUpAt);

  if (followUpAt && followUpAt < today && lead.stage !== "WON" && lead.stage !== "LOST") {
    return "danger";
  }

  if (["QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION"].includes(lead.stage)) {
    return "warn";
  }

  if (lead.stage === "WON") {
    return "good";
  }

  return "neutral";
}

function formatFollowUp(date: Date | null) {
  if (!date) return "Not set";

  const today = getStartOfToday();
  const tomorrow = getTomorrow();
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);

  if (compare.getTime() < today.getTime()) return "Overdue";
  if (compare.getTime() === today.getTime()) return "Today";
  if (compare.getTime() === tomorrow.getTime()) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function mapLeadToUi(lead: StoredLead): UiLead {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    serviceInterest: lead.serviceInterest,
    source: lead.source,
    stage: stageLabelMap[lead.stage],
    followUp: formatFollowUp(parseDate(lead.followUpAt)),
    estimatedValue: formatCurrency(lead.estimatedValue),
    owner: lead.owner,
    tone: getLeadTone(lead)
  };
}

export async function getLeadsForUi() {
  const leads = await getStoredLeads();

  return leads.map(mapLeadToUi);
}

export async function getEditableLeads(): Promise<EditableLead[]> {
  const leads = await getStoredLeads();

  return leads.map((lead) => ({
    ...mapLeadToUi(lead),
    sourceRaw: lead.source,
    ownerRaw: lead.owner,
    notes: lead.notes ?? "",
    followUpDateInput: lead.followUpAt ? lead.followUpAt.slice(0, 10) : "",
    estimatedValueNumber: lead.estimatedValue
  }));
}

export async function getDashboardLeadStats(): Promise<DashboardStat[]> {
  const leads = await getStoredLeads();
  const openLeads = leads.filter((lead) => lead.stage !== "WON" && lead.stage !== "LOST");
  const wonLeads = leads.filter((lead) => lead.stage === "WON");
  const today = getStartOfToday();
  const dueTodayCount = leads.filter((lead) => {
    const date = parseDate(lead.followUpAt);
    if (!date) return false;
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  }).length;
  const overdueCount = leads.filter((lead) => {
    const date = parseDate(lead.followUpAt);
    if (!date) return false;
    return date < today && lead.stage !== "WON" && lead.stage !== "LOST";
  }).length;

  return [
    {
      label: "Open pipeline",
      value: formatCurrency(openLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0)),
      meta: `${openLeads.length} live opportunities`
    },
    {
      label: "Leads due today",
      value: String(dueTodayCount),
      meta: "Immediate follow-up queue"
    },
    {
      label: "Won value",
      value: formatCurrency(wonLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0)),
      meta: `${wonLeads.length} wins in the system`
    },
    {
      label: "Overdue follow-ups",
      value: String(overdueCount),
      meta: "Needs owner attention"
    }
  ];
}

export async function getPipelineStages(): Promise<PipelineStage[]> {
  const leads = await getStoredLeads();

  return stageOrder
    .filter((stage) => stage !== "LOST")
    .map((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage);

      return {
        name: stageLabelMap[stage],
        count: stageLeads.length,
        value: formatCurrency(stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0))
      };
    });
}

export async function createLead(input: {
  name: string;
  company: string;
  source: string;
  serviceInterest: string;
  owner: string;
  stage: LeadStage;
  estimatedValue: number;
  followUpAt: string | null;
  notes: string | null;
}) {
  const leads = await getStoredLeads();
  const now = new Date().toISOString();

  leads.unshift({
    id: `lead-${Date.now()}`,
    name: input.name,
    company: input.company,
    source: input.source,
    serviceInterest: input.serviceInterest,
    stage: input.stage,
    followUpAt: input.followUpAt,
    estimatedValue: input.estimatedValue,
    owner: input.owner,
    notes: input.notes,
    createdAt: now,
    updatedAt: now
  });

  await writeFile(leadsFile, `${JSON.stringify(leads, null, 2)}\n`, "utf-8");
}

export async function updateLeadStage(input: {
  id: string;
  stage: LeadStage;
}) {
  const leads = await getStoredLeads();
  const now = new Date().toISOString();

  const updated = leads.map((lead) =>
    lead.id === input.id
      ? {
          ...lead,
          stage: input.stage,
          updatedAt: now
        }
      : lead
  );

  await writeFile(leadsFile, `${JSON.stringify(updated, null, 2)}\n`, "utf-8");
}

export async function updateLeadDetails(input: {
  id: string;
  source: string;
  owner: string;
  estimatedValue: number;
  followUpAt: string | null;
  notes: string | null;
}) {
  const leads = await getStoredLeads();
  const now = new Date().toISOString();

  const updated = leads.map((lead) =>
    lead.id === input.id
      ? {
          ...lead,
          source: input.source,
          owner: input.owner,
          estimatedValue: input.estimatedValue,
          followUpAt: input.followUpAt,
          notes: input.notes,
          updatedAt: now
        }
      : lead
  );

  await writeFile(leadsFile, `${JSON.stringify(updated, null, 2)}\n`, "utf-8");
}

async function getStoredLeads(): Promise<StoredLead[]> {
  const contents = await readFile(leadsFile, "utf-8");
  const leads = JSON.parse(contents) as StoredLead[];

  return leads.sort((a, b) => {
    const aDate = parseDate(a.followUpAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bDate = parseDate(b.followUpAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    if (aDate !== bDate) return aDate - bDate;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
