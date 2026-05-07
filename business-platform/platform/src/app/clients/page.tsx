import { Hero } from "@/components/hero";
import { ListCard } from "@/components/list-card";
import { StatusBadge } from "@/components/status-badge";
import { SyncAssetsButton } from "@/components/sync-assets-button";
import {
  createClientAction,
  convertWonLeadAction,
  updateClientDetailsAction,
  updateClientStatusesAction
} from "@/app/clients/actions";
import { getClientStats, getEditableClients } from "@/lib/clients";
import { getLeadsForUi } from "@/lib/leads";

export default async function ClientsPage() {
  const [clientStats, clients, leads] = await Promise.all([
    getClientStats(),
    getEditableClients(),
    getLeadsForUi()
  ]);
  const wonLeads = leads.filter((lead) => lead.stage === "Won");

  return (
    <div className="stack">
      <Hero
        title="Client records should bridge sales and delivery."
        description="Once a deal is won, the platform needs to carry that context into onboarding and active service work without rework."
        stats={clientStats}
      />

      <section className="panel-card">
        <h2 className="panel-title">Client Assets</h2>
        <p className="section-copy">Pull raw video URLs submitted via the Client Portal into your client records.</p>
        <SyncAssetsButton />
      </section>

      <ListCard
        title="Client Accounts"
        description="The client module should show account context, onboarding state, delivery state, and ownership in one place."
      >
        {clients.map((client) => (
          <article key={client.id} className="list-row">
            <div className="list-topline">
              <div>
                <h3>{client.name}</h3>
                <p>
                  {client.primaryContact} · {client.offer}
                </p>
              </div>
              <StatusBadge tone={client.tone} label={client.deliveryStatus} />
            </div>

            <div className="row-meta">
              <span>Onboarding: {client.onboardingStatus}</span>
              <span>Owner: {client.owner}</span>
            </div>

            <form action={updateClientStatusesAction} className="form-actions">
              <input type="hidden" name="id" value={client.id} />
              <select name="onboardingStatus" defaultValue={client.onboardingStatus}>
                <option>In progress</option>
                <option>Blocked</option>
                <option>Complete</option>
              </select>
              <select name="deliveryStatus" defaultValue={client.deliveryStatus}>
                <option>Not started</option>
                <option>Needs review</option>
                <option>On track</option>
                <option>Blocked</option>
                <option>Complete</option>
              </select>
              <button className="button secondary" type="submit">
                Update client
              </button>
            </form>

            <form action={updateClientDetailsAction} className="field-list">
              <input type="hidden" name="id" value={client.id} />
              <label>
                Client name
                <input name="name" defaultValue={client.name} />
              </label>
              <label>
                Primary contact
                <input name="primaryContact" defaultValue={client.primaryContactRaw} />
              </label>
              <label>
                Offer
                <input name="offer" defaultValue={client.offerRaw} />
              </label>
              <label>
                Owner
                <input name="owner" defaultValue={client.ownerRaw} />
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

      <section className="section-grid">
        <section className="panel-card">
          <h2 className="panel-title">Create Client</h2>
          <p className="section-copy">
            Save a client directly into the platform and optionally start onboarding immediately.
          </p>

          <form action={createClientAction} className="field-list">
            <label>
              Client name
              <input name="name" placeholder="Harbor Health" required />
            </label>
            <label>
              Primary contact
              <input name="primaryContact" placeholder="Marcus Wu" required />
            </label>
            <label>
              Offer / engagement
              <input name="offer" placeholder="Delivery platform buildout" required />
            </label>
            <label>
              Owner
              <input name="owner" defaultValue="Richard" />
            </label>
            <label>
              Industry / niche
              <input name="niche" placeholder="B2B financial consulting for startups" />
            </label>
            <label>
              Target audience
              <input name="audience" placeholder="Seed-stage startup founders, ages 28-45" />
            </label>
            <label>
              Content platform
              <select name="platform" defaultValue="LinkedIn">
                <option>LinkedIn</option>
                <option>Twitter/X</option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>TikTok</option>
                <option>Newsletter</option>
              </select>
            </label>
            <label>
              Content format
              <select name="contentFormat" defaultValue="Written">
                <option>Written</option>
                <option>Video Shorts</option>
                <option>Both</option>
              </select>
            </label>
            <label>
              Raw video drive link
              <input name="videoAssetsUrl" placeholder="e.g. Google Drive or Dropbox link..." />
            </label>
            <label>
              Onboarding status
              <select name="onboardingStatus" defaultValue="In progress">
                <option>In progress</option>
                <option>Blocked</option>
                <option>Complete</option>
              </select>
            </label>
            <label>
              Delivery status
              <select name="deliveryStatus" defaultValue="Not started">
                <option>Not started</option>
                <option>Needs review</option>
                <option>On track</option>
                <option>Blocked</option>
              </select>
            </label>
            <div className="form-actions">
              <button className="button" type="submit">
                Save client
              </button>
            </div>
          </form>
        </section>

        <section className="panel-card">
          <h2 className="panel-title">Convert Won Lead</h2>
          <p className="section-copy">
            This is the first handoff path from sales into client activation.
          </p>

          <div className="list-stack">
            {wonLeads.length ? (
              wonLeads.map((lead) => (
                <article key={lead.id} className="list-row">
                  <div className="list-topline">
                    <div>
                      <h3>{lead.company}</h3>
                      <p>
                        {lead.name} · {lead.serviceInterest}
                      </p>
                    </div>
                    <StatusBadge tone={lead.tone} label={lead.stage} />
                  </div>

                  <form action={convertWonLeadAction} className="form-actions">
                    <input type="hidden" name="name" value={lead.company} />
                    <input type="hidden" name="primaryContact" value={lead.name} />
                    <input type="hidden" name="offer" value={lead.serviceInterest} />
                    <input type="hidden" name="owner" value={lead.owner} />
                    <button className="button secondary" type="submit">
                      Convert to client
                    </button>
                  </form>
                </article>
              ))
            ) : (
              <p className="empty">No won leads are ready to convert right now.</p>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
