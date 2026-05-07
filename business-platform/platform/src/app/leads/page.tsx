import { Hero } from "@/components/hero";
import { ListCard } from "@/components/list-card";
import { StatusBadge } from "@/components/status-badge";
import { createLeadAction, updateLeadDetailsAction, updateLeadStageAction } from "@/app/leads/actions";
import { getDashboardLeadStats, getEditableLeads } from "@/lib/leads";
import { SyncLeadsButton } from "@/app/leads/sync-button";

export default async function LeadsPage() {
  const [leadStats, leads] = await Promise.all([getDashboardLeadStats(), getEditableLeads()]);

  return (
    <div className="stack">
      <Hero
        title="Lead intake should feel fast, not fragile."
        description="This module is built to capture opportunities quickly, keep follow-up visible, and prevent pipeline drift."
        stats={leadStats}
      />

      <section className="panel-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="panel-title" style={{ marginBottom: "4px" }}>Website Leads</h2>
          <p className="section-copy">Pull new inquiries from contentai-landing.netlify.app into your pipeline.</p>
        </div>
        <SyncLeadsButton />
      </section>

      <section className="section-grid">
        <ListCard
          title="Lead Queue"
          description="Every lead needs a current stage, an owner, and a next move."
        >
          {leads.map((lead) => (
            <article key={lead.id} className="list-row">
              <div className="list-topline">
                <div>
                  <h3>{lead.name}</h3>
                  <p>
                    {lead.company} · {lead.serviceInterest}
                  </p>
                </div>
                <StatusBadge tone={lead.tone} label={lead.stage} />
              </div>

              <div className="row-meta">
                <span>Source: {lead.source}</span>
                <span>Follow-up: {lead.followUp}</span>
                <span>Value: {lead.estimatedValue}</span>
                <span>Owner: {lead.owner}</span>
              </div>

              <form action={updateLeadStageAction} className="form-actions">
                <input type="hidden" name="id" value={lead.id} />
                <select name="stage" defaultValue={lead.stage}>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Proposal Sent</option>
                  <option>Negotiation</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
                <button className="button secondary" type="submit">
                  Update stage
                </button>
              </form>

              <form action={updateLeadDetailsAction} className="field-list">
                <input type="hidden" name="id" value={lead.id} />
                <label>
                  Source
                  <input name="source" defaultValue={lead.sourceRaw} />
                </label>
                <label>
                  Owner
                  <input name="owner" defaultValue={lead.ownerRaw} />
                </label>
                <label>
                  Estimated value
                  <input name="estimatedValue" type="number" min="0" step="1000" defaultValue={lead.estimatedValueNumber} />
                </label>
                <label>
                  Follow-up date
                  <input name="followUpAt" type="date" defaultValue={lead.followUpDateInput} />
                </label>
                <label>
                  Notes
                  <textarea name="notes" rows={3} defaultValue={lead.notes} />
                </label>
                <div className="form-actions">
                  <button className="button secondary" type="submit">
                    Save details
                  </button>
                </div>
              </form>
            </article>
          ))}
        </ListCard>

        <section className="panel-card">
          <h2 className="panel-title">Quick Capture</h2>
          <p className="section-copy">
            This form writes into the local database so the lead queue and pipeline update from real records.
          </p>

          <form action={createLeadAction} className="field-list">
            <label>
              Lead name
              <input name="name" placeholder="Jada Cole" required />
            </label>
            <label>
              Company
              <input name="company" placeholder="Northline Media" required />
            </label>
            <label>
              Service interest
              <input name="serviceInterest" placeholder="Business platform buildout" required />
            </label>
            <label>
              Source
              <select name="source" defaultValue="Website form">
                <option>Website form</option>
                <option>Referral</option>
                <option>Outbound</option>
                <option>Past client</option>
              </select>
            </label>
            <label>
              Owner
              <input name="owner" defaultValue="Richard" />
            </label>
            <label>
              Stage
              <select name="stage" defaultValue="New">
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal Sent</option>
                <option>Negotiation</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </label>
            <label>
              Estimated value
              <input name="estimatedValue" type="number" min="0" step="1000" placeholder="12000" />
            </label>
            <label>
              Follow-up date
              <input name="followUpAt" type="date" />
            </label>
            <label>
              Notes
              <textarea name="notes" rows={4} placeholder="Anything the owner should remember before the next touch." />
            </label>
            <div className="form-actions">
              <button className="button" type="submit">
                Save lead
              </button>
            </div>
          </form>
        </section>
      </section>
    </div>
  );
}
