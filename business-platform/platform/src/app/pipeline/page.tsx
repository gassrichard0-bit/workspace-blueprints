import { Hero } from "@/components/hero";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardLeadStats, getLeadsForUi, getPipelineStages } from "@/lib/leads";

export default async function PipelinePage() {
  const [leadStats, leads, pipelineStages] = await Promise.all([
    getDashboardLeadStats(),
    getLeadsForUi(),
    getPipelineStages()
  ]);

  const pipelineStats = [
    { label: "Pipeline value", value: leadStats[0]?.value ?? "$0", meta: "Across active stages" },
    { label: "Leads due today", value: leadStats[1]?.value ?? "0", meta: "Need same-day movement" },
    { label: "Won value", value: leadStats[2]?.value ?? "$0", meta: "Already converted" },
    { label: "Overdue follow-ups", value: leadStats[3]?.value ?? "0", meta: "Needs owner reset" }
  ];

  const activeLeads = leads.filter((lead) => lead.stage !== "Won" && lead.stage !== "Lost");

  return (
    <div className="stack">
      <Hero
        title="Pipeline should show movement, not just records."
        description="This view is shaped around stage visibility, follow-up discipline, and spotting stuck revenue before it slips."
        stats={pipelineStats}
      />

      <section className="panel-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Stage Summary</h2>
            <p>Use stage counts and value together so the owner sees quality, not just volume.</p>
          </div>
        </div>

        <div className="module-grid">
          {pipelineStages.map((stage) => (
            <article key={stage.name} className="module-card">
              <h3>{stage.name}</h3>
              <div className="card-meta">
                <span className="badge neutral">{stage.count} deals</span>
                <span className="badge good">{stage.value}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card">
        <h2 className="panel-title">Deals Needing Movement</h2>
        <div className="list-stack">
          {activeLeads.map((lead) => (
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
                <span>Next follow-up: {lead.followUp}</span>
                <span>Value: {lead.estimatedValue}</span>
                <span>Owner: {lead.owner}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
