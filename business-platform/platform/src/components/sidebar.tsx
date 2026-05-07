"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const coreNav = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/leads", label: "Leads", icon: "◎" },
  { href: "/pipeline", label: "Pipeline", icon: "⇢" },
  { href: "/clients", label: "Clients", icon: "✦" },
  { href: "/onboarding", label: "Onboarding", icon: "◈" },
  { href: "/delivery", label: "Delivery", icon: "◉" }
];

const growthNav = [
  { href: "/content", label: "Content", icon: "✎" },
  { href: "/finance", label: "Finance", icon: "$" },
  { href: "/ai", label: "AI Brain", icon: "⚡" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="eyebrow">QQL Business OS</p>
        <h1 className="brand-title">Operator Console</h1>
        <p className="brand-copy">
          Leads → clients → delivery → finance → content. All in one place.
        </p>
      </div>

      <div className="nav-group">
        <p className="nav-label">Operations</p>
        <nav className="nav-list">
          {coreNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="nav-group">
        <p className="nav-label">Growth</p>
        <nav className="nav-list">
          {growthNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${isActive ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-foot">
        <p className="eyebrow">Solo Operator</p>
        <strong>AI is your team.</strong>
        <p className="brand-copy">
          Gemini handles summaries, emails, and briefs. You close deals and deliver.
        </p>
      </div>
    </aside>
  );
}
