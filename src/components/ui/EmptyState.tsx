import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: ReactNode;

  description?: ReactNode;

  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>

      {description && <p>{description}</p>}

      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
