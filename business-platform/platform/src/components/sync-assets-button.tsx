"use client";

import { useState } from "react";
import { syncClientAssetsAction } from "@/app/clients/actions";

export function SyncAssetsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; updated: number; error?: string } | null>(null);

  async function handleSync() {
    setLoading(true);
    setResult(null);
    try {
      const res = await syncClientAssetsAction();
      setResult(res);
    } catch (e) {
      setResult({ ok: false, updated: 0, error: String(e) });
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <button 
        className="button secondary" 
        onClick={handleSync} 
        disabled={loading}
      >
        {loading ? "Syncing..." : "🔄 Sync Client Assets"}
      </button>
      
      {result && (
        <span style={{ fontSize: "14px", fontWeight: 600, color: result.ok ? "var(--good)" : "var(--danger)" }}>
          {result.ok 
            ? `✓ ${result.updated} client asset links updated!` 
            : `⚠️ Sync failed: ${result.error}`}
        </span>
      )}
    </div>
  );
}
