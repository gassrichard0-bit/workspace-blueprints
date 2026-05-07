import { Hero } from "@/components/hero";
import { ListCard } from "@/components/list-card";
import { StatusBadge } from "@/components/status-badge";
import {
  createDeliveryAction,
  updateDeliveryDetailsAction,
  updateDeliveryStatusAction
} from "@/app/delivery/actions";
import { getDeliveryStats, getEditableDeliveryItems } from "@/lib/delivery";

export default async function DeliveryPage() {
  const [deliveryStats, deliveryItems] = await Promise.all([
    getDeliveryStats(),
    getEditableDeliveryItems()
  ]);

  return (
    <div className="stack">
      <Hero
        title="Delivery visibility is what makes the platform real."
        description="This module is where the business stops relying on memory and starts seeing who owns what, what is late, and what is blocked."
        stats={deliveryStats}
      />

      <ListCard
        title="Active Delivery Items"
        description="Every active piece of work should have a status, owner, due date, and blocker state."
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

            <form action={updateDeliveryStatusAction} className="form-actions">
              <input type="hidden" name="id" value={item.id} />
              <select name="status" defaultValue={item.status}>
                <option>On track</option>
                <option>In review</option>
                <option>Needs review</option>
                <option>Blocked</option>
                <option>Complete</option>
              </select>
              <button className="button secondary" type="submit">
                Update delivery
              </button>
            </form>

            <form action={updateDeliveryDetailsAction} className="field-list">
              <input type="hidden" name="id" value={item.id} />
              <label>
                Client
                <input name="client" defaultValue={item.clientRaw} />
              </label>
              <label>
                Engagement
                <input name="engagement" defaultValue={item.engagementRaw} />
              </label>
              <label>
                Work item
                <input name="title" defaultValue={item.titleRaw} />
              </label>
              <label>
                Due date
                <input name="dueAt" type="date" defaultValue={item.dueDateInput} />
              </label>
              <label>
                Owner
                <input name="owner" defaultValue={item.ownerRaw} />
              </label>
              <label>
                Blocker
                <textarea name="blocker" rows={3} defaultValue={item.blockerRaw} />
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
        <h2 className="panel-title">Create Delivery Item</h2>
        <p className="section-copy">
          Save active work into the platform so the owner dashboard can track risk, due dates, and accountability.
        </p>

        <form action={createDeliveryAction} className="field-list">
          <label>
            Client
            <input name="client" placeholder="Luna Advisory" required />
          </label>
          <label>
            Engagement
            <input name="engagement" placeholder="Monthly operations retainer" required />
          </label>
          <label>
            Work item
            <input name="title" placeholder="Finalize KPI dashboard" required />
          </label>
          <label>
            Due date
            <input name="dueAt" type="date" />
          </label>
          <label>
            Status
            <select name="status" defaultValue="On track">
              <option>On track</option>
              <option>In review</option>
              <option>Needs review</option>
              <option>Blocked</option>
              <option>Complete</option>
            </select>
          </label>
          <label>
            Owner
            <input name="owner" defaultValue="Richard" />
          </label>
          <label>
            Blocker
            <textarea name="blocker" rows={3} placeholder="Optional blocker note if the work is stalled." />
          </label>
          <div className="form-actions">
            <button className="button" type="submit">
              Save delivery item
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
