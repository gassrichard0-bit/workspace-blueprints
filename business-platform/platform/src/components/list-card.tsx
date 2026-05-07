import { ReactNode } from "react";

type ListCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ListCard({ title, description, children }: ListCardProps) {
  return (
    <section className="list-card">
      <div className="section-header">
        <div>
          <h2 className="section-title">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="list-stack">{children}</div>
    </section>
  );
}
