import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: ReactNode;

  title: ReactNode;

  description?: ReactNode;

  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-copy">
        {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}

        <h1>{title}</h1>

        {description && <p>{description}</p>}
      </div>

      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
