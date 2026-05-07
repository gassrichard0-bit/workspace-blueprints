import { Hero } from "@/components/hero";
import { ListCard } from "@/components/list-card";
import { StatusBadge } from "@/components/status-badge";
import { dashboardAlerts, ownerTimeline } from "@/lib/mock-data";
import { getClientsForUi } from "@/lib/clients";
import { getDeliveryItemsForUi } from "@/lib/delivery";
import { getDashboardLeadStats, getLeadsForUi, getPipelineStages } from "@/lib/leads";

export default async function DashboardPage() {
  const [dashboardStats, liveLeads, pipelineStages, clients, deliveryItems] = await Promise.all([
    getDashboardLeadStats(),
    getLeadsForUi(),
    getPipelineStages(),
    getClientsForUi(),
    getDeliveryItemsForUi()
  ]);

  return (
    <div className="stack">
      <Hero
        title="Run the business without hunting for answers."
        description="This first version is designed to make sales, onboarding, and delivery status visible from one operating screen."
        stats={dashboardStats}
      />

      <section className="section-grid">
        <div className="stack">
          <section className="panel-card">
            <h2 className="panel-title">Owner Priorities</h2>
            <p className="section-copy">
              These are the business signals that need attention before the day drifts.
            </p>

            <div className="list-stack">
              {dashboardAlerts.map((alert) => (
                <article key={alert.title} className="list-row">
                  <div className="list-topline">
                    <div>
                      <h3>{alert.title}</h3>
                      <p>{alert.summary}</p>
                    </div>
                    <StatusBadge tone={alert.tone} label={alert.meta} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel-card">
            <h2 className="panel-title">Pipeline Overview</h2>
            <p className="section-copy">The owner dashboard should show where deals are stacking and where value sits.</p>

            <div className="kpi-grid">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="mini-card">
                  <span className="mini-label">{stage.name}</span>
                  <strong>{stage.count}</strong>
                  <p>{stage.value} in value</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel-card">
            <h2 className="panel-title">Onboarding + Delivery Risk</h2>
            <p className="section-copy">The platform should make client state obvious without opening five tools.</p>

            <div className="list-stack">
              {clients.map((client) => (
                <article key={client.id} className="list-row">
                  <div className="list-topline">
                    <div>
                      <h3>{client.name}</h3>
                      <p>{client.offer}</p>
                    </div>
                    <StatusBadge tone={client.tone} label={client.deliveryStatus} />
                  </div>

                  <div className="row-meta">
                    <span>Onboarding: {client.onboardingStatus}</span>
                    <span>Owner: {client.owner}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel-card">
            <h2 className="panel-title">Activity Feed</h2>
            <div className="timeline">
              {ownerTimeline.map((item) => (
                <div key={item.id} className="timeline-row">
                  <time>{item.time}</time>
                  <div>
                    <p>{item.body}</p>
                    <span className="mini-label">{item.by}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <ListCard
        title="Lead Queue"
        description="The platform should make lead follow-up and deal movement visible without a spreadsheet chase."
      >
        {liveLeads.map((lead) => (
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

            <div className="row-meta">
              <span>Follow-up: {lead.followUp}</span>
              <span>Source: {lead.source}</span>
              <span>Value: {lead.estimatedValue}</span>
              <span>Owner: {lead.owner}</span>
            </div>
          </article>
        ))}
      </ListCard>

      <ListCard
        title="Delivery Focus"
        description="A quick scan of active work should surface what is moving, blocked, or due now."
      >
        {deliveryItems.map((item) => (
          <article key={item.id} className="list-row">
            <div className="list-topline">
              <div>
                <h3>{item.title}</h3>
                <p>
                  {item.client} · {item.engagement}
                </p>
              </div>
              <StatusBadge tone={item.tone} label={item.status} />
            </div>

            <div className="row-meta">
              <span>Due: {item.dueDate}</span>
              <span>Owner: {item.owner}</span>
              {item.blocker ? <span>Blocker: {item.blocker}</span> : null}
            </div>
          </article>
        ))}
      </ListCard>
    </div>
  );
}
