import type { StatusTone } from "@/types/domain";

type StatusBadgeProps = {
  tone: StatusTone;
  label: string;
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return <span className={`status-badge ${tone}`}>{label}</span>;
}
