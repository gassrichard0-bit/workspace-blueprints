import { Hero } from "@/components/hero";
import { StatusBadge } from "@/components/status-badge";
import { getContentForUi, getContentStats, stageOrder, stageLabelMap } from "@/lib/content";
import { createContentAction, updateContentStageAction } from "@/app/content/actions";

export default async function ContentPage() {
  const [stats, items] = await Promise.all([getContentStats(), getContentForUi()]);

  return (
    <div className="stack">
      <Hero
        title="Content should move, not drift."
        description="This pipeline tracks every piece of content from idea to published — for your brand and your clients. Use it to see what's stuck and what's ready."
        stats={stats}
      />

      <section className="section-grid">
        {/* Content Queue */}
        <section className="panel-card">
          <h2 className="panel-title">Active Pipeline</h2>
          <p className="section-copy">Every piece in progress, sorted by most recent.</p>

          {items.length === 0 ? (
            <p className="empty" style={{ marginTop: "18px" }}>
              No content in the pipeline yet. Add your first piece using the form.
            </p>
          ) : (
            <div className="list-stack">
              {items.map((item) => (
                <article key={item.id} className="list-row">
                  <div className="list-topline">
                    <div>
                      <h3>{item.title}</h3>
                      <p>
                        {item.platform} · {item.client}
                      </p>
                    </div>
                    <StatusBadge tone={item.tone} label={item.stage} />
                  </div>

                  <div className="row-meta">
                    <span>Scheduled: {item.scheduledAt}</span>
                    <span>Owner: {item.owner}</span>
                    {item.notes ? <span>Note: {item.notes}</span> : null}
                  </div>

                  <form action={updateContentStageAction} className="form-actions" style={{ marginTop: "12px" }}>
                    <input type="hidden" name="id" value={item.id} />
                    <select name="stage" defaultValue={item.stageRaw}>
                      {stageOrder.map((s) => (
                        <option key={s} value={s}>
                          {stageLabelMap[s]}
                        </option>
                      ))}
                    </select>
                    <button className="button secondary" type="submit">
                      Move stage
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Add Content Form */}
        <section className="panel-card">
          <h2 className="panel-title">Add to Pipeline</h2>
          <p className="section-copy">
            Capture an idea fast. Everything starts as an idea — flesh it out as it moves through the stages.
          </p>

          <form action={createContentAction} className="field-list">
            <label>
              Title or working headline
              <input name="title" placeholder="5 things no one tells you about client onboarding" required />
            </label>
            <label>
              Platform
              <select name="platform" defaultValue="LinkedIn">
                <option>LinkedIn</option>
                <option>Twitter/X</option>
                <option>Instagram</option>
                <option>Newsletter</option>
                <option>Blog</option>
                <option>YouTube</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Client (leave blank for own brand)
              <input name="client" placeholder="Luna Advisory" />
            </label>
            <label>
              Owner
              <input name="owner" defaultValue="Richard" />
            </label>
            <label>
              Scheduled date (optional)
              <input name="scheduledAt" type="date" />
            </label>
            <label>
              Notes
              <textarea name="notes" rows={3} placeholder="Angle, hook idea, source material..." />
            </label>
            <div className="form-actions">
              <button className="button" type="submit">
                Add to pipeline
              </button>
            </div>
          </form>
        </section>
      </section>

      {/* Stage Overview */}
      <section className="panel-card">
        <h2 className="panel-title">Stage Breakdown</h2>
        <p className="section-copy">See where content is piling up and where it needs to move.</p>
        <div className="kpi-grid">
          {stageOrder.map((stage) => {
            const count = items.filter((i) => i.stageRaw === stage).length;
            return (
              <div key={stage} className="mini-card">
                <span className="mini-label" style={{ color: "var(--muted)" }}>
                  {stageLabelMap[stage]}
                </span>
                <strong>{count}</strong>
                <p>pieces in this stage</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
