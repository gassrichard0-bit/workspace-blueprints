import type { DashboardStat } from "@/types/domain";

type HeroProps = {
  title: string;
  description: string;
  stats: DashboardStat[];
};

export function Hero({ title, description, stats }: HeroProps) {
  return (
    <section className="hero">
      <p className="eyebrow">Internal First MVP</p>
      <h1>{title}</h1>
      <p>{description}</p>

      <div className="hero-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="label">{stat.label}</span>
            <span className="value">{stat.value}</span>
            <span className="meta">{stat.meta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
