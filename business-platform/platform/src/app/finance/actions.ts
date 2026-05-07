"use server";

import { revalidatePath } from "next/cache";
import { createTransaction, type TransactionType, type TransactionCategory } from "@/lib/finance";

export async function createTransactionAction(formData: FormData) {
  const type = String(formData.get("type") ?? "INCOME").trim() as TransactionType;
  const amount = Number(String(formData.get("amount") ?? "0").trim().replace(/[^0-9.]/g, ""));
  const category = String(formData.get("category") ?? "Other").trim() as TransactionCategory;
  const description = String(formData.get("description") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim() || null;
  const dateRaw = String(formData.get("date") ?? "").trim();
  const invoiceNumber = String(formData.get("invoiceNumber") ?? "").trim() || null;

  if (!description || !dateRaw || !amount) return;

  await createTransaction({
    type,
    amount,
    category,
    description,
    client,
    date: new Date(`${dateRaw}T12:00:00`).toISOString(),
    invoiceNumber
  });

  revalidatePath("/finance");
  revalidatePath("/");
}
