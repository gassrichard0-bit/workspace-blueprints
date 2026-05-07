import { Hero } from "@/components/hero";
import { updateOnboardingStatusAction } from "@/app/clients/actions";
import { getOnboardingForUi, getOnboardingStats } from "@/lib/clients";

export default async function OnboardingPage() {
  const [onboardingStats, checklistItems] = await Promise.all([
    getOnboardingStats(),
    getOnboardingForUi()
  ]);

  return (
    <div className="stack">
      <Hero
        title="A won deal should turn into a clean start."
        description="The onboarding module standardizes client activation so nothing important gets lost between sales and delivery."
        stats={onboardingStats}
      />

      <section className="detail-grid">
        {checklistItems.map((item) => (
          <article key={item.id} className="detail-card">
            <p className="eyebrow">Client onboarding</p>
            <h3>{item.clientName}</h3>
            <div className="badge-row">
              <span className={`badge ${item.tone}`}>{item.status}</span>
              <span className="badge neutral">Owner: {item.owner}</span>
              <span className="badge neutral">Due: {item.due}</span>
            </div>
            <ul>
              {item.items.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
            <form action={updateOnboardingStatusAction} className="form-actions">
              <input type="hidden" name="id" value={item.id} />
              <select name="status" defaultValue={item.status}>
                <option>In progress</option>
                <option>Blocked</option>
                <option>Complete</option>
              </select>
              <button className="button secondary" type="submit">
                Update onboarding
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
