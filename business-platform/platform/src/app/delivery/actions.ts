"use server";

import { revalidatePath } from "next/cache";
import { createDeliveryItem, updateDeliveryDetails, updateDeliveryStatus } from "@/lib/delivery";

export async function createDeliveryAction(formData: FormData) {
  const client = String(formData.get("client") ?? "").trim();
  const engagement = String(formData.get("engagement") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "").trim();
  const status = String(formData.get("status") ?? "On track").trim();
  const blocker = String(formData.get("blocker") ?? "").trim();
  const owner = String(formData.get("owner") ?? "Richard").trim();

  if (!client || !engagement || !title) return;

  await createDeliveryItem({
    client,
    engagement,
    title,
    dueAt: dueAt ? new Date(`${dueAt}T12:00:00`).toISOString() : null,
    status,
    blocker: blocker || null,
    owner
  });

  revalidatePath("/");
  revalidatePath("/delivery");
}

export async function updateDeliveryStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!id || !status) return;

  await updateDeliveryStatus({
    id,
    status
  });

  revalidatePath("/");
  revalidatePath("/delivery");
}

export async function updateDeliveryDetailsAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim();
  const engagement = String(formData.get("engagement") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();
  const blocker = String(formData.get("blocker") ?? "").trim();

  if (!id || !client || !engagement || !title || !owner) return;

  await updateDeliveryDetails({
    id,
    client,
    engagement,
    title,
    dueAt: dueAt ? new Date(`${dueAt}T12:00:00`).toISOString() : null,
    owner,
    blocker: blocker || null
  });

  revalidatePath("/");
  revalidatePath("/delivery");
}
