export type StatusTone = "good" | "warn" | "danger" | "neutral";

export type DashboardStat = {
  label: string;
  value: string;
  meta: string;
};

export type DashboardAlert = {
  title: string;
  summary: string;
  tone: StatusTone;
  meta: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  serviceInterest: string;
  source: string;
  stage: string;
  followUp: string;
  estimatedValue: string;
  owner: string;
  tone: StatusTone;
};

export type EditableLead = Lead & {
  sourceRaw: string;
  ownerRaw: string;
  notes: string;
  followUpDateInput: string;
  estimatedValueNumber: number;
};

export type Client = {
  id: string;
  name: string;
  primaryContact: string;
  offer: string;
  onboardingStatus: string;
  deliveryStatus: string;
  owner: string;
  tone: StatusTone;
};

export type EditableClient = Client & {
  primaryContactRaw: string;
  offerRaw: string;
  ownerRaw: string;
};

export type OnboardingChecklist = {
  id: string;
  clientId: string;
  clientName: string;
  owner: string;
  due: string;
  status: string;
  items: string[];
  tone: StatusTone;
};

export type DeliveryItem = {
  id: string;
  client: string;
  engagement: string;
  title: string;
  dueDate: string;
  status: string;
  blocker?: string;
  owner: string;
  tone: StatusTone;
};

export type EditableDeliveryItem = DeliveryItem & {
  clientRaw: string;
  engagementRaw: string;
  titleRaw: string;
  ownerRaw: string;
  blockerRaw: string;
  dueDateInput: string;
};

export type PipelineStage = {
  name: string;
  count: number;
  value: string;
};

export type NoteItem = {
  id: string;
  time: string;
  body: string;
  by: string;
};
