"use client";

import { useState } from "react";
import { syncWebsiteLeadsAction } from "@/app/leads/actions";

export function SyncLeadsButton() {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSync() {
    setStatus("syncing");
    setMessage("");
    const result = await syncWebsiteLeadsAction();
    if (result.ok) {
      setStatus("done");
      setMessage(
        result.added > 0
          ? `✓ ${result.added} new lead${result.added > 1 ? "s" : ""} synced from website!`
          : "✓ No new leads — everything is up to date."
      );
      // Reset after 5 seconds
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 5000);
    } else {
      setStatus("error");
      setMessage(`⚠️ ${result.error}`);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <button
        className="button"
        onClick={handleSync}
        disabled={status === "syncing"}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
      >
        {status === "syncing" ? "Syncing…" : "🔄 Sync Leads from Website"}
      </button>
      {message && (
        <span style={{
          fontSize: "0.88rem",
          fontWeight: 600,
          color: status === "error" ? "var(--c-problem)" : "var(--c-ok)"
        }}>
          {message}
        </span>
      )}
    </div>
  );
}
