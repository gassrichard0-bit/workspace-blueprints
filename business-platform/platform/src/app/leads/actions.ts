"use server";

import { revalidatePath } from "next/cache";
import { createLead, type LeadStage, updateLeadDetails, updateLeadStage } from "@/lib/leads";

const stageMap: Record<string, LeadStage> = {
  New: "NEW",
  Contacted: "CONTACTED",
  Qualified: "QUALIFIED",
  "Proposal Sent": "PROPOSAL_SENT",
  Negotiation: "NEGOTIATION",
  Won: "WON",
  Lost: "LOST"
};

export async function createLeadAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const serviceInterest = String(formData.get("serviceInterest") ?? "").trim();
  const source = String(formData.get("source") ?? "Website form").trim();
  const owner = String(formData.get("owner") ?? "Richard").trim();
  const stageInput = String(formData.get("stage") ?? "New").trim();
  const estimatedValue = Number(String(formData.get("estimatedValue") ?? "0").trim() || "0");
  const followUpAt = String(formData.get("followUpAt") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !company || !serviceInterest) {
    return;
  }

  await createLead({
    name,
    company,
    serviceInterest,
    source,
    owner,
    stage: stageMap[stageInput] ?? "NEW",
    estimatedValue: Number.isFinite(estimatedValue) ? estimatedValue : 0,
    followUpAt: followUpAt ? new Date(`${followUpAt}T12:00:00`).toISOString() : null,
    notes: notes || null
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/pipeline");
}

export async function updateLeadStageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const stageInput = String(formData.get("stage") ?? "New").trim();

  if (!id) return;

  await updateLeadStage({
    id,
    stage: stageMap[stageInput] ?? "NEW"
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/pipeline");
}

export async function updateLeadDetailsAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();
  const estimatedValue = Number(String(formData.get("estimatedValue") ?? "0").trim() || "0");
  const followUpAt = String(formData.get("followUpAt") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!id || !source || !owner) return;

  await updateLeadDetails({
    id,
    source,
    owner,
    estimatedValue: Number.isFinite(estimatedValue) ? estimatedValue : 0,
    followUpAt: followUpAt ? new Date(`${followUpAt}T12:00:00`).toISOString() : null,
    notes: notes || null
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/pipeline");
}

// ── Sync leads from Netlify website form ─────────────────────────────────────

export async function syncWebsiteLeadsAction(): Promise<{ ok: boolean; added: number; error?: string }> {
  const { execSync } = await import("child_process");
  const { readFile, writeFile } = await import("node:fs/promises");
  const path = await import("path");

  const SITE_ID = "ff261c1b-013c-4a81-b8b3-9942deb5583a";
  const leadsFile = path.join(process.cwd(), "data", "leads.json");

  try {
    const raw = execSync(
      `netlify api listSiteSubmissions --data '{"site_id": "${SITE_ID}"}'`,
      { encoding: "utf-8", timeout: 15000 }
    );

    const submissions = JSON.parse(raw);
    if (!submissions.length) {
      return { ok: true, added: 0 };
    }

    let leads: any[] = [];
    try {
      leads = JSON.parse(await readFile(leadsFile, "utf-8"));
    } catch { /* empty */ }

    const existingEmails = new Set(leads.map((l: any) => (l.primaryContact || "").toLowerCase()));

    let added = 0;
    for (const sub of submissions) {
      const d = sub.data || {};
      const email = (d.email || "").toLowerCase();
      if (!email || existingEmails.has(email)) continue;

      leads.unshift({
        id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        company: d.business || d.name || "Unknown",
        name: d.name || "Unknown",
        primaryContact: d.email || "",
        serviceInterest: d.plan || "Starter — $297/mo",
        stage: "New",
        owner: "Richard",
        source: "Website form",
        estimatedValue: 0,
        followUpAt: null,
        notes: `Industry: ${d.industry || "N/A"} | Platform: ${d.platform || "N/A"} | Source: contentai-landing.netlify.app`,
        createdAt: sub.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      existingEmails.add(email);
      added++;
    }

    await writeFile(leadsFile, JSON.stringify(leads, null, 2) + "\n", "utf-8");

    revalidatePath("/");
    revalidatePath("/leads");
    revalidatePath("/pipeline");

    return { ok: true, added };
  } catch (err: any) {
    return { ok: false, added: 0, error: err.message || "Failed to sync" };
  }
}
