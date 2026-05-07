"use server";

import { revalidatePath } from "next/cache";
import { createContentItem, updateContentStage, type ContentPlatform, type ContentStage } from "@/lib/content";

export async function createContentAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const platform = String(formData.get("platform") ?? "LinkedIn").trim() as ContentPlatform;
  const client = String(formData.get("client") ?? "").trim() || null;
  const owner = String(formData.get("owner") ?? "Richard").trim();
  const scheduledAtRaw = String(formData.get("scheduledAt") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!title) return;

  await createContentItem({
    title,
    platform,
    client,
    owner,
    scheduledAt: scheduledAtRaw ? new Date(`${scheduledAtRaw}T12:00:00`).toISOString() : null,
    notes
  });

  revalidatePath("/content");
}

export async function updateContentStageAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const stage = String(formData.get("stage") ?? "IDEA").trim() as ContentStage;

  if (!id) return;

  await updateContentStage({ id, stage });
  revalidatePath("/content");
}
