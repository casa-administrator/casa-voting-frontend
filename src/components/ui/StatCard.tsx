import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: ReactNode;

  value: ReactNode;

  detail?: ReactNode;

  icon?: ReactNode;
}) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>

        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>

      <strong className="stat-card-value">{value}</strong>

      {detail && <small className="stat-card-detail">{detail}</small>}
    </article>
  );
}
