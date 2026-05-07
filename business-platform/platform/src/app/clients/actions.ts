"use server";

import { revalidatePath } from "next/cache";
import {
  createClient,
  createClientFromLead,
  updateClientDetails,
  updateClientStatuses,
  updateOnboardingStatus
} from "@/lib/clients";

export async function createClientAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const primaryContact = String(formData.get("primaryContact") ?? "").trim();
  const offer = String(formData.get("offer") ?? "").trim();
  const owner = String(formData.get("owner") ?? "Richard").trim();
  const onboardingStatus = String(formData.get("onboardingStatus") ?? "In progress").trim();
  const deliveryStatus = String(formData.get("deliveryStatus") ?? "Not started").trim();
  const niche = String(formData.get("niche") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const platform = String(formData.get("platform") ?? "LinkedIn").trim();
  const contentFormat = String(formData.get("contentFormat") ?? "Written").trim();
  const videoAssetsUrl = String(formData.get("videoAssetsUrl") ?? "").trim();

  if (!name || !primaryContact || !offer) return;

  await createClient({
    name,
    primaryContact,
    offer,
    owner,
    onboardingStatus,
    deliveryStatus,
    niche,
    audience,
    platform,
    contentFormat,
    videoAssetsUrl
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/onboarding");
  revalidatePath("/ai");
}

export async function convertWonLeadAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const primaryContact = String(formData.get("primaryContact") ?? "").trim();
  const offer = String(formData.get("offer") ?? "").trim();
  const owner = String(formData.get("owner") ?? "Richard").trim();

  if (!name || !primaryContact || !offer) return;

  await createClientFromLead({
    name,
    primaryContact,
    offer,
    owner
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/onboarding");
}

export async function updateClientStatusesAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const onboardingStatus = String(formData.get("onboardingStatus") ?? "").trim();
  const deliveryStatus = String(formData.get("deliveryStatus") ?? "").trim();

  if (!id || !onboardingStatus || !deliveryStatus) return;

  await updateClientStatuses({
    id,
    onboardingStatus,
    deliveryStatus
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/onboarding");
}

export async function updateOnboardingStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!id || !status) return;

  await updateOnboardingStatus({
    id,
    status
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/onboarding");
}

export async function updateClientDetailsAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const primaryContact = String(formData.get("primaryContact") ?? "").trim();
  const offer = String(formData.get("offer") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();

  if (!id || !name || !primaryContact || !offer || !owner) return;

  await updateClientDetails({
    id,
    name,
    primaryContact,
    offer,
    owner
  });

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/onboarding");
}

// ── Sync client assets from Netlify website form ─────────────────────────────────────

export async function syncClientAssetsAction(): Promise<{ ok: boolean; updated: number; error?: string }> {
  const { execSync } = await import("child_process");
  const { readFile, writeFile } = await import("node:fs/promises");
  const path = await import("path");

  const SITE_ID = "ff261c1b-013c-4a81-b8b3-9942deb5583a";
  const clientsFile = path.join(process.cwd(), "data", "clients.json");

  try {
    const raw = execSync(
      `netlify api listSiteSubmissions --data '{"site_id": "${SITE_ID}"}'`,
      { encoding: "utf-8", timeout: 15000 }
    );

    const submissions = JSON.parse(raw);
    if (!submissions.length) {
      return { ok: true, updated: 0 };
    }

    let clients: any[] = [];
    try {
      clients = JSON.parse(await readFile(clientsFile, "utf-8"));
    } catch { /* empty */ }

    let updated = 0;
    // We only care about submissions with videoUrl
    const assetSubmissions = submissions.filter((s: any) => s.data && s.data.videoUrl);

    for (const sub of assetSubmissions) {
      const d = sub.data || {};
      const email = (d.email || "").toLowerCase();
      if (!email || !d.videoUrl) continue;

      const clientIndex = clients.findIndex((c: any) => (c.primaryContact || "").toLowerCase() === email);
      if (clientIndex !== -1) {
        // Only update if it's different to prevent unnecessary updates
        if (clients[clientIndex].videoAssetsUrl !== d.videoUrl) {
          clients[clientIndex].videoAssetsUrl = d.videoUrl;
          clients[clientIndex].updatedAt = new Date().toISOString();
          updated++;
        }
      }
    }

    if (updated > 0) {
      await writeFile(clientsFile, JSON.stringify(clients, null, 2), "utf-8");
      revalidatePath("/");
      revalidatePath("/clients");
      revalidatePath("/ai");
    }

    return { ok: true, updated };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Netlify sync error:", msg);
    return { ok: false, updated: 0, error: msg };
  }
}
