import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DashboardStat } from "@/types/domain";

// ── Types ────────────────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionCategory =
  | "Client payment"
  | "Retainer"
  | "Project fee"
  | "Software"
  | "Contractor"
  | "Marketing"
  | "Equipment"
  | "Other";

export type StoredTransaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  client: string | null;
  date: string;
  invoiceNumber: string | null;
  createdAt: string;
};

export type TransactionUi = {
  id: string;
  type: TransactionType;
  amount: string;
  amountRaw: number;
  category: TransactionCategory;
  description: string;
  client: string;
  date: string;
  invoiceNumber: string;
};

// ── Constants ────────────────────────────────────────────────────────────────

const financeFile = path.join(process.cwd(), "data", "finance.json");

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );
}

// ── File I/O ─────────────────────────────────────────────────────────────────

async function getStoredTransactions(): Promise<StoredTransaction[]> {
  const raw = await readFile(financeFile, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return (parsed as StoredTransaction[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getTransactionsForUi(): Promise<TransactionUi[]> {
  const items = await getStoredTransactions();
  return items.map((t) => ({
    id: t.id,
    type: t.type,
    amount: (t.type === "INCOME" ? "+" : "-") + formatCurrency(t.amount),
    amountRaw: t.amount,
    category: t.category,
    description: t.description,
    client: t.client ?? "—",
    date: formatDate(t.date),
    invoiceNumber: t.invoiceNumber ?? "—"
  }));
}

export async function getFinanceStats(): Promise<DashboardStat[]> {
  const items = await getStoredTransactions();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = items.filter((t) => new Date(t.date) >= startOfMonth);

  const totalIncome = items.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = items.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const monthIncome = thisMonth.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const monthExpenses = thisMonth.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  return [
    { label: "Total revenue", value: formatCurrency(totalIncome), meta: "All time income" },
    { label: "Total expenses", value: formatCurrency(totalExpenses), meta: "All time costs" },
    { label: "This month in", value: formatCurrency(monthIncome), meta: "Revenue this calendar month" },
    { label: "Net this month", value: formatCurrency(monthIncome - monthExpenses), meta: "Profit after expenses" }
  ];
}

export async function createTransaction(input: {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  client: string | null;
  date: string;
  invoiceNumber: string | null;
}) {
  const items = await getStoredTransactions();
  const now = new Date().toISOString();
  items.unshift({
    id: `txn-${Date.now()}`,
    type: input.type,
    amount: input.amount,
    category: input.category,
    description: input.description,
    client: input.client || null,
    date: input.date,
    invoiceNumber: input.invoiceNumber || null,
    createdAt: now
  });
  // Re-sort before writing
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  await writeFile(financeFile, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}
