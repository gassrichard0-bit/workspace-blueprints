import type {
  Client,
  DashboardAlert,
  DashboardStat,
  DeliveryItem,
  Lead,
  NoteItem,
  PipelineStage
} from "@/types/domain";

export const dashboardStats: DashboardStat[] = [
  { label: "Open pipeline", value: "$84k", meta: "12 live opportunities" },
  { label: "Active clients", value: "9", meta: "3 onboarding right now" },
  { label: "At-risk delivery", value: "4", meta: "Needs owner review today" },
  { label: "Follow-ups due", value: "7", meta: "2 overdue since yesterday" }
];

export const dashboardAlerts: DashboardAlert[] = [
  {
    title: "Two proposals are drifting without a next step",
    summary: "Apex Studio and Northline Media need follow-up dates before they fall out of cycle.",
    tone: "warn",
    meta: "Pipeline risk"
  },
  {
    title: "Client onboarding for Harbor Health is blocked",
    summary: "Brand assets and kickoff confirmation are still missing.",
    tone: "danger",
    meta: "Operations blocker"
  },
  {
    title: "Delivery workload is healthy overall",
    summary: "Most active engagements are on track, but video production is carrying the highest load.",
    tone: "good",
    meta: "Capacity signal"
  }
];

export const pipelineStages: PipelineStage[] = [
  { name: "New", count: 4, value: "$18k" },
  { name: "Qualified", count: 3, value: "$21k" },
  { name: "Proposal Sent", count: 3, value: "$27k" },
  { name: "Negotiation", count: 2, value: "$18k" },
  { name: "Won This Month", count: 5, value: "$42k" }
];

export const leads: Lead[] = [
  {
    id: "lead-001",
    name: "Jada Cole",
    company: "Northline Media",
    serviceInterest: "Content operating system",
    source: "Referral",
    stage: "Proposal Sent",
    followUp: "Tomorrow",
    estimatedValue: "$12k",
    owner: "Richard",
    tone: "warn"
  },
  {
    id: "lead-002",
    name: "Marcus Wu",
    company: "Harbor Health",
    serviceInterest: "Client delivery platform",
    source: "Website form",
    stage: "Qualified",
    followUp: "Today",
    estimatedValue: "$18k",
    owner: "Richard",
    tone: "danger"
  },
  {
    id: "lead-003",
    name: "Sam Ortega",
    company: "Summit Legal",
    serviceInterest: "CRM and onboarding setup",
    source: "Outbound",
    stage: "Contacted",
    followUp: "In 3 days",
    estimatedValue: "$8k",
    owner: "Avery",
    tone: "neutral"
  },
  {
    id: "lead-004",
    name: "Nia Foster",
    company: "Apex Studio",
    serviceInterest: "Business operating dashboard",
    source: "Past client",
    stage: "Negotiation",
    followUp: "Overdue",
    estimatedValue: "$16k",
    owner: "Richard",
    tone: "danger"
  }
];

export const clients: Client[] = [
  {
    id: "client-001",
    name: "Harbor Health",
    primaryContact: "Marcus Wu",
    offer: "Delivery platform buildout",
    onboardingStatus: "Blocked",
    deliveryStatus: "Not started",
    owner: "Richard",
    tone: "danger"
  },
  {
    id: "client-002",
    name: "Luna Advisory",
    primaryContact: "Sofia Patel",
    offer: "Retainer operations support",
    onboardingStatus: "Complete",
    deliveryStatus: "On track",
    owner: "Avery",
    tone: "good"
  },
  {
    id: "client-003",
    name: "Cedar & Pine",
    primaryContact: "Evan Brooks",
    offer: "CRM cleanup and automation",
    onboardingStatus: "In progress",
    deliveryStatus: "Needs review",
    owner: "Richard",
    tone: "warn"
  }
];

export const deliveryItems: DeliveryItem[] = [
  {
    id: "delivery-001",
    client: "Luna Advisory",
    engagement: "Monthly operations retainer",
    title: "Finalize KPI dashboard",
    dueDate: "Today",
    status: "In review",
    owner: "Avery",
    tone: "warn"
  },
  {
    id: "delivery-002",
    client: "Cedar & Pine",
    engagement: "CRM cleanup sprint",
    title: "Map sales stages to new pipeline",
    dueDate: "Tomorrow",
    status: "Blocked",
    blocker: "Waiting on deal history export",
    owner: "Richard",
    tone: "danger"
  },
  {
    id: "delivery-003",
    client: "Northline Media",
    engagement: "Content system setup",
    title: "Approve onboarding workspace",
    dueDate: "This week",
    status: "On track",
    owner: "Jules",
    tone: "good"
  }
];

export const ownerTimeline: NoteItem[] = [
  {
    id: "note-001",
    time: "08:15",
    body: "Marcus asked for kickoff dates before signing the final build scope.",
    by: "Richard"
  },
  {
    id: "note-002",
    time: "09:40",
    body: "Cedar & Pine delivery is waiting on exported contacts and stage history.",
    by: "Avery"
  },
  {
    id: "note-003",
    time: "11:10",
    body: "Northline said the proposal looks good but wants phased pricing options.",
    by: "Richard"
  }
];
