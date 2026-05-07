import { Hero } from "@/components/hero";
import { StatusBadge } from "@/components/status-badge";
import { getTransactionsForUi, getFinanceStats } from "@/lib/finance";
import { createTransactionAction } from "@/app/finance/actions";

export default async function FinancePage() {
  const [stats, transactions] = await Promise.all([getFinanceStats(), getTransactionsForUi()]);

  return (
    <div className="stack">
      <Hero
        title="Money in, money out — stay clear."
        description="Log every transaction so you always know where revenue stands. This dashboard is your financial ground truth — no spreadsheet required."
        stats={stats}
      />

      <section className="section-grid">
        {/* Transaction Log */}
        <section className="panel-card">
          <h2 className="panel-title">Transaction Log</h2>
          <p className="section-copy">All income and expenses, sorted by most recent.</p>

          {transactions.length === 0 ? (
            <p className="empty" style={{ marginTop: "18px" }}>
              No transactions logged yet. Add your first using the form.
            </p>
          ) : (
            <div className="list-stack">
              {transactions.map((txn) => (
                <article key={txn.id} className="list-row">
                  <div className="list-topline">
                    <div>
                      <h3>{txn.description}</h3>
                      <p>
                        {txn.category} · {txn.client}
                      </p>
                    </div>
                    <StatusBadge
                      tone={txn.type === "INCOME" ? "good" : "neutral"}
                      label={txn.amount}
                    />
                  </div>
                  <div className="row-meta">
                    <span>Date: {txn.date}</span>
                    {txn.invoiceNumber !== "—" ? <span>Invoice: {txn.invoiceNumber}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Log Transaction Form */}
        <section className="panel-card">
          <h2 className="panel-title">Log Transaction</h2>
          <p className="section-copy">
            Record every dollar in and out so your numbers are always current.
          </p>

          <form action={createTransactionAction} className="field-list">
            <label>
              Type
              <select name="type" defaultValue="INCOME">
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </label>
            <label>
              Amount ($)
              <input name="amount" type="number" min="0" step="1" placeholder="3000" required />
            </label>
            <label>
              Category
              <select name="category" defaultValue="Client payment">
                <option>Client payment</option>
                <option>Retainer</option>
                <option>Project fee</option>
                <option>Software</option>
                <option>Contractor</option>
                <option>Marketing</option>
                <option>Equipment</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Description
              <input name="description" placeholder="Luna Advisory — April retainer" required />
            </label>
            <label>
              Client (optional)
              <input name="client" placeholder="Luna Advisory" />
            </label>
            <label>
              Date
              <input name="date" type="date" required />
            </label>
            <label>
              Invoice number (optional)
              <input name="invoiceNumber" placeholder="INV-001" />
            </label>
            <div className="form-actions">
              <button className="button" type="submit">
                Log transaction
              </button>
            </div>
          </form>
        </section>
      </section>
    </div>
  );
}
